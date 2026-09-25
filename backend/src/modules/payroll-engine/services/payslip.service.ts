import { query } from '../../../core/db.js';
import { sendEmailDirect } from '../../../core/email.js';
import { payslipReadyTemplate } from '../../../core/email-templates.js';
import { PdfGeneratorService } from './pdf-generator.service.js';

export interface PayslipDetail {
  id: string;
  payrun_id: string;
  payrun_name: string;
  period_start: string;
  period_end: string;
  employee_id: string;
  employee_name: string;
  department_name: string;
  job_position: string;
  contract_wage: number;
  basic_wage: number;
  gross_wage: number;
  net_wage: number;
  status: string;
  lines: Array<{
    rule_id: string;
    code: string;
    name: string;
    category: string;
    sequence: number;
    amount: number;
  }>;
}

export class PayslipService {
  static async getPayslipById(id: string): Promise<PayslipDetail | null> {
    const psRes = await query(
      `SELECT ps.*, pr.name as payrun_name, pr.period_start, pr.period_end,
              e.first_name, e.last_name, e.job_position, d.name as department_name,
              COALESCE(c.wage, ps.basic_wage) as contract_wage
       FROM payslips ps
       LEFT JOIN payruns pr ON ps.payrun_id = pr.id
       LEFT JOIN employees e ON ps.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN contracts c ON ps.contract_id = c.id
       WHERE ps.id = $1`,
      [String(id)]
    );

    if (psRes.rows && psRes.rows.length > 0) {
      const row = psRes.rows[0];

      const linesRes = await query(
        `SELECT pl.amount, pl.id as line_id, pl.salary_rule_id as rule_id, pl.code, pl.name, pl.category, pl.sequence
         FROM payslip_lines pl
         WHERE pl.payslip_id = $1
         ORDER BY pl.sequence ASC`,
        [String(id)]
      );

      return {
        id: row.id,
        payrun_id: row.payrun_id,
        payrun_name: row.payrun_name || 'Payrun Batch',
        period_start: row.period_start,
        period_end: row.period_end,
        employee_id: row.employee_id,
        employee_name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.employee_id,
        department_name: row.department_name || 'General',
        job_position: row.job_position || 'Staff',
        contract_wage: Number(row.contract_wage || 0),
        basic_wage: Number(row.basic_wage || 0),
        gross_wage: Number(row.gross_wage || 0),
        net_wage: Number(row.net_wage || 0),
        status: row.status,
        lines: (linesRes.rows || []).map(l => ({
          rule_id: l.rule_id || l.line_id,
          code: l.code || 'COMP',
          name: l.name || 'Component',
          category: l.category || 'ALLOWANCE',
          sequence: Number(l.sequence || 10),
          amount: Number(l.amount || 0)
        }))
      };
    }

    return null;
  }

  static async getPayslipsByPayrunId(payrunId: string): Promise<PayslipDetail[]> {
    const psRes = await query(
      `SELECT ps.*, pr.name as payrun_name, pr.period_start as pr_period_start, pr.period_end as pr_period_end,
              e.first_name, e.last_name, e.job_position, d.name as department_name,
              COALESCE(c.wage, ps.basic_wage) as contract_wage
       FROM payslips ps
       LEFT JOIN payruns pr ON ps.payrun_id = pr.id
       LEFT JOIN employees e ON ps.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN contracts c ON ps.contract_id = c.id
       WHERE ps.payrun_id = $1
       ORDER BY ps.id ASC`,
      [String(payrunId)]
    );

    if (!psRes.rows || psRes.rows.length === 0) {
      return [];
    }

    const payslipIds = psRes.rows.map((r: any) => r.id);
    const linesRes = await query(
      `SELECT pl.payslip_id, pl.amount, pl.id as line_id, pl.salary_rule_id as rule_id, pl.code, pl.name, pl.category, pl.sequence
       FROM payslip_lines pl
       WHERE pl.payslip_id = ANY($1)
       ORDER BY pl.sequence ASC`,
      [payslipIds]
    );

    const linesByPayslip = new Map<string, any[]>();
    for (const line of (linesRes.rows || [])) {
      if (!linesByPayslip.has(line.payslip_id)) {
        linesByPayslip.set(line.payslip_id, []);
      }
      linesByPayslip.get(line.payslip_id)!.push({
        rule_id: line.rule_id || line.line_id,
        code: line.code || 'COMP',
        name: line.name || 'Component',
        category: line.category || 'ALLOWANCE',
        sequence: Number(line.sequence || 10),
        amount: Number(line.amount || 0),
      });
    }

    return psRes.rows.map((row: any) => ({
      id: row.id,
      payrun_id: row.payrun_id,
      payrun_name: row.payrun_name || 'Payrun Batch',
      period_start: row.period_start || row.pr_period_start,
      period_end: row.period_end || row.pr_period_end,
      employee_id: row.employee_id,
      employee_name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.employee_id,
      department_name: row.department_name || 'General',
      job_position: row.job_position || 'Staff',
      contract_wage: Number(row.contract_wage || 0),
      basic_wage: Number(row.basic_wage || 0),
      gross_wage: Number(row.gross_wage || 0),
      net_wage: Number(row.net_wage || 0),
      status: row.status,
      lines: linesByPayslip.get(row.id) || [],
    }));
  }

