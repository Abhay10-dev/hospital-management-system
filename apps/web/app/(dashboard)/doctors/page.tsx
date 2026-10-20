'use client';

import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Stethoscope,
  Search,
  Clock,
  CalendarCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface DoctorItem {
  id: string;
  name: string;
  specialty: string;
  dept: string;
  status: 'Available' | 'On Duty' | 'In Surgery' | 'On Leave';
  nextSlot: string;
}

const DOCTORS: DoctorItem[] = [
  { id: 'doc_1', name: 'Dr. Arthur Vance', specialty: 'Neurology & Critical Care', dept: 'Neurology', status: 'On Duty', nextSlot: '14:30 Today' },
  { id: 'doc_2', name: 'Dr. Sarah Jenkins', specialty: 'Cardiovascular Medicine', dept: 'Cardiology', status: 'Available', nextSlot: '15:00 Today' },
  { id: 'doc_3', name: 'Dr. Liam Patel', specialty: 'Pediatric Surgery', dept: 'Pediatrics', status: 'In Surgery', nextSlot: 'Tomorrow 09:00' },
  { id: 'doc_4', name: 'Dr. Emily Rose', specialty: 'Pediatric Care', dept: 'Pediatrics', status: 'Available', nextSlot: '16:00 Today' },
  { id: 'doc_5', name: 'Dr. Jack Harkness', specialty: 'Emergency & Trauma', dept: 'Emergency Care', status: 'On Duty', nextSlot: 'Immediate' },
  { id: 'doc_6', name: 'Dr. Martha Jones', specialty: 'Internal Medicine', dept: 'Internal Medicine', status: 'On Leave', nextSlot: 'Monday 08:30' },
];

export default function DoctorsPage() {
  const { currentRole, currentUser } = useRole();
  const [searchTerm, setSearchTerm] = useState('');

  const isDoctor = currentRole === 'DOCTOR';

  const filtered = DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: DoctorItem['status']) => {
    switch (status) {
      case 'Available':
        return <Badge variant="success">Available</Badge>;
      case 'On Duty':
        return <Badge variant="info">On Duty</Badge>;
      case 'In Surgery':
        return <Badge variant="warning">In Surgery</Badge>;
      case 'On Leave':
        return <Badge variant="secondary">On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-xl font-bold text-[#111827]">Doctors & Schedules</h2>
        <p className="text-sm text-[#6B7280]">
          Clinical rosters, department allocation, and practitioner availability.
        </p>
      </div>

      {/* Prominent "My Schedule" if user is a DOCTOR */}
      {isDoctor && (
        <Card className="border-[#BFDBFE] bg-[#EFF6FF]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white">
                  <Stethoscope className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#1E3A8A]">My Duty Schedule</CardTitle>
                  <p className="text-xs text-[#1D4ED8]">Assigned to: {currentUser.fullName}</p>
                </div>
              </div>
              <Badge variant="success">Active On Duty</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                <span className="text-[#6B7280] block">Today&apos;s Consultations</span>
                <span className="text-lg font-bold text-[#111827]">8 patients</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                <span className="text-[#6B7280] block">Next Consultation</span>
                <span className="text-lg font-bold text-[#111827]">14:00 (Amelia W.)</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#BFDBFE]">
                <span className="text-[#6B7280] block">Duty Hours</span>
                <span className="text-lg font-bold text-[#111827]">08:00 – 17:00 UTC</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Filter Card */}
      <Card>
        <div className="relative max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" aria-hidden="true" />
          <Input
            placeholder="Search practitioners or specialties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc) => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shrink-0">
                    <Stethoscope className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">{doc.name}</CardTitle>
                    <p className="text-xs text-[#2563EB] font-medium">{doc.dept}</p>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5 text-xs">
              <p className="text-[#6B7280]">{doc.specialty}</p>
              <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6] text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Next Slot:
                </span>
                <span className="font-medium text-[#111827]">{doc.nextSlot}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
