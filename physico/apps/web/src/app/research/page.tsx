'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, ExternalLink, Download, FileText, Calendar, Tag } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function ResearchPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/research')
      .then((data) => setArticles(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Evidence-Based Practice
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          PhysioEdvance Research Desk
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Scientific research articles, systematic reviews, case studies, biostatistics resources, and PubMed references.
        </p>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-44 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-3 py-1 bg-physio-50 text-physio-700 text-xs font-bold rounded-lg border border-physio-200">
                  {article.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900">{article.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{article.abstractText}</p>

              {article.tags && (
                <div className="flex items-center space-x-2 text-[11px] text-slate-500 pt-1">
                  <Tag className="w-3 h-3 text-physio-600" />
                  <span>{article.tags}</span>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">DOI: {article.doi || '10.1016/pt.2026'}</span>
                {article.pdfUrl && (
                  <a
                    href={article.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-semibold text-physio-700 bg-physio-50 hover:bg-physio-100 rounded-xl border border-physio-200 flex items-center space-x-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Paper PDF</span>
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
