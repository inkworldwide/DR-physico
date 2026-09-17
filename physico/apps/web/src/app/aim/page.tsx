import React from 'react';
import { Target, CheckCircle2, Award, HeartHandshake, Sparkles } from 'lucide-react';

export default function AimPage() {
  const objectives = [
    { title: 'Educational Goals', desc: 'Provide structured, accurate, and high-yield academic study material for all 33 core BPT subjects.' },
    { title: 'Clinical Reasoning', desc: 'Train students to transition from rote textbook memorization to logical clinical differential diagnosis.' },
    { title: 'Practical Learning', desc: 'Demonstrate hands-on clinical assessment techniques, goniometry, MMT, and manual therapy skills via video masterclasses.' },
    { title: 'Professional Development', desc: 'Guide physiotherapy students through ethics, medicolegal awareness, practice setup, and career roadmap.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Core Purpose & Mission
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          The AIM of PhysioEdvance
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Empowering physiotherapy students to understand concepts deeply, practice confidently, and advance professionally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {objectives.map((obj, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl gradient-teal text-white flex items-center justify-center font-bold">
              0{idx + 1}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{obj.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{obj.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
