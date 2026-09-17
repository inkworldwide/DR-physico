import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { FaceVerificationModule } from './modules/face-verification/face-verification.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { LmsModule } from './modules/lms/lms.module';
import { LibraryModule } from './modules/library/library.module';
import { ResearchModule } from './modules/research/research.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { TeamModule } from './modules/team/team.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { LiveClassesModule } from './modules/live-classes/live-classes.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SearchModule } from './modules/search/search.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    FaceVerificationModule,
    SubjectsModule,
    LmsModule,
    LibraryModule,
    ResearchModule,
    BlogsModule,
    TeamModule,
    AppointmentsModule,
    PaymentsModule,
    LiveClassesModule,
    ReportsModule,
    SearchModule,
    ChatbotModule,
    AuditModule,
  ],
})
export class AppModule {}
