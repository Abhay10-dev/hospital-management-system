'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Stethoscope,
  ShieldAlert,
  Settings,
  Lock,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { currentRole, canAccessAuditLogs, canManageUsers } = useRole();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      accessible: true,
    },
    {
      title: 'Patients',
      href: '/patients',
      icon: Users,
      accessible: true,
      badge: currentRole === 'NURSE' || currentRole === 'DOCTOR' ? 'Read-Only' : undefined,
    },
    {
      title: 'Appointments',
      href: '/appointments',
      icon: CalendarCheck,
      accessible: true,
    },
    {
      title: 'Doctors & Staff',
      href: '/doctors',
      icon: Stethoscope,
      accessible: true,
    },
    {
      title: 'Audit Logs',
      href: '/audit-logs',
      icon: ShieldAlert,
      accessible: true, // we render it even if disabled to show 403 guard when clicked!
      restricted: !canAccessAuditLogs,
      badge: canAccessAuditLogs ? 'Super Admin' : 'Locked',
    },
    {
      title: 'Settings & RBAC',
      href: '/settings',
      icon: Settings,
      accessible: true,
      restricted: !canManageUsers,
    },
  ];

  return (
    <aside className="w-64 border-r border-border bg-white flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Clinical Operations
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.title}</span>
                  </div>

                  {item.restricted ? (
                    <div className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <Lock className="h-3 w-3" />
                      <span>403</span>
                    </div>
                  ) : item.badge ? (
                    <Badge
                      variant={
                        item.badge === 'Super Admin'
                          ? 'superadmin'
                          : item.badge === 'Read-Only'
                          ? 'secondary'
                          : 'default'
                      }
                      className="text-[10px] px-1.5 py-0 font-normal"
                    >
                      {item.badge}
                    </Badge>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Demo Persona Card */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <p className="text-xs font-semibold text-slate-800">Demo Persona Active</p>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Switching roles in the top bar instantly updates CASL capabilities and access rights in real time.
          </p>
          <div className="pt-1">
            <span className="inline-block text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              HIPAA Compliant Demo
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 text-[11px] text-muted-foreground flex flex-col gap-1">
        <span>HealthPulse Engine v1.0</span>
        <span className="text-slate-400">Deployed on Vercel</span>
      </div>
    </aside>
  );
}
