'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { fetchApi } from '../lib/api-client';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  suggestedLinks?: { label: string; url: string }[];
}

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your PhysioEdvance AI Academic Assistant. Ask me about 1st-4th year BPT subjects, study notes, LMS video masterclasses, or clinical research desk papers.',
      suggestedLinks: [
        { label: 'Browse 1st Year Subjects', url: '/subjects?year=FIRST_YEAR' },
        { label: 'Explore Digital Library', url: '/lms' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetchApi<{
        reply: string;
        suggestedLinks?: { label: string; url: string }[];
      }>('/chatbot/message', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg }),
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          suggestedLinks: res.suggestedLinks,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Sorry, I am temporarily unable to connect. Please try exploring subjects or notes directly from the main navigation.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full gradient-teal text-white shadow-xl hover:scale-105 transition-transform flex items-center justify-center relative group"
        >
          <Bot className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px]">
          {/* Header */}
          <div className="gradient-teal p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div>
                <h4 className="font-bold text-sm">PhysioEdvance AI Assistant</h4>
                <p className="text-[10px] text-teal-100">Academic & Clinical Learning Help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-teal-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-physio-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                {m.suggestedLinks && m.suggestedLinks.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.suggestedLinks.map((link, lIdx) => (
                      <a
                        key={lIdx}
                        href={link.url}
                        className="px-2.5 py-1 text-[10px] font-semibold text-physio-700 bg-physio-100 rounded-lg hover:bg-physio-200 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-2 text-slate-400">
                <Bot className="w-4 h-4 animate-bounce" />
                <span className="text-[11px]">Searching physiotherapy database...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Medical Disclaimer Banner */}
          <div className="bg-amber-50 px-3 py-1.5 text-[10px] text-amber-800 border-t border-amber-200 flex items-center space-x-1">
            <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
            <span>Educational guidance only. Not medical advice.</span>
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about subjects, notes, courses..."
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-physio-500"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 gradient-teal text-white rounded-xl disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
