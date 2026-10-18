'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Check, X, Lock } from 'lucide-react';
import { useRole } from '@/context/RoleContext';

const MATRIX = [
  { resource: 'User Administration', superAdmin: true, admin: false, receptionist: false, doctor: false, nurse: false, aiService: false },
  { resource: 'Audit Trail Viewer (Write-only)', superAdmin: true, admin: false, receptionist: false, doctor: false, nurse: false, aiService: false },
  { resource: 'Manage Doctors & Rosters', superAdmin: true, admin: true, receptionist: false, doctor: false, nurse: false, aiService: false },
  { resource: 'Patient Registration & Booking', superAdmin: true, admin: true, receptionist: true, doctor: false, nurse: false, aiService: false },
  { resource: 'PHI Patient Read (Sensitive)', superAdmin: true, admin: true, receptionist: true, doctor: true, nurse: true, aiService: false },
  { resource: 'Availability Check (API)', superAdmin: true, admin: true, receptionist: true, doctor: true, nurse: true, aiService: true },
  { resource: 'Booking Request Create (API)', superAdmin: true, admin: true, receptionist: true, doctor: true, nurse: true, aiService: true },
];

export default function SettingsPage() {
  const { currentRole, canManageUsers } = useRole();

  if (!canManageUsers) {
    return (
      <div className="p-8 text-center space-y-3">
        <Lock className="h-8 w-8 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-sm text-muted-foreground">
          Role and permission matrices can only be viewed or modified by Super Admins and Operations Admins.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Role-Based Access Control (RBAC) Matrix</h1>
        <p className="text-sm text-muted-foreground">
          Configured permission boundaries and CASL evaluation rules across all system roles
        </p>
      </div>

      <Card className="bg-white border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F1F5F9] text-[#475569] uppercase font-bold text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-4">Capability / Resource</th>
                <th className="py-3 px-4 text-center">Super Admin</th>
                <th className="py-3 px-4 text-center">Admin</th>
                <th className="py-3 px-4 text-center">Receptionist</th>
                <th className="py-3 px-4 text-center">Doctor</th>
                <th className="py-3 px-4 text-center">Nurse</th>
                <th className="py-3 px-4 text-center">AI Service</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MATRIX.map((row, idx) => (
                <tr key={row.resource} className={idx % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'}>
                  <td className="py-3 px-4 font-medium text-slate-800">{row.resource}</td>
                  <td className="py-3 px-4 text-center">
                    {row.superAdmin ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.admin ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.receptionist ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.doctor ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.nurse ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.aiService ? <Check className="h-4 w-4 text-emerald-600 mx-auto" /> : <X className="h-4 w-4 text-slate-300 mx-auto" />}
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
