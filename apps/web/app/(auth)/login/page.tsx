'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useRole } from '@/context/RoleContext';
import { RoleName } from '@hospital/shared-types';
import {
  Activity,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useRole();

  const [email, setEmail] = useState('superadmin@hospital.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Check rate limit simulation
    const nextAttempts = attemptCount + 1;
    setAttemptCount(nextAttempts);

    if (nextAttempts > 5) {
      setErrorBanner('HTTP 429 Too Many Requests: Rate limit exceeded (Max 5 attempts / min per IP). Please wait 60s.');
      return;
    }

    // Determine role by email
    let role: RoleName = 'SUPER_ADMIN';
    if (email.includes('admin')) role = 'ADMIN';
    else if (email.includes('reception')) role = 'RECEPTIONIST';
    else if (email.includes('doc')) role = 'DOCTOR';
    else if (email.includes('nurse')) role = 'NURSE';

    setRole(role);
    router.push('/dashboard');
  };

  const handleQuickFill = (targetRole: RoleName, sampleEmail: string) => {
    setEmail(sampleEmail);
    setPassword('SuperSecret123#');
    setRole(targetRole);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-primary/10 items-center justify-center text-primary font-black border border-primary/20 shadow-sm">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Hospital Management System
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your clinical dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-[#E2E8F0] shadow-md bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-semibold">Authentication</CardTitle>
            <CardDescription className="text-xs">
              Enter your credentials to access authorized patient records
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {/* Rate limit warning banner */}
              {errorBanner && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{errorBanner}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="doctor@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset link will be dispatched via email (Phase 3).');
                    }}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember checkbox */}
              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Remember session for 8 hours</span>
                </label>
              </div>

              {/* Rate limit badge info */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-slate-50 p-2 rounded border border-slate-200">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Rate limit protection active (Max 5 attempts / min)</span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Sign In to Hospital Portal
              </Button>
            </CardFooter>
          </form>

          {/* Quick Demo Persona Fill */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-lg space-y-2">
            <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Demo Quick-Fill Personas:
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 justify-start"
                onClick={() => handleQuickFill('SUPER_ADMIN', 'superadmin@hospital.com')}
              >
                Super Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 justify-start"
                onClick={() => handleQuickFill('ADMIN', 'admin@hospital.com')}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 justify-start"
                onClick={() => handleQuickFill('RECEPTIONIST', 'reception@hospital.com')}
              >
                Receptionist
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs h-7 justify-start"
                onClick={() => handleQuickFill('DOCTOR', 'doctor@hospital.com')}
              >
                Doctor
              </Button>
            </div>
          </div>
        </Card>

        {/* Regulatory Footer */}
        <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
          <Lock className="h-3.5 w-3.5 text-emerald-600" />
          Protected by HIPAA & GDPR Compliance Rules
        </p>
      </div>
    </div>
  );
}
