import React from 'react';
import Link from 'next/link';
import { Stethoscope, Award, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          About PhysioEdvance
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          PhysioEdvance – Empowering the Next Generation of Physiotherapists
        </h1>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 space-y-8 text-slate-700 leading-relaxed text-base">
        <p className="text-lg text-slate-800 font-medium leading-relaxed">
          PhysioEdvance is an edtech platform created specifically for physiotherapy students, with a simple vision—to make learning physiotherapy more structured, understandable, practical, and accessible.
        </p>

        <p>
          Physiotherapy is much more than memorising subjects and preparing for examinations. It is about understanding the human body, connecting concepts, developing clinical reasoning, building practical skills, and becoming confident healthcare professionals.
        </p>

        <p className="font-semibold text-slate-900 text-lg border-l-4 border-physio-600 pl-4 py-1">
          That is where PhysioEdvance comes in.
        </p>

        <div className="space-y-3 pt-2">
          <h2 className="text-2xl font-bold text-slate-900">One Platform. Everything Physiotherapy.</h2>
          <p>
            PhysioEdvance aims to be a one-stop learning solution for physiotherapy students, bringing together the knowledge, resources, guidance, and learning support students need throughout their academic journey.
          </p>
          <p>
            From basic sciences and core physiotherapy subjects to clinical concepts, practical learning, examination preparation, and professional development, PhysioEdvance is designed to help students learn beyond textbooks and truly understand what they study.
          </p>
        </div>

        {/* Highlight Box */}
        <div className="bg-gradient-to-r from-physio-50 to-teal-50 p-6 rounded-2xl border border-physio-200 space-y-4">
          <h3 className="text-xl font-bold text-physio-800">Learn. Understand. Apply. Advance.</h3>
          <p className="text-sm text-slate-700">
            Our focus is not simply on what to study, but on how to understand it.
          </p>
          <div className="space-y-2 text-sm font-semibold text-slate-900 bg-white p-4 rounded-xl border border-physio-100 shadow-sm">
            <p className="text-slate-600">We want students to move from:</p>
            <p className="text-amber-700">“I have memorised this topic” → <span className="text-physio-700 font-bold">“I understand this concept.”</span></p>
            <p className="text-slate-600 pt-1">And eventually:</p>
            <p className="text-emerald-700">“I understand this concept” → <span className="text-physio-800 font-extrabold">“I can apply it clinically.”</span></p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Through simplified explanations, structured learning, educational resources, interactive initiatives, and expert guidance, PhysioEdvance strives to make even complex physiotherapy concepts easier to understand and remember.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-slate-900">More Than an Educational Platform</h2>
          <p>
            PhysioEdvance is built around the belief that every physiotherapy student deserves access to quality learning, proper guidance, and a supportive academic community.
          </p>
          <p>
            It is a space where students can learn at their own pace, strengthen their fundamentals, clarify concepts, improve their knowledge, and gradually develop the confidence required to step into clinical practice.
          </p>
          <p className="italic font-medium text-slate-800 pt-2">
            Because becoming a good physiotherapist doesn't happen overnight. It happens one concept, one skill, one patient, and one learning experience at a time.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
          <p>
            To build a strong learning ecosystem for physiotherapy students where education meets understanding, technology meets teaching, and knowledge meets clinical application.
          </p>
          <p>
            PhysioEdvance is not just about helping students pass examinations. It is about helping them become better learners, better clinicians, and better physiotherapists.
          </p>
        </div>

        <div className="text-center pt-8 border-t border-slate-100 space-y-4">
          <p className="text-2xl font-extrabold text-physio-700">
            PhysioEdvance — Learn Physiotherapy. Understand Better. Practice Smarter. Advance Further.
          </p>
          <div className="pt-4">
            <span className="block text-xl font-bold text-slate-900">Get Yourself PhysioEdvanced</span>
            <span className="block text-sm font-semibold text-slate-500 mt-1">Dr. Heena Nawaz PT</span>
          </div>

          <div className="pt-6">
            <Link
              href="/register"
              className="inline-flex items-center space-x-2 px-8 py-4 text-base font-bold text-white gradient-teal rounded-2xl hover:shadow-lg transition-all"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
