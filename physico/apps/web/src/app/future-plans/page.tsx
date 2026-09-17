'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Video, Mic, Users, Sparkles, ExternalLink, Clock } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function FuturePlansPage() {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/live-classes')
      .then((data) => setLiveClasses(data))
      .catch(() => {});
  }, []);

  const initiatives = [
    { title: 'Pre-recorded Video Masterclasses', desc: 'High-definition procedural video lectures covering clinical assessment and joint mobilizations.', icon: Video },
    { title: 'Live Interactive Zoom Classes', desc: 'Real-time case study discussions with senior academicians and live Q&A.', icon: Calendar },
    { title: 'Live Discussions & Panel Debates', desc: 'Expert panels discussing evidence-based practice and recent clinical breakthroughs.', icon: Users },
    { title: 'Workshops & Hands-On Seminars', desc: 'Physical and virtual hands-on workshops in dry needling, cupping, and taping.', icon: Sparkles },
    { title: 'PhysioEdvance Podcasts', desc: 'Audio podcasts featuring interviews with leading physiotherapists and clinic owners.', icon: Mic },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Upcoming Initiatives & Roadmap
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Future Plans & Live Class Schedule
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Explore upcoming live Zoom sessions, workshops, webinars, podcasts, and pre-recorded clinical masterclasses.
        </p>
      </div>

      {/* Initiatives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {initiatives.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-physio-50 text-physio-600 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live Zoom Classes Schedule */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-physio-600" />
          <span>Scheduled Live Classes & Webinars</span>
        </h2>

        <div className="space-y-4">
          {liveClasses.length === 0 ? (
            <p className="text-xs text-slate-500">No upcoming live classes scheduled at this moment.</p>
          ) : (
            liveClasses.map((item) => (
              <div key={item.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-physio-100 text-physio-800 text-[10px] font-bold rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{new Date(item.scheduledAt).toLocaleString()}</span>
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600">{item.description}</p>
                  <p className="text-xs font-semibold text-slate-700">Instructor: {item.instructor}</p>
                </div>

                {item.zoomMeetingUrl && (
                  <a
                    href={item.zoomMeetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 text-xs font-bold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md flex items-center space-x-1.5 shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Join Zoom Meeting</span>
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
