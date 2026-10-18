'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Activity, CheckCircle2, Eye, EyeOff, Lock, AlertTriangle } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 12) {
      setError('Password must be at least 12 characters under clinical security policy.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    // Simulating call to /auth/reset-password
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 700);
  };

  return (
    <Card className="border-[#E2E8F0] shadow-md bg-white">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-lg font-semibold">Set New Password</CardTitle>
        <CardDescription className="text-xs">
          Enter a compliant 12+ character password. All existing sessions will be terminated.
        </CardDescription>
      </CardHeader>

      {success ? (
        <CardContent className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Password Successfully Updated
            </div>
            <p>
              Your credentials have been securely updated via Argon2id hashing. All previous active sessions have been invalidated across devices.
            </p>
          </div>

          <div className="pt-2">
            <Link href="/login">
              <Button className="w-full">
                Proceed to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                New Password (Min 12 chars)
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 bg-white"
                  placeholder="At least 12 characters"
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Confirm New Password
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-white"
                placeholder="Re-type password"
              />
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-muted-foreground flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Token: {token ? `${token.substring(0, 10)}...` : 'demo-signed-token'} (Expires in 60m)</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Securing Credentials...' : 'Set New Password & Invalidate Sessions'}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#F8FAFC] p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 rounded-xl bg-primary/10 items-center justify-center text-primary font-black border border-primary/20 shadow-sm">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete your security token verification
          </p>
        </div>

        <Suspense fallback={<div className="p-8 text-center text-sm">Loading security token...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
