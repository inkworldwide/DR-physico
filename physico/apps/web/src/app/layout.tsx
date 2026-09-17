import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIChatbotWidget from '../components/AIChatbotWidget';
import WhatsAppWidget from '../components/WhatsAppWidget';

export const metadata: Metadata = {
  title: 'PhysioEdvance - Learn Physiotherapy. Understand Better. Practice Smarter. Advance Further.',
  description: 'The premier EdTech SaaS platform designed specifically for physiotherapy students, offering structured subjects, lecture notes, LMS courses, research desk, and live classes.',
  keywords: ['Physiotherapy EdTech', 'BPT Subjects', 'Physiotherapy Notes', 'Manual Therapy', 'Dr Heena Nawaz PT'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <AIChatbotWidget />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
