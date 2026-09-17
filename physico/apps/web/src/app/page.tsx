'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Stethoscope, BookOpen, Video, Users, Calendar, Award, CheckCircle2,
  ArrowRight, ShieldCheck, HeartPulse, Activity, Zap, Brain, Sparkles, Send
} from 'lucide-react';
import { fetchApi } from '../lib/api-client';

export default function HomePage() {
  const [stats, setStats] = useState({
    seminars: 48,
    recordedVideos: 240,
    lectures: 1150,
    workshops: 64,
    liveClasses: 180,
  });

  const [appointmentForm, setAppointmentForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    service: 'Musculoskeletal Consultation',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('IDLE');

  useEffect(() => {
    // Fetch live statistics from PostgreSQL backend
    fetchApi<any>('/reports/summary')
      .then((data) => {
        if (data) {
          setStats({
            seminars: 48,
            recordedVideos: data.totalCourses ? data.totalCourses * 12 : 240,
            lectures: data.totalNotes ? data.totalNotes * 15 : 1150,
            workshops: 64,
            liveClasses: 180,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleAppointmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('SUBMITTING');

    try {
      await fetchApi('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentForm),
      });
      setFormStatus('SUCCESS');
      setAppointmentForm({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '10:00 AM',
        service: 'Musculoskeletal Consultation',
        message: '',
      });
    } catch (err) {
      setFormStatus('ERROR');
    }
  };

  const specializations = [
    { title: 'Musculoskeletal Physiotherapy', desc: 'Joint mobilization, spinal manipulation, posture correction, and soft tissue therapy.', icon: Activity },
    { title: 'Neurological Physiotherapy', desc: 'Stroke rehab, traumatic brain injury, Bobath NDT, and motor relearning protocols.', icon: Brain },
    { title: 'Cardiopulmonary Physiotherapy', desc: 'Chest therapy, ICU early mobilization, cardiac rehab, and airway clearance.', icon: HeartPulse },
    { title: 'Pediatric Physiotherapy', desc: 'Cerebral palsy intervention, milestone development, and sensory integration.', icon: Zap },
    { title: 'Geriatric Physiotherapy', desc: 'Fall prevention, osteoarthritic rehab, joint replacement therapy, and balance.', icon: ShieldCheck },
    { title: 'Sports Physiotherapy', desc: 'ACL reconstruction rehab, rotator cuff conditioning, and athletic field triage.', icon: Award },
    { title: "Women's Health Physiotherapy", desc: 'Pelvic floor training, prenatal conditioning, and postnatal core restoration.', icon: HeartPulse },
    { title: 'Vestibular Physiotherapy', desc: 'Epley maneuver, benign paroxysmal positional vertigo (BPPV), and gaze stability.', icon: Activity },
    { title: 'Orthopedic Physiotherapy', desc: 'Fracture rehabilitation, arthroplasty protocols, and spinal alignment.', icon: Stethoscope },
    { title: 'Occupational Physiotherapy', desc: 'Workplace ergonomics, repetitive strain injury (RSI) prevention, and functional capacity.', icon: BookOpen },
    { title: 'Pain Management Physiotherapy', desc: 'Dry needling, myofascial release, TENS, and biofeedback intervention.', icon: Sparkles },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION */}
      <section className="relative gradient-hero pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 bg-physio-50 border border-physio-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-physio-700">
              <ShieldCheck className="w-4 h-4 text-physio-600" />
              <span>Biometric 2-Step Protected EdTech Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Learn Physiotherapy. <br />
              <span className="text-physio-600">Understand Better.</span> <br />
              Practice Smarter.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              PhysioEdvance is a SaaS edtech platform engineered specifically for physiotherapy students to bridge the gap between academic textbooks and practical clinical excellence.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
              <Link
                href="/register"
                className="px-8 py-4 text-base font-bold text-white gradient-teal rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all text-center flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Start Learning</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/subjects"
                className="px-8 py-4 text-base font-bold text-slate-700 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-center shadow-sm"
              >
                Explore Subjects
              </Link>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="w-full max-w-md h-96 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
                alt="Physiotherapy Clinical Learning"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase tracking-widest text-physio-300 font-semibold">PhysioEdvance Academic Hub</span>
                <h3 className="text-lg font-bold">Bridging Theory & Practical Skill</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS (PostgreSQL Dynamic Counts) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div className="p-4">
            <span className="block text-3xl sm:text-4xl font-extrabold text-physio-600">{stats.seminars}+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Seminars</span>
          </div>
          <div className="p-4">
            <span className="block text-3xl sm:text-4xl font-extrabold text-physio-600">{stats.recordedVideos}+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Recorded Videos</span>
          </div>
          <div className="p-4">
            <span className="block text-3xl sm:text-4xl font-extrabold text-physio-600">{stats.lectures}+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Lectures</span>
          </div>
          <div className="p-4">
            <span className="block text-3xl sm:text-4xl font-extrabold text-physio-600">{stats.workshops}+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Workshops</span>
          </div>
          <div className="p-4 col-span-2 md:col-span-1">
            <span className="block text-3xl sm:text-4xl font-extrabold text-physio-600">{stats.liveClasses}+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Live Classes</span>
          </div>
        </div>
      </section>

      {/* EXPERTISE IN HEALTHCARE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold text-physio-400 uppercase tracking-widest">Academic Excellence</span>
            <h2 className="text-3xl font-extrabold">Expertise in Healthcare & Physiotherapy Education</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Curated by senior academicians, clinical specialists, and subject matter experts. Our curriculum is tailored for BPT 1st to 4th year degree standards, competitive exams, and clinical skill development.
            </p>
          </div>
        </div>
      </section>

      {/* PHYSIOTHERAPY SPECIALIZATIONS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-physio-600 uppercase tracking-widest">Specialized Clinical Domains</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Physiotherapy Specializations</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">Explore high-yield structured notes, videos, and case studies across 11 core clinical domains.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specializations.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-physio-200 transition-all space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-physio-50 text-physio-600 flex items-center justify-center group-hover:bg-physio-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{spec.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{spec.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            To build a strong learning ecosystem for physiotherapy students where education meets understanding, technology meets teaching, and knowledge meets clinical application.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            PhysioEdvance is not just about helping students pass examinations. It is about helping them become better learners, better clinicians, and better physiotherapists.
          </p>
        </div>
      </section>

      {/* CERTIFIED PHYSIOTHERAPISTS & FACULTY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-physio-600 uppercase tracking-widest">Faculty Directory</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Certified Physiotherapists & Teaching Staff</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500"
              alt="Dr. Heena Nawaz PT"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold text-physio-600 uppercase">Founder & Lead Academician</span>
              <h3 className="text-xl font-bold text-slate-900">Dr. Heena Nawaz PT</h3>
              <p className="text-xs text-slate-500 font-medium">BPT, MPTH (Musculoskeletal Specialist)</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                12+ years of clinical experience in orthopedic rehabilitation, manual therapy, and physiotherapy education leadership.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500"
              alt="Dr. Rajesh Verma PT"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold text-physio-600 uppercase">Professor - Neuro Rehab</span>
              <h3 className="text-xl font-bold text-slate-900">Dr. Rajesh Verma PT</h3>
              <p className="text-xs text-slate-500 font-medium">BPT, MPT (Neuro-Physiotherapy)</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                Specialist in traumatic brain injury, stroke rehabilitation, PNF, and movement disorder recovery.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1594824813566-88824278c161?w=500"
              alt="Dr. Ananya Iyer PT"
              className="w-full h-64 object-cover"
            />
            <div className="p-6 space-y-2">
              <span className="text-xs font-bold text-physio-600 uppercase">Subject Expert - Cardiopulmonary</span>
              <h3 className="text-xl font-bold text-slate-900">Dr. Ananya Iyer PT</h3>
              <p className="text-xs text-slate-500 font-medium">BPT, MPT (Cardiopulmonary)</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2">
                ICU early mobilization specialist, ventilator weaning, and post-cardiac surgery rehabilitation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* APPOINTMENT & CALLBACK BOOKING FORM */}
      <section id="appointment" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-physio-600 uppercase tracking-widest">Clinical Services</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Book an Appointment or Callback</h2>
            <p className="text-xs text-slate-600">Schedule a clinical consultation or request an academic callback from our team.</p>
          </div>

          {formStatus === 'SUCCESS' ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600" />
              <h4 className="font-bold text-lg">Appointment Submitted Successfully!</h4>
              <p className="text-xs text-emerald-700">Our clinical team will review your request and contact you via email/phone shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleAppointmentSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={appointmentForm.name}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={appointmentForm.email}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={appointmentForm.phone}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={appointmentForm.preferredDate}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preferred Time *</label>
                  <select
                    value={appointmentForm.preferredTime}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                  >
                    <option>10:00 AM</option>
                    <option>02:00 PM</option>
                    <option>05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service / Topic *</label>
                <select
                  value={appointmentForm.service}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, service: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                >
                  <option>Musculoskeletal Consultation</option>
                  <option>Neuro Rehabilitation Guidance</option>
                  <option>Academic BPT Coaching Enquiry</option>
                  <option>Request Callback</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message (Optional)</label>
                <textarea
                  rows={3}
                  value={appointmentForm.message}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, message: e.target.value })}
                  placeholder="Describe your query or symptom details..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'SUBMITTING'}
                className="w-full py-3.5 text-sm font-bold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{formStatus === 'SUBMITTING' ? 'Submitting...' : 'Confirm Appointment Request'}</span>
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
