'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Award, Stethoscope } from 'lucide-react';
import { fetchApi } from '../../lib/api-client';

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchApi<any[]>('/team')
      .then((data) => setTeamMembers(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-physio-600 uppercase tracking-widest bg-physio-50 px-3 py-1 rounded-full border border-physio-200">
          Faculty Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Meet The PhysioEdvance Academic Team
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto">
          Teaching staff, subject experts, clinical mentors, and technical support dedicated to empowering physiotherapy students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 space-y-4">
            <img
              src={member.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400'}
              alt={member.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6 pt-0 space-y-2">
              <span className="text-[10px] font-bold text-physio-600 uppercase tracking-wider">{member.designation}</span>
              <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{member.qualification}</p>
              <p className="text-xs text-slate-600 leading-relaxed pt-2">{member.biography}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
