'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, CheckCircle2 } from 'lucide-react';

const DOCTORS = [
  { name: 'Dr. Arthur Vance', specialty: 'Chief Medical Officer / Neurology', dept: 'Neurology', status: 'On Duty' },
  { name: 'Dr. Sarah Jenkins', specialty: 'Senior Cardiologist', dept: 'Cardiology', status: 'Available' },
  { name: 'Dr. Liam Patel', specialty: 'Pediatric Specialist', dept: 'Pediatrics', status: 'In Surgery' },
];

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Medical Staff & Doctor Roster</h1>
        <p className="text-sm text-muted-foreground">
          Assigned departments, availability schedules, and duty statuses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOCTORS.map((doc) => (
          <Card key={doc.name} className="bg-white border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{doc.name}</CardTitle>
                  <CardDescription className="text-xs">{doc.dept}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 text-xs space-y-2">
              <p className="text-muted-foreground">{doc.specialty}</p>
              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                <Badge variant={doc.status === 'Available' ? 'success' : 'secondary'} className="text-[10px]">
                  {doc.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