  static async getPayslipsByEmployeeId(employeeId: string): Promise<PayslipDetail[]> {
    const psRes = await query(
      `SELECT ps.*, pr.name as payrun_name, pr.period_start as pr_period_start, pr.period_end as pr_period_end,
              e.first_name, e.last_name, e.job_position, d.name as department_name,
              COALESCE(c.wage, ps.basic_wage) as contract_wage
       FROM payslips ps
       LEFT JOIN payruns pr ON ps.payrun_id = pr.id
       LEFT JOIN employees e ON ps.employee_id = e.id
       LEFT JOIN departments d ON e.department_id = d.id
       LEFT JOIN contracts c ON ps.contract_id = c.id
       WHERE ps.employee_id = $1
       ORDER BY ps.period_end DESC`,
      [String(employeeId)]
    );

    if (!psRes.rows || psRes.rows.length === 0) {
      return [];
    }

    const payslipIds = psRes.rows.map((r: any) => r.id);
    const linesRes = await query(
      `SELECT pl.payslip_id, pl.amount, pl.id as line_id, pl.salary_rule_id as rule_id, pl.code, pl.name, pl.category, pl.sequence
       FROM payslip_lines pl
       WHERE pl.payslip_id = ANY($1)
       ORDER BY pl.sequence ASC`,
      [payslipIds]
    );

    const linesByPayslip = new Map<string, any[]>();
    for (const line of (linesRes.rows || [])) {
      if (!linesByPayslip.has(line.payslip_id)) {
        linesByPayslip.set(line.payslip_id, []);
      }
      linesByPayslip.get(line.payslip_id)!.push({
        rule_id: line.rule_id || line.line_id,
        code: line.code || 'COMP',
        name: line.name || 'Component',
        category: line.category || 'ALLOWANCE',
        sequence: Number(line.sequence || 10),
        amount: Number(line.amount || 0),
      });
    }

    return psRes.rows.map((row: any) => ({
      id: row.id,
      payrun_id: row.payrun_id,
      payrun_name: row.payrun_name || 'Payrun Batch',
      period_start: row.period_start || row.pr_period_start,
      period_end: row.period_end || row.pr_period_end,
      employee_id: row.employee_id,
      employee_name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.employee_id,
      department_name: row.department_name || 'General',
      job_position: row.job_position || 'Staff',
      contract_wage: Number(row.contract_wage || 0),
      basic_wage: Number(row.basic_wage || 0),
      gross_wage: Number(row.gross_wage || 0),
      net_wage: Number(row.net_wage || 0),
      status: row.status,
      lines: linesByPayslip.get(row.id) || [],
    }));
  }

  static async sendBulkPayslipEmails(payrunId: string): Promise<{ total: number; sent: number; failed: number; logs: any[] }> {
    const payslips = await this.getPayslipsByPayrunId(payrunId);
    let sentCount = 0;
    let failedCount = 0;
    const logs: any[] = [];

    for (const ps of payslips) {
      const empRes = await query('SELECT email FROM employees WHERE id = $1', [ps.employee_id]);
      const email = empRes.rows && empRes.rows[0]?.email;

      if (email && email.includes('@') && !email.includes('no-email')) {
        try {
          // Generate real PDF voucher
          const pdfBuffer = await PdfGeneratorService.generatePayslipPdf(ps);
          
          const html = payslipReadyTemplate({
            employeeName: ps.employee_name,
            payrunName: ps.payrun_name,
            netSalary: ps.net_wage,
            basicWage: ps.basic_wage,
            grossWage: ps.gross_wage,
            totalDeductions: ps.gross_wage - ps.net_wage,
            periodStart: ps.period_start,
            periodEnd: ps.period_end,
            hasPdfAttachment: true,
          });

          const emailRes = await sendEmailDirect({
            to: email,
            subject: `Official Payslip: ${ps.payrun_name} - NexHR`,
            html,
            payslipId: ps.id,
            attachments: [
              {
                filename: `payslip-${ps.id}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf',
              },
            ],
          });

          if (emailRes.success) {
            sentCount++;
            await query("UPDATE payslips SET email_status = 'SENT', emailed_at = CURRENT_TIMESTAMP WHERE id = $1", [ps.id]);
            logs.push({ id: emailRes.id, recipient_email: email, subject: `Payslip for ${ps.payrun_name}`, status: 'Sent' });
          } else {
            failedCount++;
            logs.push({ id: emailRes.id, recipient_email: email, subject: `Payslip for ${ps.payrun_name}`, status: 'Failed', error_message: emailRes.error });
          }
        } catch (err: any) {
          failedCount++;
          logs.push({ recipient_email: email, status: 'Failed', error_message: err.message });
        }
      } else {
        failedCount++;
        const emailLogId = `elog_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        await query(
          `INSERT INTO email_logs (id, recipient_email, subject, payslip_id, status, error_message)
           VALUES ($1, $2, $3, $4, 'Failed', 'Invalid or missing recipient email address')`,
          [emailLogId, email || 'invalid-email', `Payslip for ${ps.payrun_name}`, ps.id]
        );
        logs.push({ id: emailLogId, recipient_email: email || 'invalid-email', status: 'Failed' });
      }
    }

    return { total: payslips.length, sent: sentCount, failed: failedCount, logs };
  }
}
