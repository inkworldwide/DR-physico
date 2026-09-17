'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, FileText, Download, Clock, ArrowLeft, Layers, CheckCircle2 } from 'lucide-react';
import { fetchApi } from '../../../lib/api-client';

export default function SubjectDetailPage() {
  const params = useParams();
  const subjectId = params?.id as string;

  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      fetchApi<any>(`/subjects/${subjectId}`)
        .then((data) => setSubject(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [subjectId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="h-8 bg-slate-200 w-48 rounded-lg animate-pulse" />
        <div className="h-64 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Subject Not Found</h2>
        <Link href="/subjects" className="text-physio-600 font-semibold hover:underline">
          Return to Subjects Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link href="/subjects" className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-physio-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Subjects Directory</span>
      </Link>

      {/* Hero Header */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 space-y-4">
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-physio-50 text-physio-700 font-mono text-xs font-bold rounded-lg border border-physio-200">
            {subject.code}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {subject.year?.displayName || 'Core Subject'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{subject.title}</h1>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{subject.description}</p>
      </div>

      {/* Chapters & Topics Tree */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Layers className="w-5 h-5 text-physio-600" />
          <span>Curriculum Chapters & Study Notes</span>
        </h2>

        {subject.chapters?.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-100 text-center text-slate-500 text-xs">
            No chapters uploaded yet for this subject.
          </div>
        ) : (
          subject.chapters?.map((chapter: any, cIdx: number) => (
            <div key={chapter.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-physio-600 uppercase tracking-wider">Chapter {cIdx + 1}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{chapter.title}</h3>
                {chapter.description && (
                  <p className="text-xs text-slate-600 mt-1">{chapter.description}</p>
                )}
              </div>

              {/* Topics */}
              <div className="space-y-4">
                {chapter.topics?.map((topic: any, tIdx: number) => (
                  <div key={topic.id} className="bg-slate-50 rounded-2xl p-4 sm:p-5 space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-physio-600" />
                      <span>{topic.title}</span>
                    </h4>
                    {topic.contentSummary && (
                      <p className="text-xs text-slate-600 pl-4">{topic.contentSummary}</p>
                    )}

                    {/* Notes List */}
                    <div className="pl-4 space-y-2 pt-2">
                      {topic.notes?.map((note: any) => (
                        <div
                          key={note.id}
                          className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs hover:border-physio-300 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-bold text-slate-900">{note.title}</h5>
                              <p className="text-[11px] text-slate-500">{note.description}</p>
                              <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{note.readingTimeMinutes} min read</span>
                                </span>
                                <span>PDF Document</span>
                              </div>
                            </div>
                          </div>

                          <a
                            href={note.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-2 text-xs font-semibold text-physio-700 bg-physio-50 hover:bg-physio-100 rounded-lg border border-physio-200 flex items-center space-x-1.5 shrink-0"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download PDF</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
