'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppWidget() {
  const whatsappUrl = 'https://wa.me/919876543210?text=Hello%20PhysioEdvance!%20I%20have%20an%20academic%20or%20clinical%20enquiry.';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-40 w-12 h-12 rounded-full bg-emerald-500 text-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center group"
      title="Contact PhysioEdvance on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-current" />
    </a>
  );
}
