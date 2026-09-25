import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/ui/Card';
import { Pagination } from '../../../components/ui/Pagination';
import { apiRequest } from '../../../lib/api';
import { ShieldAlert, Search, Filter, RefreshCw, Eye, ChevronDown, ChevronRight, User, Calendar, Database } from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (selectedTable) params.append('table_name', selectedTable);
      if (selectedAction) params.append('action', selectedAction);

      const res = await apiRequest(`/audit-logs?${params.toString()}`);
      setLogs(res.data || []);
      setTotal(res.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, limit, selectedTable, selectedAction]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px] font-bold">CREATE</span>;
      case 'UPDATE':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[11px] font-bold">UPDATE</span>;
      case 'DELETE':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full text-[11px] font-bold">DELETE</span>;
      case 'APPROVE':
        return <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] font-bold">APPROVE</span>;
      case 'REFUSE':
        return <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full text-[11px] font-bold">REFUSE</span>;
      case 'IMPERSONATE':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold">IMPERSONATE</span>;
      case 'END_IMPERSONATE':
        return <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-full text-[11px] font-bold">END IMPERSONATE</span>;
      case 'PAYROLL_EXECUTE':
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full text-[11px] font-bold">PAYROLL EXECUTE</span>;
      case 'STATUS_CHANGE':
        return <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full text-[11px] font-bold">STATUS CHANGE</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-full text-[11px] font-bold">{action}</span>;
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#12141F] flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-primary" />
            System Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable tamper-evident record of administrative actions, payroll runs, and user access
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-fintech flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedTable}
          onChange={(e) => { setSelectedTable(e.target.value); setPage(1); }}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Entities / Tables</option>
          <option value="employees">Employees</option>
          <option value="users">Users / Auth</option>
          <option value="contracts">Contracts</option>
          <option value="payruns">Payruns</option>
          <option value="time_off_requests">Time Off Requests</option>
          <option value="attendances">Attendances</option>
        </select>

        <select
          value={selectedAction}
          onChange={(e) => { setSelectedAction(e.target.value); setPage(1); }}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="">All Actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="APPROVE">APPROVE</option>
          <option value="REFUSE">REFUSE</option>
          <option value="IMPERSONATE">IMPERSONATE</option>
          <option value="PAYROLL_EXECUTE">PAYROLL EXECUTE</option>
          <option value="STATUS_CHANGE">STATUS CHANGE</option>
        </select>

        {(selectedTable || selectedAction) && (
          <button
            onClick={() => { setSelectedTable(''); setSelectedAction(''); setPage(1); }}
            className="text-xs text-primary font-semibold hover:underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Audit Logs Table */}
      <Card title="Activity Logs" subtitle={`Showing ${logs.length} of ${total} total events`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Record ID</th>
                <th className="py-3 px-4">Triggered By</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                    Loading audit trail...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit records matching your criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const hasDetails = log.old_values || log.new_values;

                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => hasDetails && setExpandedId(isExpanded ? null : log.id)}
                        className={`hover:bg-slate-50/70 transition-colors ${hasDetails ? 'cursor-pointer' : ''}`}
                      >
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {getActionBadge(log.action)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          <span className="flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-slate-400" />
                            {log.table_name}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {log.record_id}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-medium">
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {log.changed_by || 'System'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {hasDetails ? (
                            <button
                              type="button"
                              className="text-primary hover:text-primary-dark font-medium flex items-center gap-1 ml-auto text-xs"
                            >
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                              <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                            </button>
                          ) : (
                            <span className="text-slate-300 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>

                      {/* Expandable JSON Diff Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/50">
                          <td colSpan={6} className="p-4">
                            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-inner">
                              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Payload Changes</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {log.old_values && (
                                  <div>
                                    <span className="text-[11px] font-semibold text-rose-600 block mb-1">Previous Values:</span>
                                    <pre className="bg-slate-900 text-emerald-400 text-[11px] p-3 rounded-lg overflow-x-auto font-mono max-h-48">
                                      {JSON.stringify(log.old_values, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.new_values && (
                                  <div>
                                    <span className="text-[11px] font-semibold text-emerald-600 block mb-1">Updated Values:</span>
                                    <pre className="bg-slate-900 text-emerald-400 text-[11px] p-3 rounded-lg overflow-x-auto font-mono max-h-48">
                                      {JSON.stringify(log.new_values, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      {!loading && total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={limit}
          onPageChange={setPage}
          onPageSizeChange={(newSize) => { setLimit(newSize); setPage(1); }}
          pageSizeOptions={[10, 20, 50, 100]}
          itemLabel="events"
        />
      )}
    </div>
  );
};
