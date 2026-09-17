'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, ShieldCheck, RefreshCw, AlertTriangle, CheckCircle2, Eye, UserCheck } from 'lucide-react';
import { fetchApi } from '../lib/api-client';

interface FaceVerificationModalProps {
  userId: string;
  challengeId: string;
  email: string;
  firstName: string;
  onSuccess: (tokens: { accessToken: string; refreshToken: string; user: any }) => void;
  onCancel: () => void;
}

export default function FaceVerificationModal({
  userId,
  challengeId,
  email,
  firstName,
  onSuccess,
  onCancel,
}: FaceVerificationModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const [verifyingState, setVerifyingState] = useState<'IDLE' | 'CAPTURING' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const prompts = ['Center your face in the oval frame', 'Tilt head slightly & blink your eyes', 'Hold steady for camera verification'];

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setHasPermission(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
      setErrorMessage('Camera access denied or device camera unavailable. Please grant permission.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleStartLivenessAndVerification = async () => {
    setVerifyingState('CAPTURING');
    setErrorMessage(null);

    // Step 1: Capture 3 consecutive liveness challenge frames
    const frames: string[] = [];
    for (let i = 0; i < 3; i++) {
      setCurrentPromptIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const frame = captureFrame();
      if (frame) frames.push(frame);
    }

    setCapturedFrames(frames);
    setVerifyingState('VERIFYING');

    try {
      // Call Step 2 backend API
      const result = await fetchApi<{
        accessToken: string;
        refreshToken: string;
        user: any;
      }>('/auth/verify-face', {
        method: 'POST',
        body: JSON.stringify({
          userId,
          challengeId,
          faceFrames: frames.length > 0 ? frames : ['data:image/jpeg;base64,sample_frame'],
        }),
      });

      setVerifyingState('SUCCESS');
      setTimeout(() => {
        onSuccess(result);
      }, 1000);
    } catch (err: any) {
      setVerifyingState('FAILED');
      setRetryCount((prev) => prev + 1);
      setErrorMessage(err.message || 'Face verification failed. Please align face and retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative text-center">
        {/* Header */}
        <div className="flex items-center justify-center space-x-2 text-physio-600 mb-2">
          <ShieldCheck className="w-7 h-7" />
          <h3 className="text-xl font-bold text-slate-900">Biometric Face Verification</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Security Verification Step 2 for <span className="font-semibold text-slate-800">{email}</span>
        </p>

        {/* Camera Viewport with Biometric Frame Overlay */}
        <div className="relative w-full h-72 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner mb-6">
          {hasPermission === false ? (
            <div className="p-6 text-center text-slate-300">
              <Camera className="w-12 h-12 mx-auto text-red-400 mb-2" />
              <p className="text-sm font-semibold text-white">Camera Access Required</p>
              <p className="text-xs text-slate-400 mt-1">Please enable camera permissions in your browser settings to complete login.</p>
              <button
                onClick={startCamera}
                className="mt-4 px-4 py-2 text-xs font-semibold text-white gradient-teal rounded-lg"
              >
                Try Requesting Permission
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover transform -scale-x-100"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Biometric Oval Guide Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-48 h-60 rounded-[50%] border-4 transition-colors duration-300 ${
                  verifyingState === 'SUCCESS'
                    ? 'border-emerald-400 shadow-[0_0_20px_#10b981]'
                    : verifyingState === 'FAILED'
                    ? 'border-rose-500 shadow-[0_0_20px_#f43f5e]'
                    : verifyingState === 'VERIFYING'
                    ? 'border-amber-400 animate-pulse'
                    : 'border-physio-400/80'
                }`} />
              </div>

              {/* Realtime Prompt Badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-900/80 backdrop-blur-md py-2 px-3 rounded-xl text-white text-xs font-medium flex items-center justify-center space-x-2">
                {verifyingState === 'CAPTURING' && <Eye className="w-4 h-4 text-amber-300 animate-bounce" />}
                {verifyingState === 'VERIFYING' && <RefreshCw className="w-4 h-4 text-physio-300 animate-spin" />}
                {verifyingState === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {verifyingState === 'FAILED' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span>
                  {verifyingState === 'IDLE' && prompts[0]}
                  {verifyingState === 'CAPTURING' && prompts[currentPromptIndex]}
                  {verifyingState === 'VERIFYING' && 'Comparing facial embedding vector...'}
                  {verifyingState === 'SUCCESS' && 'Face Biometric Match Verified!'}
                  {verifyingState === 'FAILED' && 'Verification Failed. Follow camera guidance.'}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartLivenessAndVerification}
            disabled={!hasPermission || verifyingState === 'VERIFYING' || verifyingState === 'CAPTURING'}
            className="flex-1 py-3 text-sm font-semibold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {verifyingState === 'VERIFYING' || verifyingState === 'CAPTURING' ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>{retryCount > 0 ? 'Retry Verification' : 'Verify & Login'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
