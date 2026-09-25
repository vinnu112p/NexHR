import { query } from './db.js';

export interface AuditLogEntry {
  id?: string;
  tableName: string;
  recordId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'IMPERSONATE' | 'END_IMPERSONATE' | 'APPROVE' | 'REFUSE' | 'PAYROLL_EXECUTE';
  changedBy: string;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
}

/**
 * Record an entry into the audit_logs system table
 */
export async function logAudit(entry: AuditLogEntry): Promise<void> {
  const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  try {
    await query(
      `INSERT INTO audit_logs (id, table_name, record_id, action, changed_by, old_values, new_values, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
      [
        id,
        entry.tableName,
        entry.recordId,
        entry.action,
        entry.changedBy,
        entry.oldValues ? JSON.stringify(entry.oldValues) : null,
        entry.newValues ? JSON.stringify(entry.newValues) : null,
      ]
    );
  } catch (err) {
    console.error('[Audit Log Error]', err);
  }
}

/**
 * Query audit trail records with optional filtering and pagination
 */
export async function getAuditLogs(options?: {
  tableName?: string;
  recordId?: string;
  changedBy?: string;
  action?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: any[]; total: number; page: number; totalPages: number }> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (options?.tableName) {
    conditions.push(`table_name = $${params.length + 1}`);
    params.push(options.tableName);
  }
  if (options?.recordId) {
    conditions.push(`record_id = $${params.length + 1}`);
    params.push(options.recordId);
  }
  if (options?.changedBy) {
    conditions.push(`changed_by = $${params.length + 1}`);
    params.push(options.changedBy);
  }
  if (options?.action) {
    conditions.push(`action = $${params.length + 1}`);
    params.push(options.action);
  }

  const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

  const countRes = await query(`SELECT COUNT(*)::int as total FROM audit_logs ${whereClause}`, params);
  const total = countRes.rows?.[0]?.total || 0;

  const page = options?.page || 1;
  const limit = options?.limit || 25;
  const offset = (page - 1) * limit;

  const listSql = `
    SELECT * FROM audit_logs
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;
  params.push(limit, offset);

  const listRes = await query(listSql, params);

  return {
    data: listRes.rows || [],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
