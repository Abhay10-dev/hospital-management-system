'use client';

import React from 'react';
import Link from 'next/link';
import { useRole } from '@/context/RoleContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  CalendarCheck,
  Bot,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentRole, currentUser, canAccessAuditLogs } = useRole();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, {currentUser.fullName.split('(')[0]}
            </h1>
            <Badge
              variant={
                currentRole === 'SUPER_ADMIN'
                  ? 'superadmin'
                  : currentRole === 'DOCTOR'
                  ? 'success'
                  : currentRole === 'RECEPTIONIST'
                  ? 'warning'
                  : 'info'
              }
            >
              {currentRole}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Healthcare Operations Console · Multi-tier Role-Based Access Control Active
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="outline" size="sm">
              View Login Screen
            </Button>
          </Link>
          {canAccessAuditLogs ? (
            <Link href="/audit-logs">
              <Button size="sm" className="gap-1.5">
                <ShieldAlert className="h-4 w-4" />
                Audit Logs
              </Button>
            </Link>
          ) : (
            <Button size="sm" variant="secondary" disabled className="gap-1.5 opacity-60">
              <Lock className="h-4 w-4" />
              Audit Logs (Super Admin Only)
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active Patients
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,248</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-semibold">+14 new</span> today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Appointments Today
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">42</div>
            <p className="text-xs text-muted-foreground mt-1 text-slate-500">
              34 confirmed · 8 pending triage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              AI Voice Bookings
            </CardTitle>
            <Bot className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">18</div>
            <p className="text-xs text-muted-foreground mt-1 text-sky-700">
              Scoped API Token active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Audit Events Captured
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">8,921</div>
            <p className="text-xs text-muted-foreground mt-1 text-purple-700 font-medium">
              Immutable store (append-only)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance & Security Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Active Permissions in Current Session</CardTitle>
                <CardDescription>
                  Evaluated using CASL abilities dynamically for role: <span className="font-semibold text-foreground">{currentRole}</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {currentUser.permissions.length} actions allowed
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentUser.permissions.map((action) => (
                <span
                  key={action}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  {action}
                </span>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Want to test unauthorized route behavior?
              </span>
              <Link href="/audit-logs">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  Test Audit Log Access <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Specs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Security Architecture</CardTitle>
            <CardDescription>Verification checklist & protections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3.5">
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Argon2 Password Hashing:</span>
                <p className="text-slate-600">GPU-resistant memory-hard encryption</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Brute-Force Rate Limiting:</span>
                <p className="text-slate-600">Throttled to 5 failed attempts / min</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Immutable Audit Trail:</span>
                <p className="text-slate-600">Write-only table with JSON diff tracking</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Scoped AI Service Token:</span>
                <p className="text-slate-600">Locked strictly to availability & booking</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
