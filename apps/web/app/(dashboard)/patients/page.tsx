'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PatientRecord } from '@hospital/shared-types';
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

const MOCK_PATIENTS: PatientRecord[] = [
  {
    id: 'pat_4019',
    mrn: 'MRN-2026-0042',
    firstName: 'Eleanor',
    lastName: 'Pond',
    dateOfBirth: '1989-05-12',
    gender: 'Female',
    phone: '+1-555-0144',
    email: 'eleanor.p@example.com',
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-10-18T14:28:45Z',
  },
  {
    id: 'pat_3088',
    mrn: 'MRN-2026-0089',
    firstName: 'Marcus',
    lastName: 'Vance',
    dateOfBirth: '1975-11-23',
    gender: 'Male',
    phone: '+1-555-0199',
    email: 'marcus.v@example.com',
    status: 'ACTIVE',
    createdAt: '2026-02-14T09:30:00Z',
    updatedAt: '2026-10-18T13:55:18Z',
  },
  {
    id: 'pat_1102',
    mrn: 'MRN-2026-0112',
    firstName: 'Amelia',
    lastName: 'Williams',
    dateOfBirth: '1995-03-30',
    gender: 'Female',
    phone: '+1-555-0182',
    email: 'amelia.w@example.com',
    status: 'ACTIVE',
    createdAt: '2026-03-01T11:15:00Z',
    updatedAt: '2026-10-17T16:20:00Z',
  },
];

export default function PatientsPage() {
  const { currentRole, canEditPatients } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<PatientRecord[]>(MOCK_PATIENTS);

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patient Registry (PHI Records)</h1>
          <p className="text-sm text-muted-foreground">
            All view and edit events on this page automatically trigger PHI audit log entries
          </p>
        </div>

        {canEditPatients ? (
          <Button
            size="sm"
            onClick={() => alert('New patient registration modal (Phase 4)...')}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Register Patient
          </Button>
        ) : (
          <Badge variant="secondary" className="py-1">
            Read-Only Access ({currentRole})
          </Badge>
        )}
      </div>

      <Card className="p-4 bg-white border-border">
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patient name or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </Card>

      <Card className="overflow-hidden bg-white border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F9] text-[#475569] uppercase font-bold text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-4">MRN</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Date of Birth</th>
                <th className="py-3 px-4">Gender</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((patient, idx) => (
                <tr
                  key={patient.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    idx % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-semibold text-primary">
                    {patient.mrn}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {patient.firstName} {patient.lastName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{patient.dateOfBirth}</td>
                  <td className="py-3 px-4 text-slate-600">{patient.gender}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{patient.phone}</td>
                  <td className="py-3 px-4">
                    <Badge variant="success" className="text-[10px]">
                      {patient.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => alert(`PHI View audit dispatched for ${patient.firstName} ${patient.lastName}`)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    {canEditPatients && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => alert(`Edit patient form (Phase 4)`)}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
