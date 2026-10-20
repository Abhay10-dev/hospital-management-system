'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Toast, useToast } from '@/components/ui/toast';
import { PermissionGate } from '@/components/rbac/PermissionGate';
import {
  CalendarCheck,
  Plus,
  Bot,
  Clock,
  Search,
  Filter,
  XCircle,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface AppointmentItem {
  id: string;
  patientName: string;
  doctorName: string;
  department: string;
  time: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  source: string;
  isAi: boolean;
}

const MOCK_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt_1102',
    patientName: 'Amelia Williams',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    time: '2026-10-19 10:00 UTC',
    status: 'CONFIRMED',
    source: 'AI Voice Receptionist',
    isAi: true,
  },
  {
    id: 'apt_1103',
    patientName: 'Marcus Vance',
    doctorName: 'Dr. Arthur Vance',
    department: 'Neurology',
    time: '2026-10-19 11:30 UTC',
    status: 'SCHEDULED',
    source: 'Web Reception Desk',
    isAi: false,
  },
  {
    id: 'apt_1104',
    patientName: 'Eleanor Pond',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    time: '2026-10-19 14:00 UTC',
    status: 'CONFIRMED',
    source: 'AI Voice Receptionist',
    isAi: true,
  },
  {
    id: 'apt_1105',
    patientName: 'David Tennant',
    doctorName: 'Dr. Emily Rose',
    department: 'Pediatrics',
    time: '2026-10-19 15:30 UTC',
    status: 'SCHEDULED',
    source: 'Web Reception Desk',
    isAi: false,
  },
  {
    id: 'apt_1106',
    patientName: 'Rose Tyler',
    doctorName: 'Dr. Jack Harkness',
    department: 'Emergency Care',
    time: '2026-10-19 16:15 UTC',
    status: 'COMPLETED',
    source: 'Web Reception Desk',
    isAi: false,
  },
  {
    id: 'apt_1107',
    patientName: 'Rory Williams',
    doctorName: 'Dr. Arthur Vance',
    department: 'Neurology',
    time: '2026-10-20 09:00 UTC',
    status: 'CANCELLED',
    source: 'Patient Request',
    isAi: false,
  },
];

export default function AppointmentsPage() {
  const { currentRole } = useRole();
  const [appointments, setAppointments] = useState<AppointmentItem[]>(MOCK_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { toast, show: showToast, hide: hideToast } = useToast();

  const handleConfirmCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'CANCELLED' } : apt))
    );
    setCancellingId(null);
    showToast('Appointment cancelled successfully.', 'success');
  };

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AppointmentItem['status']) => {
    switch (status) {
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'SCHEDULED':
        return <Badge variant="warning">Scheduled</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      case 'COMPLETED':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          visible={toast.visible}
          onClose={hideToast}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Appointments & Scheduling</h2>
          <p className="text-sm text-[#6B7280]">
            Manage doctor availability slots and patient appointments.
          </p>
        </div>

        <PermissionGate permission="appointment:create">
          <Button size="sm" className="gap-1.5 self-start sm:self-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Appointment
          </Button>
        </PermissionGate>
      </div>

      {/* Filter Card */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
            <Input
              placeholder="Search by patient, doctor, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
              aria-label="Filter by appointment status"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Appointments List / Table */}
      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="No appointments match the current search or status filter."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
              >
                Reset filters
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Appointments">
              <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase font-semibold text-xs border-b border-[#F3F4F6]">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor & Department</th>
                  <th className="py-3 px-4 hidden md:table-cell">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-[#F9FAFB]/70 transition-colors">
                    <td className="py-3.5 px-4 text-xs font-mono text-[#374151]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#9CA3AF]" aria-hidden="true" />
                        <span>{apt.time}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111827]">
                      {apt.patientName}
                    </td>
                    <td className="py-3.5 px-4 text-[#374151]">
                      <div>{apt.doctorName}</div>
                      <div className="text-xs text-[#6B7280]">{apt.department}</div>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {apt.isAi ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-full">
                          <Bot className="h-3 w-3" aria-hidden="true" />
                          AI Receptionist
                        </span>
                      ) : (
                        <span className="text-xs text-[#6B7280]">{apt.source}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {cancellingId === apt.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="text-xs text-[#DC2626] font-medium mr-1">Cancel?</span>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleConfirmCancel(apt.id)}
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => setCancellingId(null)}
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                            <PermissionGate permission="appointment:cancel">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
                                onClick={() => setCancellingId(apt.id)}
                              >
                                Cancel
                              </Button>
                            </PermissionGate>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
