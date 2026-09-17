'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Filter, FileText, Layers, ChevronRight } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSubjects();
  }, [selectedYear, selectedCategory]);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      let query = '/subjects?';
      if (selectedYear !== 'ALL') query += `year=${selectedYear}&`;
      if (selectedCategory !== 'ALL') query += `category=${selectedCategory}&`;
      if (searchQuery) query += `search=${encodeURIComponent(searchQuery)}&`;

      const data = await fetchApi<any[]>(query);
      setSubjects(data);
    } catch (e) {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadSubjects();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Academic Curriculum Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Physiotherapy Academic Subjects
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Explore all 33 core BPT degree subjects (1st to 4th Year) and 23 specialized physiotherapy subjects with high-yield lecture notes and study guides.
        </p>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Year Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { label: 'All Subjects', value: 'ALL' },
            { label: '1st Year BPT', value: 'FIRST_YEAR' },
            { label: '2nd Year BPT', value: 'SECOND_YEAR' },
            { label: '3rd Year BPT', value: 'THIRD_YEAR' },
            { label: '4th Year BPT', value: 'FOURTH_YEAR' },
            { label: 'Specialized & Allied', value: 'OTHER' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedYear(tab.value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedYear === tab.value
                  ? 'bg-physio-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subject by title or code..."
            className="w-full text-xs pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </form>
      </div>

      {/* Subjects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 h-48 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-400" />
          <h3 className="font-bold text-slate-800">No subjects found matching filters</h3>
          <p className="text-xs">Try selecting a different academic year or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/subjects/${subject.id}`}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-physio-300 transition-all flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-physio-50 text-physio-700 font-mono text-[11px] font-bold rounded-lg border border-physio-200">
                    {subject.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {subject.yearDisplayName}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-physio-600 transition-colors">
                  {subject.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {subject.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subject.chaptersCount || 2} Chapters</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subject.notesCount || 2} Notes</span>
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-physio-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
