import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(private readonly prisma: PrismaService) {}

  async processMessage(userMessage: string) {
    const lower = userMessage.toLowerCase();
    let reply = '';
    let suggestedLinks: { label: string; url: string }[] = [];

    if (lower.includes('subject') || lower.includes('year') || lower.includes('bpt')) {
      const subjectsCount = await this.prisma.subject.count();
      reply = `PhysioEdvance offers comprehensive study materials for all ${subjectsCount} subjects across 1st to 4th Year BPT and specialized physiotherapy topics (such as Dry Needling, Manual Therapy, Cupping, and Bioengineering).`;
      suggestedLinks.push({ label: 'Explore All Subjects', url: '/subjects' });
    } else if (lower.includes('note') || lower.includes('pdf')) {
      reply = `You can access structured lecture notes and downloadable high-yield PDFs under each subject chapter in our Core Aspects section.`;
      suggestedLinks.push({ label: 'Browse Study Notes', url: '/subjects' });
    } else if (lower.includes('course') || lower.includes('lms')) {
      reply = `Our Digital Library LMS features practical clinical assessment video masterclasses, quizzes, and course completion certificates.`;
      suggestedLinks.push({ label: 'View LMS Courses', url: '/lms' });
    } else if (lower.includes('appointment') || lower.includes('callback') || lower.includes('consult')) {
      reply = `You can request a callback or book a clinical consultation directly through our appointment booking system.`;
      suggestedLinks.push({ label: 'Book Appointment', url: '/#appointment' });
    } else {
      reply = `Hello! I am your PhysioEdvance AI Academic Assistant. I can help you find physiotherapy subjects, study notes, research papers, LMS video masterclasses, and live class schedules.

*Note: This AI assistant is strictly designed for educational guidance and does not replace professional medical diagnosis or clinical advice.*`;
      suggestedLinks.push({ label: 'Subjects Directory', url: '/subjects' });
      suggestedLinks.push({ label: 'Research Desk', url: '/research' });
    }

    return {
      reply,
      suggestedLinks,
      disclaimer: 'This AI assistant provides educational guidance only and is not a substitute for professional medical advice.',
    };
  }
}
