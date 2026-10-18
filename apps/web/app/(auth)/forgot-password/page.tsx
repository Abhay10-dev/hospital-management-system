'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, ArrowLeft, CheckCircle2, Mail, ShieldAlert } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulating call to /auth/forgot-password
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-primary/10 items-center justify-center text-primary font-black border border-primary/20 shadow-sm">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset Account Access
          </h1>
          <p className="text-sm text-muted-foreground">
            Hospital Management System Password Recovery
          </p>
        </div>

        <Card className="border-[#E2E8F0] shadow-md bg-white">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg font-semibold">Forgot Password</CardTitle>
            <CardDescription className="text-xs">
              Enter your clinical email address to receive a secure, expiring reset link.
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Reset Instructions Dispatched
                </div>
                <p className="leading-relaxed">
                  If an account exists for <span className="font-semibold">{email}</span>, a single-use signed link has been sent. The token expires in <strong>60 minutes</strong>.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>Completing a password reset automatically revokes all other active sessions.</span>
              </div>

              <div className="pt-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Clinical Email Address
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      required
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-slate-50 p-2.5 rounded border border-slate-200">
                  <ShieldAlert className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>Rate limited to 3 requests / minute to prevent spam enumeration.</span>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Transmitting...' : 'Send Expiring Reset Link'}
                </Button>
                <Link href="/login" className="text-xs text-primary hover:underline text-center">
                  Back to Sign In
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
