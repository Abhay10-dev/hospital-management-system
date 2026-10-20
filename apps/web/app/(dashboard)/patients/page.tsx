'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { PatientRecord } from '@hospital/shared-types';
import {
  Plus,
  Search,
  Eye,
  Edit,
  UserCheck,
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
  {
    id: 'pat_1105',
    mrn: 'MRN-2026-0115',
    firstName: 'David',
    lastName: 'Tennant',
    dateOfBirth: '1971-04-18',
    gender: 'Male',
    phone: '+1-555-0191',
    email: 'david.t@example.com',
    status: 'ACTIVE',
    createdAt: '2026-04-02T10:00:00Z',
    updatedAt: '2026-10-16T11:10:00Z',
  },
  {
    id: 'pat_1108',
    mrn: 'MRN-2026-0118',
    firstName: 'Rose',
    lastName: 'Tyler',
    dateOfBirth: '1987-07-24',
    gender: 'Female',
    phone: '+1-555-0163',
    email: 'rose.t@example.com',
    status: 'ACTIVE',
    createdAt: '2026-04-12T14:20:00Z',
    updatedAt: '2026-10-15T09:45:00Z',
  },
  {
    id: 'pat_1120',
    mrn: 'MRN-2026-0130',
    firstName: 'Rory',
    lastName: 'Williams',
    dateOfBirth: '1988-12-05',
    gender: 'Male',
    phone: '+1-555-0177',
    email: 'rory.w@example.com',
    status: 'INACTIVE',
    createdAt: '2026-05-18T16:00:00Z',
    updatedAt: '2026-09-20T10:30:00Z',
  },
];

export default function PatientsPage() {
  const { currentRole, canEditPatients } = useRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState<PatientRecord[]>(MOCK_PATIENTS);

  const filtered = patients.filter(
    (p) =>
      p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header card with action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Patient Records</h2>
          <p className="text-sm text-[#6B7280]">
            Review patient directory and medical record numbers (fictional records).
          </p>
        </div>

        {canEditPatients ? (
          <Button size="sm" className="gap-1.5 self-start sm:self-auto">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add Patient
          </Button>
        ) : (
          <Badge variant="secondary" className="py-1">
            Read-Only Access ({currentRole.replace('_', ' ')})
          </Badge>
        )}
      </div>

      {/* Search Filter Card */}
      <Card>
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
          <Input
            placeholder="Search by patient name or MRN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Table Card */}
      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title="No patients found"
            description="No patient records match your current search query. Try searching with a different name or MRN."
            action={
              <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                Clear search
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" aria-label="Patients">
              <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase font-semibold text-xs border-b border-[#F3F4F6]">
                <tr>
                  <th className="py-3 px-4">MRN</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Date of Birth</th>
                  <th className="py-3 px-4 hidden md:table-cell">Gender</th>
                  <th className="py-3 px-4 hidden lg:table-cell">Contact Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {filtered.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-[#F9FAFB]/70 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-[#2563EB]">
                      {patient.mrn}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#111827]">
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className="py-3.5 px-4 text-[#6B7280] hidden sm:table-cell">{patient.dateOfBirth}</td>
                    <td className="py-3.5 px-4 text-[#6B7280] hidden md:table-cell">{patient.gender}</td>
                    <td className="py-3.5 px-4 font-mono text-[#6B7280] hidden lg:table-cell">{patient.phone}</td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={patient.status === 'ACTIVE' ? 'success' : 'secondary'}
                        className="text-[10px]"
                      >
                        {patient.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-[#2563EB] hover:text-[#1D4ED8]"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" aria-hidden="true" /> View
                      </Button>
                      {canEditPatients && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs text-[#374151]"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" aria-hidden="true" /> Edit
                        </Button>
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
