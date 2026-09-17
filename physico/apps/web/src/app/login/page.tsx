'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';
import FaceVerificationModal from '../../components/FaceVerificationModal';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2 Face Verification State
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [pendingStep1Data, setPendingStep1Data] = useState<{
    userId: string;
    challengeId: string;
    email: string;
    firstName: string;
  } | null>(null);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetchApi<{
        requiresFaceVerification: boolean;
        userId: string;
        email: string;
        firstName: string;
        challenge: { challengeId: string };
      }>('/auth/login-step1', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res.requiresFaceVerification) {
        setPendingStep1Data({
          userId: res.userId,
          challengeId: res.challenge.challengeId,
          email: res.email,
          firstName: res.firstName,
        });
        setShowFaceVerification(true);
      }
    } catch (err: any) {
      setError(err.message || 'Login Step 1 failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceVerificationSuccess = (data: { accessToken: string; refreshToken: string; user: any }) => {
    localStorage.setItem('physio_access_token', data.accessToken);
    localStorage.setItem('physio_refresh_token', data.refreshToken);
    localStorage.setItem('physio_user', JSON.stringify(data.user));

    if (data.user.roles?.includes('ADMIN') || data.user.roles?.includes('SUPER_ADMIN')) {
      router.push('/admin/dashboard');
    } else {
      router.push('/student/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl gradient-teal text-white mx-auto flex items-center justify-center shadow-md">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login to PhysioEdvance</h1>
          <p className="text-xs text-slate-500">
            Step 1: Enter email & password <br />
            Step 2: Biometric Face Verification
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleStep1Submit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@physioedvance.com"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 text-sm font-bold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Verifying Password...' : 'Proceed to Face Verification'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-physio-600 hover:underline">
              Register with Face Enrollment
            </Link>
          </p>
        </div>
      </div>

      {/* Step 2 Biometric Face Verification Modal */}
      {showFaceVerification && pendingStep1Data && (
        <FaceVerificationModal
          userId={pendingStep1Data.userId}
          challengeId={pendingStep1Data.challengeId}
          email={pendingStep1Data.email}
          firstName={pendingStep1Data.firstName}
          onSuccess={handleFaceVerificationSuccess}
          onCancel={() => setShowFaceVerification(false)}
        />
      )}
    </div>
  );
}
