'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Badge } from '@/components/ui/badge';
import { RoleName } from '@hospital/shared-types';
import {
  ShieldCheck,
  UserCheck,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

const ROLES: { name: RoleName; label: string; badgeVariant: 'superadmin' | 'info' | 'success' | 'warning' | 'secondary' | 'default' }[] = [
  { name: 'SUPER_ADMIN', label: 'Super Admin', badgeVariant: 'superadmin' },
  { name: 'ADMIN', label: 'Admin', badgeVariant: 'info' },
  { name: 'RECEPTIONIST', label: 'Receptionist', badgeVariant: 'warning' },
  { name: 'DOCTOR', label: 'Doctor', badgeVariant: 'success' },
  { name: 'NURSE', label: 'Nurse', badgeVariant: 'secondary' },
  { name: 'AI_SERVICE', label: 'AI Voice Service', badgeVariant: 'info' },
];

export function Header() {
  const { currentRole, currentUser, setRole, canAccessAuditLogs } = useRole();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-lg text-primary">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-foreground font-bold">HealthPulse HMS</span>
              <span className="text-[10px] text-muted-foreground font-normal tracking-wide">
                AI Voice Enabled System
              </span>
            </div>
          </Link>

          {/* Quick Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/patients"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === '/patients'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
              }`}
            >
              Patient Records
            </Link>
            <Link
              href="/appointments"
              className={`px-3 py-1.5 rounded-md transition-colors ${
                pathname === '/appointments'
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
              }`}
            >
              Appointments
            </Link>
            {canAccessAuditLogs && (
              <Link
                href="/audit-logs"
                className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                  pathname === '/audit-logs'
                    ? 'bg-purple-100 text-purple-800 font-semibold'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Audit Logs
              </Link>
            )}
          </nav>
        </div>

        {/* Right Section: Role Switcher Demo Utility + User Info */}
        <div className="flex items-center gap-4">
          {/* Demo Role Switcher Bar */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span className="hidden sm:inline">DEMO ROLE:</span>
            </div>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as RoleName)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">
              {currentUser.fullName.charAt(0)}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-medium text-slate-900 leading-none">
                {currentUser.fullName}
              </span>
              <div className="mt-1">
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
                  className="text-[10px] py-0 px-1.5 font-medium"
                >
                  {currentRole}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
