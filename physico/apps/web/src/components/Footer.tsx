import React from 'react';
import Link from 'next/link';
import { Stethoscope, Mail, Phone, MapPin, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Physio<span className="text-physio-400">Edvance</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Learn Physiotherapy. Understand Better. Practice Smarter. Advance Further.
              The leading SaaS edtech learning platform for physiotherapy students and professionals.
            </p>
            <div className="pt-2 flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-physio-400" />
              <span>Biometric Face Verification Protected Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Academic Years</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/subjects?year=FIRST_YEAR" className="hover:text-physio-400 transition-colors">1st Year BPT Subjects</Link></li>
              <li><Link href="/subjects?year=SECOND_YEAR" className="hover:text-physio-400 transition-colors">2nd Year BPT Subjects</Link></li>
              <li><Link href="/subjects?year=THIRD_YEAR" className="hover:text-physio-400 transition-colors">3rd Year BPT Subjects</Link></li>
              <li><Link href="/subjects?year=FOURTH_YEAR" className="hover:text-physio-400 transition-colors">4th Year BPT Subjects</Link></li>
              <li><Link href="/subjects?year=OTHER" className="hover:text-physio-400 transition-colors">Allied & Specialized Subjects</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Core Aspects</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/lms" className="hover:text-physio-400 transition-colors">Digital Library & LMS</Link></li>
              <li><Link href="/research" className="hover:text-physio-400 transition-colors">Research Desk</Link></li>
              <li><Link href="/blog" className="hover:text-physio-400 transition-colors">Educational Blog</Link></li>
              <li><Link href="/team" className="hover:text-physio-400 transition-colors">Teaching Faculty</Link></li>
              <li><Link href="/future-plans" className="hover:text-physio-400 transition-colors">Workshops & Webinars</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-physio-400 shrink-0 mt-0.5" />
                <span>PhysioEdvance Healthcare EdTech Campus, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-physio-400 shrink-0" />
                <span>support@physioedvance.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-physio-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PhysioEdvance. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-1">
            <span>Founded & Directed by</span>
            <span className="font-semibold text-slate-300">Dr. Heena Nawaz PT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
