'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AuditLogItem } from '@hospital/shared-types';
import {
  ShieldAlert,
  ShieldX,
  ArrowLeft,
  Download,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  FileCode2,
  X,
  Lock,
} from 'lucide-react';

const MOCK_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud_90812',
    userId: 'usr_superadmin_01',
    userName: 'Dr. Arthur Vance',
    userRole: 'SUPER_ADMIN',
    action: 'user.role_change',
    auditableType: 'User',
    auditableId: 'usr_9812',
    ipAddress: '192.168.1.12',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    performedAt: '2026-10-18T14:32:10Z',
    oldValues: { roleId: 3, roleName: 'RECEPTIONIST' },
    newValues: { roleId: 2, roleName: 'ADMIN' },
  },
  {
    id: 'aud_90813',
    userId: 'usr_doc_04',
    userName: 'Dr. Sarah Jenkins',
    userRole: 'DOCTOR',
    action: 'patient.read',
    auditableType: 'Patient',
    auditableId: 'pat_4019',
    ipAddress: '10.0.4.15',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    performedAt: '2026-10-18T14:28:45Z',
    oldValues: null,
    newValues: { action: 'PHI_ACCESS', accessedFields: ['diagnoses', 'medications'] },
  },
  {
    id: 'aud_90814',
    userId: null,
    userName: 'AI Voice Receptionist',
    userRole: 'AI_SERVICE',
    action: 'booking.create',
    auditableType: 'Appointment',
    auditableId: 'apt_1102',
    ipAddress: '172.16.0.4',
    userAgent: 'VoiceAgent/2.1 (External-Webhook)',
    performedAt: '2026-10-18T14:10:02Z',
    oldValues: null,
    newValues: {
      patientPhone: '+1-555-0199',
      department: 'Cardiology',
      scheduledStart: '2026-10-19T10:00:00Z',
      status: 'CONFIRMED',
    },
  },
  {
    id: 'aud_90815',
    userId: 'usr_recept_03',
    userName: 'Emily Thorne',
    userRole: 'RECEPTIONIST',
    action: 'patient.update',
    auditableType: 'Patient',
    auditableId: 'pat_3088',
    ipAddress: '192.168.1.40',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    performedAt: '2026-10-18T13:55:18Z',
    oldValues: { phone: '+1-555-0100', status: 'PENDING' },
    newValues: { phone: '+1-555-0199', status: 'CONFIRMED' },
  },
  {
    id: 'aud_90816',
    userId: null,
    userName: 'SYSTEM',
    userRole: 'SYSTEM',
    action: 'auth.login_fail',
    auditableType: 'User',
    auditableId: 'usr_1002',
    ipAddress: '203.0.113.19',
    userAgent: 'Python-requests/2.31.0',
    performedAt: '2026-10-18T13:00:11Z',
    oldValues: null,
    newValues: { reason: 'INVALID_CREDENTIALS', consecutiveFailures: 3 },
  },
];

