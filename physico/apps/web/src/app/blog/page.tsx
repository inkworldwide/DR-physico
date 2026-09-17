'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, User, Calendar, ArrowRight } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any[]>('/blogs')
      .then((data) => setBlogs(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          CMS Articles & Publications
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          PhysioEdvance Educational Blog
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Clinical advice, BPT exam preparation guides, case breakdowns, and career development insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="h-64 bg-slate-200 rounded-3xl animate-pulse col-span-2" />
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col justify-between group">
              <div>
                <img
                  src={blog.coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800'}
                  alt={blog.title}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-6 space-y-3">
                  <span className="px-2.5 py-1 bg-physio-50 text-physio-700 text-[10px] font-bold rounded-lg border border-physio-200">
                    {blog.category?.name || 'Clinical Guidance'}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-physio-600 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-4">
                <span className="font-semibold text-slate-700">Dr. Heena Nawaz PT</span>
                <span className="text-[11px]">{new Date(blog.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
