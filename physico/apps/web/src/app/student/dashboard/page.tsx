'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap, BookOpen, Clock, Calendar, CheckCircle2, Award,
  ShieldCheck, ArrowRight, PlayCircle, ExternalLink, Bookmark, User
} from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('physio_user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    const u = JSON.parse(storedUser);
    setUser(u);

    // Fetch student data
    Promise.all([
      fetchApi<any[]>('/courses/my-courses').catch(() => []),
      fetchApi<any[]>('/live-classes').catch(() => []),
      fetchApi<any[]>('/subjects?year=THIRD_YEAR').catch(() => []),
    ])
      .then(([cData, lData, sData]) => {
        setEnrolledCourses(cData || []);
        setLiveClasses(lData || []);
        setSubjects(sData || []);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-physio-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 z-10">
          <div className="inline-flex items-center space-x-2 bg-physio-500/20 border border-physio-400/30 px-3 py-1 rounded-full text-xs text-physio-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-physio-400" />
            <span>Biometric Session Active • 3rd Year BPT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Track your course progress, access lecture notes, join upcoming live Zoom classes, and prepare for clinical exams.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10">
          <Link
            href="/subjects"
            className="px-5 py-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all flex items-center space-x-1.5"
          >
            <BookOpen className="w-4 h-4 text-physio-600" />
            <span>Browse Subjects</span>
          </Link>
        </div>
      </div>

      {/* Learning Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <span className="block text-2xl font-extrabold text-physio-600">{enrolledCourses.length || 1}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Courses</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <span className="block text-2xl font-extrabold text-physio-600">84%</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Completion</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <span className="block text-2xl font-extrabold text-physio-600">12</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Saved Notes</span>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center space-y-1">
          <span className="block text-2xl font-extrabold text-physio-600">{liveClasses.length || 1}</span>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Classes</span>
        </div>
      </div>

      {/* Main Grid: Courses & Live Classes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <PlayCircle className="w-5 h-5 text-physio-600" />
              <span>Continue Learning</span>
            </h2>
            <Link href="/lms" className="text-xs font-semibold text-physio-600 hover:underline">
              View All LMS Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center space-y-4">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">No Active Course Enrollments</h3>
                <p className="text-xs text-slate-500 mt-1">Enroll in practical video masterclasses to track progress.</p>
              </div>
              <Link
                href="/lms"
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white gradient-teal rounded-xl"
              >
                <span>Browse Digital Library</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <span className="px-2.5 py-0.5 bg-physio-50 text-physio-700 text-[10px] font-bold rounded-md border border-physio-200">
                      {item.course?.category || 'Physiotherapy'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{item.course?.title}</h3>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-physio-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.progressPercent || 25}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold">{item.progressPercent || 25}% Complete</span>
                  </div>

                  <Link
                    href={`/lms`}
                    className="px-4 py-2.5 text-xs font-bold text-white gradient-teal rounded-xl shadow-xs shrink-0"
                  >
                    Resume Lesson
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Current Academic Year Subjects */}
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900">Your Academic Year Subjects</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  href={`/subjects/${s.id}`}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-physio-300 transition-all flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-physio-600">{s.code}</span>
                    <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming Live Classes */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-physio-600" />
              <span>Upcoming Live Classes</span>
            </h3>

            {liveClasses.length === 0 ? (
              <p className="text-xs text-slate-500">No live Zoom classes scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {liveClasses.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <span className="px-2 py-0.5 bg-physio-100 text-physio-800 text-[10px] font-bold rounded">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{new Date(item.scheduledAt).toLocaleString()}</p>
                    <p className="text-[11px] text-slate-600 font-semibold">Instructor: {item.instructor}</p>

                    {item.zoomMeetingUrl && (
                      <a
                        href={item.zoomMeetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full py-2 text-[11px] font-bold text-white gradient-teal rounded-xl flex items-center justify-center space-x-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Join Zoom Meeting</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