export default function AuditLogsPage() {
  const { currentRole, canAccessAuditLogs } = useRole();
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [entityFilter, setEntityFilter] = useState('ALL');

  // RBAC Access Evaluation: 403 Access Forbidden Screen
  if (!canAccessAuditLogs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-600 border border-red-200">
          <ShieldX className="h-8 w-8" />
        </div>
        <div className="space-y-1.5 max-w-md">
          <h1 className="text-2xl font-bold text-slate-900">403 — Access Forbidden</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Audit Trail Log is write-only and restricted strictly to{' '}
            <span className="font-semibold text-purple-700">SUPER_ADMIN</span> roles in compliance with HIPAA & GDPR governance.
          </p>
          <p className="text-xs text-slate-500 pt-1">
            Current role: <span className="font-mono font-bold text-slate-700">{currentRole}</span>
          </p>
        </div>
        <div className="pt-2 flex gap-3">
          <Link href="/dashboard">
            <Button variant="default" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Filter logs
  const filteredLogs = MOCK_AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      (log.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      log.auditableId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action.includes(actionFilter);
    const matchesEntity = entityFilter === 'ALL' || log.auditableType === entityFilter;

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">AUDIT TRAIL LOGS</h1>
            <Badge variant="superadmin">SUPER ADMIN ONLY</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Immutable security tracking of system events and PHI access (write-only append store)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Exporting signed audit snapshot CSV (Phase 5)...')}
            className="gap-1.5"
          >
            <Download className="h-4 w-4" />
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Refreshed audit entries.')}
            className="gap-1.5"
          >
            <RotateCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border-border">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Actor or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>

          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Actions</option>
              <option value="user.role_change">user.role_change</option>
              <option value="patient.read">patient.read (PHI Access)</option>
              <option value="patient.update">patient.update</option>
              <option value="booking.create">booking.create (AI Service)</option>
              <option value="auth.login_fail">auth.login_fail</option>
            </select>
          </div>

          <div>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs focus:ring-1 focus:ring-primary"
            >
              <option value="ALL">All Entities</option>
              <option value="Patient">Patient</option>
              <option value="Appointment">Appointment</option>
              <option value="User">User</option>
            </select>
          </div>

          <div className="flex items-center justify-end text-xs text-muted-foreground">
            Showing {filteredLogs.length} matching entries
          </div>
        </div>
      </Card>

      {/* Audit Log Table */}
      <Card className="overflow-hidden border-border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F9] text-[#475569] uppercase font-bold text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Resource</th>
                <th className="py-3 px-4">Entity ID</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Diff Snapshot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log, idx) => (
                <tr
                  key={log.id}
                  className={`hover:bg-[#F1F5F9] transition-colors ${
                    idx % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'
                  }`}
                >
                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {new Date(log.performedAt).toLocaleString('en-US', {
                      timeZone: 'UTC',
                      hour12: false,
                    })}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{log.userName}</span>
                    <span className="block text-[10px] text-muted-foreground">
                      {log.userRole || 'AI / System'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">
                    <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">{log.auditableType}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{log.auditableId}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{log.ipAddress || '—'}</td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                      className="h-7 px-2.5 text-xs text-primary font-medium hover:bg-primary/10"
                    >
                      [View Diff]
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info: Immutability reminder */}
        <div className="p-3 bg-slate-50 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-muted-foreground gap-2">
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            Append-only store: DELETE and UPDATE operations strictly disabled at PostgreSQL layer
          </div>
          <div>Showing 1 – {filteredLogs.length} of 1,248 entries</div>
        </div>
      </Card>

      {/* JSON Diff Side Drawer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-slate-50">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  Audit Event Details: {selectedLog.action} (#{selectedLog.id})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Entity: {selectedLog.auditableType} ({selectedLog.auditableId})
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Performed By</span>
                  <span className="font-semibold text-slate-900">{selectedLog.userName}</span>
                  <span className="text-slate-500 block text-[10px]">({selectedLog.userRole})</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Timestamp & IP</span>
                  <span className="font-mono text-slate-800 block">{selectedLog.performedAt}</span>
                  <span className="font-mono text-slate-500 text-[10px]">{selectedLog.ipAddress}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground block text-[11px]">User Agent</span>
                  <span className="font-mono text-slate-600 text-[10px] break-all">
                    {selectedLog.userAgent}
                  </span>
                </div>
              </div>

              {/* Data Mutation Snapshot: Before & After */}
              <div>
                <p className="font-bold uppercase tracking-wider text-[11px] text-slate-700 mb-2">
                  Data Mutation Snapshot (JSON Diff)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Before / Old Values */}
                  <div className="p-3 rounded-lg bg-[#FEF2F2] border border-red-200">
                    <span className="text-red-900 font-bold block mb-1 text-[11px]">
                      BEFORE (old_values)
                    </span>
                    <pre className="font-mono text-[11px] text-[#991B1B] overflow-x-auto whitespace-pre-wrap">
                      {selectedLog.oldValues
                        ? JSON.stringify(selectedLog.oldValues, null, 2)
                        : '(null — new creation or read action)'}
                    </pre>
                  </div>

                  {/* After / New Values */}
                  <div className="p-3 rounded-lg bg-[#F0FDF4] border border-emerald-200">
                    <span className="text-emerald-900 font-bold block mb-1 text-[11px]">
                      AFTER (new_values)
                    </span>
                    <pre className="font-mono text-[11px] text-[#166534] overflow-x-auto whitespace-pre-wrap">
                      {selectedLog.newValues
                        ? JSON.stringify(selectedLog.newValues, null, 2)
                        : '(null)'}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  This entry is permanently signed and stored in an immutable record under HIPAA compliance guidelines.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-border bg-slate-50 flex justify-end">
              <Button size="sm" onClick={() => setSelectedLog(null)}>
                Close Viewer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
