'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/rbac/PermissionGate';
import {
  Users,
  CalendarCheck,
  Stethoscope,
  ShieldAlert,
  Bot,
  CheckCircle2,
  Plus,
  ArrowRight,
  Clock,
  Activity,
} from 'lucide-react';
import { RoleName } from '@hospital/shared-types';

// Role-specific KPI data
function getStatCards(role: RoleName) {
  switch (role) {
    case 'DOCTOR':
      return [
        { title: "Today's Consultations", value: '8', subtitle: '2 remaining', icon: <Stethoscope className="h-[22px] w-[22px] text-[#2563EB]" />, iconBg: 'bg-[#EFF6FF]' },
        { title: 'Appointments Today', value: '42', subtitle: '34 confirmed · 8 pending', icon: <CalendarCheck className="h-[22px] w-[22px] text-[#10B981]" />, iconBg: 'bg-[#ECFDF5]' },
        { title: 'Assigned Patients', value: '24', subtitle: 'Active care plans', icon: <Users className="h-[22px] w-[22px] text-[#8B5CF6]" />, iconBg: 'bg-[#FAF5FF]' },
        { title: 'Pending Reviews', value: '3', subtitle: 'Require attention', icon: <Clock className="h-[22px] w-[22px] text-[#F59E0B]" />, iconBg: 'bg-[#FFFBEB]' },
      ];
    case 'NURSE':
      return [
        { title: 'Triage Queue', value: '12', subtitle: '3 high priority', icon: <Activity className="h-[22px] w-[22px] text-[#EF4444]" />, iconBg: 'bg-[#FEF2F2]' },
        { title: 'Appointments Today', value: '42', subtitle: '34 confirmed · 8 pending', icon: <CalendarCheck className="h-[22px] w-[22px] text-[#10B981]" />, iconBg: 'bg-[#ECFDF5]' },
        { title: 'Completed Today', value: '18', subtitle: 'Care tasks done', icon: <CheckCircle2 className="h-[22px] w-[22px] text-[#2563EB]" />, iconBg: 'bg-[#EFF6FF]' },
        { title: 'Active Patients', value: '1,248', subtitle: '+14 new today', icon: <Users className="h-[22px] w-[22px] text-[#8B5CF6]" />, iconBg: 'bg-[#FAF5FF]' },
      ];
    case 'RECEPTIONIST':
      return [
        { title: 'Walk-ins Today', value: '7', subtitle: '2 awaiting registration', icon: <Users className="h-[22px] w-[22px] text-[#2563EB]" />, iconBg: 'bg-[#EFF6FF]' },
        { title: 'Scheduled Today', value: '35', subtitle: 'Confirmed appointments', icon: <CalendarCheck className="h-[22px] w-[22px] text-[#10B981]" />, iconBg: 'bg-[#ECFDF5]' },
        { title: 'Pending Approval', value: '4', subtitle: 'Awaiting confirmation', icon: <Clock className="h-[22px] w-[22px] text-[#F59E0B]" />, iconBg: 'bg-[#FFFBEB]' },
        { title: 'Total Patients', value: '1,248', subtitle: '+14 registered today', icon: <Activity className="h-[22px] w-[22px] text-[#8B5CF6]" />, iconBg: 'bg-[#FAF5FF]' },
      ];
    default: // SUPER_ADMIN, ADMIN
      return [
        { title: 'Active Patients', value: '1,248', subtitle: '+14 new today', icon: <Users className="h-[22px] w-[22px] text-[#2563EB]" />, iconBg: 'bg-[#EFF6FF]' },
        { title: 'Appointments Today', value: '42', subtitle: '34 confirmed · 8 pending', icon: <CalendarCheck className="h-[22px] w-[22px] text-[#10B981]" />, iconBg: 'bg-[#ECFDF5]' },
        { title: 'Active Doctors', value: '28', subtitle: '6 on call now', icon: <Stethoscope className="h-[22px] w-[22px] text-[#8B5CF6]" />, iconBg: 'bg-[#FAF5FF]' },
        { title: 'Audit Events', value: '8,921', subtitle: 'Immutable audit trail', icon: <ShieldAlert className="h-[22px] w-[22px] text-[#7E22CE]" />, iconBg: 'bg-[#FAF5FF]' },
      ];
  }
}

const RECENT_ACTIVITY = [
  { time: '14:32', actor: 'Dr. Arthur Vance', action: 'user.role_change', resource: 'User #9812', status: 'success' as const },
  { time: '14:28', actor: 'Dr. Sarah Jenkins', action: 'patient.read', resource: 'Patient #4019', status: 'info' as const },
  { time: '14:10', actor: 'AI Voice Receptionist', action: 'booking.create', resource: 'Appointment #1102', status: 'info' as const },
  { time: '13:55', actor: 'Emily Thorne', action: 'patient.update', resource: 'Patient #3088', status: 'success' as const },
  { time: '13:40', actor: 'Nurse Joy', action: 'appointment.update', resource: 'Appointment #995', status: 'success' as const },
];

