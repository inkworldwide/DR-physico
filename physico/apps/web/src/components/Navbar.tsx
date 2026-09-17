'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stethoscope, Search, User, Menu, X, ShieldCheck, LogOut, BookOpen, GraduationCap, PhoneCall } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const storedUser = localStorage.getItem('physio_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('physio_access_token');
    localStorage.removeItem('physio_refresh_token');
    localStorage.removeItem('physio_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-teal flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Physio<span className="text-physio-600">Edvance</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 font-semibold">
                Learn • Practice • Advance
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-physio-600 transition-colors">HOME</Link>
            <Link href="/about" className="hover:text-physio-600 transition-colors">ABOUT</Link>
            <Link href="/subjects" className="hover:text-physio-600 transition-colors flex items-center space-x-1">
              <span>SUBJECTS</span>
            </Link>
            <Link href="/lms" className="hover:text-physio-600 transition-colors">DIGITAL LIBRARY</Link>
            <Link href="/research" className="hover:text-physio-600 transition-colors">RESEARCH DESK</Link>
            <Link href="/blog" className="hover:text-physio-600 transition-colors">BLOG</Link>
            <Link href="/team" className="hover:text-physio-600 transition-colors">THE TEAM</Link>
            <Link href="/aim" className="hover:text-physio-600 transition-colors">AIM</Link>
            <Link href="/future-plans" className="hover:text-physio-600 transition-colors">FUTURE PLANS</Link>
            <Link href="/contact" className="hover:text-physio-600 transition-colors">CONTACT</Link>
          </nav>

          {/* User Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {user.roles?.includes('ADMIN') || user.roles?.includes('SUPER_ADMIN') ? (
                  <Link
                    href="/admin/dashboard"
                    className="px-4 py-2 text-xs font-semibold text-physio-700 bg-physio-50 hover:bg-physio-100 rounded-lg transition-colors border border-physio-200 flex items-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                ) : (
                  <Link
                    href="/student/dashboard"
                    className="px-4 py-2 text-xs font-semibold text-physio-700 bg-physio-50 hover:bg-physio-100 rounded-lg transition-colors border border-physio-200 flex items-center space-x-1.5"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-physio-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white gradient-teal rounded-xl hover:opacity-95 shadow-md transition-all flex items-center space-x-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-physio-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3">
          <Link href="/" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>HOME</Link>
          <Link href="/about" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
          <Link href="/subjects" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>SUBJECTS</Link>
          <Link href="/lms" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>DIGITAL LIBRARY</Link>
          <Link href="/research" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>RESEARCH DESK</Link>
          <Link href="/blog" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>BLOG</Link>
          <Link href="/team" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>THE TEAM</Link>
          <Link href="/aim" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>AIM</Link>
          <Link href="/future-plans" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>FUTURE PLANS</Link>
          <Link href="/contact" className="block py-2 text-slate-700 font-medium" onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>

          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-semibold text-red-600 bg-red-50 rounded-xl"
              >
                Logout ({user.firstName})
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full py-2.5 text-center text-sm font-semibold text-white gradient-teal rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
