'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Video, PlayCircle, Award, CheckCircle2, Star, Clock } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function LmsPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/courses')
      .then((data) => setCourses(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Digital Library & LMS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Practical Clinical Video Masterclasses
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Master orthopedic assessment, neuro-rehab protocols, and manual therapy techniques with structured video modules and quizzes.
        </p>
      </div>

      {/* Courses Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-72 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between group hover:shadow-xl transition-all"
            >
              <div>
                <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-physio-700">
                    {course.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-physio-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="pt-2 flex items-center space-x-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{course.totalDurationMinutes} min</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Video className="w-3.5 h-3.5 text-slate-400" />
                      <span>Video Lessons</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between mt-4">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Instructor</span>
                  <span className="text-xs font-bold text-slate-800">{course.instructorName}</span>
                </div>
                <Link
                  href={`/register`}
                  className="px-4 py-2 text-xs font-bold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md flex items-center space-x-1"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Start Course</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
