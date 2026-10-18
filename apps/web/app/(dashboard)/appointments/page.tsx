'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarCheck, Plus, Bot, Clock } from 'lucide-react';

const MOCK_APPOINTMENTS = [
  {
    id: 'apt_1102',
    patientName: 'Amelia Williams',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    time: '2026-10-19 10:00 UTC',
    status: 'CONFIRMED',
    source: 'AI Voice Receptionist',
  },
  {
    id: 'apt_1103',
    patientName: 'Marcus Vance',
    doctorName: 'Dr. Arthur Vance',
    department: 'Neurology',
    time: '2026-10-19 11:30 UTC',
    status: 'SCHEDULED',
    source: 'Web Reception Desk',
  },
];

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointments & Scheduling</h1>
          <p className="text-sm text-muted-foreground">
            Calendar view of doctor rosters and patient booking slots
          </p>
        </div>

        <Button size="sm" onClick={() => alert('Book appointment modal (Phase 4)...')} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_APPOINTMENTS.map((apt) => (
          <Card key={apt.id} className="bg-white border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">{apt.patientName}</CardTitle>
                <Badge variant={apt.status === 'CONFIRMED' ? 'success' : 'warning'}>
                  {apt.status}
                </Badge>
              </div>
              <CardDescription>{apt.department} · {apt.doctorName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{apt.time}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Bot className="h-4 w-4 text-sky-600" />
                <span className="text-muted-foreground">Booked via: <strong className="text-slate-800">{apt.source}</strong></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
