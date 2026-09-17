'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/appointments/callback', {
        method: 'POST',
        body: JSON.stringify({ name: form.name, phone: form.phone, preferredTime: 'Immediate' }),
      });
      setSubmitted(true);
    } catch (e) {
      // fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Contact PhysioEdvance
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Have questions about BPT subjects, course subscriptions, or institutional access? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>

          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-physio-600 shrink-0 mt-1" />
              <div>
                <strong className="block text-slate-900">Campus Address</strong>
                <span>PhysioEdvance EdTech Center, Healthcare & Science Campus, India</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-physio-600 shrink-0" />
              <div>
                <strong className="block text-slate-900">Email Us</strong>
                <span>support@physioedvance.com</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-physio-600 shrink-0" />
              <div>
                <strong className="block text-slate-900">Phone Support</strong>
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <h4 className="font-bold">Message Sent!</h4>
              <p className="text-xs">We will get back to you as soon as possible.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-sm font-bold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