export default function DashboardPage() {
  const { currentRole, currentUser, canAccessAuditLogs } = useRole();
  const stats = getStatCards(currentRole);

  const displayName = currentUser.fullName.split('(')[0].trim();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white shadow-sm"
        style={{ background: 'linear-gradient(to right, #1D4ED8, #2563EB, #3B82F6)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold leading-tight">Welcome back, {displayName}</h2>
            <p className="text-sm text-white/80 mt-1">
              Advfiction HMS · Multi-tier Role-Based Access Control Active
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-medium bg-white/20 border border-white/30 rounded-full px-3 py-1">
              {currentRole.replace('_', ' ')}
            </span>
            <PermissionGate permission="patient:create">
              <Link href="/patients">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white/20 gap-1.5">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add Patient
                </Button>
              </Link>
            </PermissionGate>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            iconBg={stat.iconBg}
          />
        ))}
      </div>

      {/* Middle Grid: Recent Activity + Security Safeguards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity table — 2/3 width */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold text-[#111827]">Recent Activity</CardTitle>
            {canAccessAuditLogs && (
              <Link href="/audit-logs">
                <Button variant="ghost" size="sm" className="gap-1 text-xs text-[#2563EB] hover:text-[#1D4ED8]">
                  View all <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Recent activity">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#F3F4F6]">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Actor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280] hidden sm:table-cell">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#6B7280] hidden md:table-cell">Resource</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#6B7280]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {RECENT_ACTIVITY.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#F9FAFB]/70 transition-colors">
                      <td className="px-4 py-3.5 text-xs text-[#6B7280] font-mono">{row.time}</td>
                      <td className="px-4 py-3.5 text-sm text-[#374151] font-medium">{row.actor}</td>
                      <td className="px-4 py-3.5 text-xs font-mono text-[#6B7280] hidden sm:table-cell">{row.action}</td>
                      <td className="px-4 py-3.5 text-xs text-[#6B7280] hidden md:table-cell">{row.resource}</td>
                      <td className="px-4 py-3.5 text-right">
                        <Badge variant={row.status} className="text-[10px]">
                          {row.status === 'success' ? 'Success' : 'Info'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Security Safeguards card — 1/3 width */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-[#111827]">Security Safeguards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3.5">
            {[
              { title: 'Argon2id Password Hashing', desc: 'GPU-resistant memory-hard encryption' },
              { title: 'Rate-Limited Login', desc: 'Throttled to 5 attempts per minute' },
              { title: 'Immutable Audit Trail', desc: 'Append-only, write-protected store' },
              { title: 'Scoped AI Service Token', desc: 'Restricted strictly to availability & booking' },
              { title: 'HttpOnly Cookie Sessions', desc: 'No sensitive credentials stored in client memory' },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-2.5 text-xs">
                <CheckCircle2 className="h-4 w-4 text-[#047857] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-[#111827]">{item.title}</p>
                  <p className="text-[#6B7280]">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-[#111827]">Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link href="/patients" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#F3F4F6] hover:bg-[#EFF6FF] hover:border-[#BFDBFE] transition-colors group">
              <Users className="h-6 w-6 text-[#2563EB]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#374151] group-hover:text-[#2563EB]">Patients</span>
            </Link>
            <Link href="/appointments" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#F3F4F6] hover:bg-[#ECFDF5] hover:border-[#A7F3D0] transition-colors group">
              <CalendarCheck className="h-6 w-6 text-[#047857]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#374151] group-hover:text-[#047857]">Appointments</span>
            </Link>
            {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN' || currentRole === 'DOCTOR') && (
              <Link href="/doctors" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#F3F4F6] hover:bg-[#FAF5FF] hover:border-[#E9D5FF] transition-colors group">
                <Stethoscope className="h-6 w-6 text-[#7E22CE]" aria-hidden="true" />
                <span className="text-xs font-medium text-[#374151] group-hover:text-[#7E22CE]">Schedules</span>
              </Link>
            )}
            {canAccessAuditLogs && (
              <Link href="/audit-logs" className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#F3F4F6] hover:bg-[#FAF5FF] hover:border-[#E9D5FF] transition-colors group">
                <ShieldAlert className="h-6 w-6 text-[#7E22CE]" aria-hidden="true" />
                <span className="text-xs font-medium text-[#374151] group-hover:text-[#7E22CE]">Audit Logs</span>
              </Link>
            )}
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#F3F4F6] bg-[#F9FAFB]">
              <Bot className="h-6 w-6 text-[#06B6D4]" aria-hidden="true" />
              <span className="text-xs font-medium text-[#6B7280]">AI Reception</span>
              <span className="text-[10px] text-[#9CA3AF]">API-only</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
