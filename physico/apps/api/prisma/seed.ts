import { PrismaClient, RoleName, AcademicYearEnum, SubjectCategory, TeamCategory, LiveClassCategory, AppointmentStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting PhysioEdvance Database Seeding...');

  // 1. Seed Roles
  console.log('Seeding Roles...');
  const rolesMap: Record<string, any> = {};
  for (const roleName of Object.values(RoleName) as RoleName[]) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: {
        name: roleName,
        description: `PhysioEdvance ${roleName} system role`,
      },
    });
    rolesMap[roleName as string] = role;
  }

  // 2. Seed Default Users
  console.log('Seeding Default Users...');
  const passwordHash = await bcrypt.hash('PhysioPass123!', 10);

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@physioedvance.com' },
    update: {},
    create: {
      email: 'admin@physioedvance.com',
      passwordHash,
      firstName: 'Dr. Heena',
      lastName: 'Nawaz PT',
      phone: '+91 9876543210',
      isEmailVerified: true,
      isFaceEnrolled: true,
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      userRoles: {
        create: [
          { roleId: rolesMap[RoleName.SUPER_ADMIN].id },
          { roleId: rolesMap[RoleName.ADMIN].id },
        ],
      },
      teacherProfile: {
        create: {
          qualification: 'MPTH, BPT, Certified Manual Therapist',
          specialization: 'Musculoskeletal & Neurological Physiotherapy',
          biography: 'Founder and Lead Academician at PhysioEdvance with over 12+ years of clinical and teaching experience.',
        },
      },
    },
  });

  // Mock Face Embedding vector for Admin
  await prisma.faceEnrollment.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      encryptedEmbedding: JSON.stringify(Array.from({ length: 128 }, (_, i) => (i % 2 === 0 ? 0.42 : -0.18))),
      consentGivenAt: new Date(),
    },
  });

  // Student User
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@physioedvance.com' },
    update: {},
    create: {
      email: 'student@physioedvance.com',
      passwordHash,
      firstName: 'Aarav',
      lastName: 'Sharma',
      phone: '+91 9123456789',
      isEmailVerified: true,
      isFaceEnrolled: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      userRoles: {
        create: [
          { roleId: rolesMap[RoleName.STUDENT].id },
        ],
      },
      studentProfile: {
        create: {
          academicYear: AcademicYearEnum.THIRD_YEAR,
          rollNumber: 'BPT2023-042',
          institutionName: 'National Institute of Physiotherapy',
          city: 'New Delhi',
        },
      },
    },
  });

  // Mock Face Embedding vector for Student
  await prisma.faceEnrollment.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      encryptedEmbedding: JSON.stringify(Array.from({ length: 128 }, (_, i) => (i % 2 === 0 ? 0.35 : -0.22))),
      consentGivenAt: new Date(),
    },
  });

  // 3. Seed Years
  console.log('Seeding Academic Years...');
  const yearData = [
    { code: AcademicYearEnum.FIRST_YEAR, displayName: '1st Year BPT', orderIndex: 1 },
    { code: AcademicYearEnum.SECOND_YEAR, displayName: '2nd Year BPT', orderIndex: 2 },
    { code: AcademicYearEnum.THIRD_YEAR, displayName: '3rd Year BPT', orderIndex: 3 },
    { code: AcademicYearEnum.FOURTH_YEAR, displayName: '4th Year BPT', orderIndex: 4 },
    { code: AcademicYearEnum.OTHER, displayName: 'Allied & Advanced Subjects', orderIndex: 5 },
  ];

  const yearMap: Record<string, any> = {};
  for (const y of yearData) {
    const yr = await prisma.year.upsert({
      where: { code: y.code },
      update: {},
      create: y,
    });
    yearMap[y.code] = yr;
  }

  // 4. Seed All 33 Core Subjects + 23 Allied Subjects
  console.log('Seeding 56 Academic Subjects (33 Core + 23 Specialized)...');

  const coreSubjects = [
    // 1ST YEAR
    { title: 'Anatomy', code: 'ANAT-101', yearCode: AcademicYearEnum.FIRST_YEAR, category: SubjectCategory.CORE, desc: 'Gross human anatomy, neuroanatomy, osteology, and myology for physiotherapists.' },
    { title: 'Physiology', code: 'PHYS-102', yearCode: AcademicYearEnum.FIRST_YEAR, category: SubjectCategory.CORE, desc: 'Human organ systems, nerve-muscle physiology, cardiorespiratory & renal mechanisms.' },
    { title: 'Biochemistry', code: 'BIOC-103', yearCode: AcademicYearEnum.FIRST_YEAR, category: SubjectCategory.CORE, desc: 'Metabolic pathways, biomolecules, enzyme kinetics, and clinical biochemistry.' },
    { title: 'Biomechanics', code: 'BIOM-104', yearCode: AcademicYearEnum.FIRST_YEAR, category: SubjectCategory.CORE, desc: 'Kinetics, kinematics, joint mechanics, gait analysis, and posture evaluation.' },
    { title: 'Psychology', code: 'PSYC-105', yearCode: AcademicYearEnum.FIRST_YEAR, category: SubjectCategory.CORE, desc: 'Behavioral psychology, stress management, patient rapport, and coping strategies.' },
    { title: 'Sociology', code: 'SOCI-106', yearCode: AcademicYearEnum.FIRST_YEAR, category: SubjectCategory.CORE, desc: 'Social determinants of health, community dynamics, and healthcare access.' },

    // 2ND YEAR
    { title: 'Pathology', code: 'PATH-201', yearCode: AcademicYearEnum.SECOND_YEAR, category: SubjectCategory.CORE, desc: 'General & systemic pathology, inflammation, tissue repair, and neoplasia.' },
    { title: 'Microbiology', code: 'MICR-202', yearCode: AcademicYearEnum.SECOND_YEAR, category: SubjectCategory.CORE, desc: 'Bacteriology, virology, mycology, hospital infection control, and immunity.' },
    { title: 'Exercise Therapy', code: 'EXTH-203', yearCode: AcademicYearEnum.SECOND_YEAR, category: SubjectCategory.CORE, desc: 'Therapeutic exercise techniques, goniometry, MMT, stretching, and resistance training.' },
    { title: 'Electrotherapy', code: 'ELTH-204', yearCode: AcademicYearEnum.SECOND_YEAR, category: SubjectCategory.CORE, desc: 'Low, medium, and high frequency electrotherapeutic modalities and ultrasound.' },
    { title: 'Pharmacology', code: 'PHAR-205', yearCode: AcademicYearEnum.SECOND_YEAR, category: SubjectCategory.CORE, desc: 'Autonomic, cardiovascular, NSAID, and muscle relaxant pharmacotherapeutics.' },

    // 3RD YEAR
    { title: 'General Medicine', code: 'GMED-301', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Clinical medicine, systemic disorders, infectious diseases, and endocrine conditions.' },
    { title: 'General Surgery', code: 'GSUR-302', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Surgical principles, wound healing, abdominal & cardiothoracic surgeries.' },
    { title: 'Orthopedics and Traumatology', code: 'ORTH-303', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Fractures, dislocations, arthroplasty, and musculoskeletal trauma management.' },
    { title: 'Physiotherapy in Orthopedics', code: 'PTOR-304', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Assessment and rehabilitation of orthopedic conditions, joint replacements, and spinal disorders.' },
    { title: 'Physiotherapy in Cardiorespiratory Conditions', code: 'PTCR-305', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Pulmonary rehabilitation, chest physiotherapy, cardiac rehab, and airway clearance.' },
    { title: 'OBG', code: 'OBGY-306', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Obstetrics and Gynecology clinical fundamentals, antenatal and postnatal care.' },
    { title: 'Physiotherapy in OBG Conditions', code: 'PTOB-307', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Pelvic floor muscle training, prenatal exercises, postnatal rehab, and incontinence care.' },
    { title: 'Sports Medicine', code: 'SPMD-308', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Sports injury biomechanics, athletic conditioning, doping rules, and field care.' },
    { title: 'Physiotherapy in Sports Conditions', code: 'PTSP-309', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Athletic screening, ACL rehab, rotator cuff rehab, and return-to-sport protocols.' },
    { title: 'Dermatology', code: 'DERM-310', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Skin lesions, burn wound healing, psoriasis, and pressure ulcer management.' },
    { title: 'Ophthalmology', code: 'OPHT-311', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Ocular disorders, visual field testing, and visual impairment rehabilitation.' },
    { title: 'ENT', code: 'ENTM-312', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Ear, nose, throat disorders, facial nerve palsy, and swallowing assessment.' },
    { title: 'ICU Care and Intensive Medicine and Emergency Care', code: 'ICUC-313', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Mechanical ventilation, arterial blood gas monitoring, and emergency resuscitation.' },
    { title: 'Physiotherapy in ICU Setup and Emergency Conditions', code: 'PTIC-314', yearCode: AcademicYearEnum.THIRD_YEAR, category: SubjectCategory.CORE, desc: 'Early mobilization in ICU, suctioning, ventilator weaning, and critical care rehab.' },

    // 4TH YEAR
    { title: 'Neurology, Neuromedicine and Neurosurgery', code: 'NEUR-401', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Stroke, traumatic brain injury, spinal cord injury, movement disorders, and neurosurgery.' },
    { title: 'Pediatrics and Pediatric Neurology', code: 'PEDI-402', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Cerebral palsy, developmental delays, spina bifida, and pediatric neuromuscular disorders.' },
    { title: 'Physiotherapy in Neurological Conditions', code: 'PTNE-403', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Bobath, PNF, NDT, motor relearning program, stroke rehab, and spinal cord rehab.' },
    { title: 'Physiotherapy in Pediatric Conditions', code: 'PTPD-404', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Early intervention, sensory integration, developmental therapy, and pediatric orthotics.' },
    { title: 'Community Medicine', code: 'CMED-405', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Epidemiology, public health programs, occupational health, and preventive medicine.' },
    { title: 'Community Physiotherapy', code: 'CMP T-406', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'CBR (Community-Based Rehabilitation), disability prevention, and geriatric community care.' },
    { title: 'Research Methodology', code: 'RESM-407', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Study design, RCTs, systemic reviews, clinical trials, and ethics in research.' },
    { title: 'Biostatistics', code: 'BSTA-408', yearCode: AcademicYearEnum.FOURTH_YEAR, category: SubjectCategory.CORE, desc: 'Parametric and non-parametric tests, p-values, confidence intervals, and SPSS analysis.' },
  ];

  const alliedSubjects = [
    { title: 'Professional Practice and Ethics', code: 'PPE-501', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Medicolegal principles, patient consent, code of conduct, and professional standards.' },
    { title: 'Orientation to Physiotherapy', code: 'OTP-502', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'History of physiotherapy, scope of clinical practice, and healthcare roles.' },
    { title: 'Allied Therapies', code: 'ALT-503', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Occupational therapy, speech therapy, prosthetics & orthotics integration.' },
    { title: 'Yoga in Diseased Conditions', code: 'YDC-504', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Therapeutic yoga postures, pranayama, and mind-body clinical interventions.' },
    { title: 'Taping', code: 'TAP-505', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Kinesiology taping, rigid strapping, and neuromuscular feedback techniques.' },
    { title: 'Kinesiology and Kinesiotherapy', code: 'KKT-506', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Analysis of human movement, muscle function, and therapeutic movement prescriptions.' },
    { title: 'Basic Life Course – First Aid and CPR', code: 'BLS-507', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'BLS certification, AED usage, choking management, and emergency response.' },
    { title: 'Visceral Manipulation', code: 'VMN-508', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Gentle manual therapy techniques focused on organ mobility and fascial attachments.' },
    { title: 'Exercise Physiology', code: 'EXP-509', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Energetics of physical activity, VO2 max testing, altitude training, and fatigue.' },
    { title: 'Electrophysiology', code: 'ELP-510', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'EMG, nerve conduction velocity (NCV) studies, and biofeedback mechanisms.' },
    { title: 'Physiotherapeutics', code: 'PTP-511', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Advanced therapeutic modalities and integrative rehabilitation approaches.' },
    { title: 'Functional Diagnosis', code: 'FND-512', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Comprehensive functional evaluation, movement system impairment syndromes.' },
    { title: 'Administrative, Management and Marketing', code: 'AMM-513', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Clinic setup, staff management, healthcare billing, digital marketing for clinics.' },
    { title: 'Constitution of India and Legal Aspects of the Physiotherapy Profession', code: 'CLA-514', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Constitutional rights, consumer protection act, medical negligence laws.' },
    { title: 'Principles of Bioengineering', code: 'PBE-515', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Prosthetic design, orthotic fabrication, biomechanical modelling, and ergonomics.' },
    { title: 'Dry Needling', code: 'DRN-516', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Trigger point dry needling, solid filiform needle insertion, and safety protocols.' },
    { title: 'Cupping', code: 'CUP-517', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Myofascial cupping therapy, dynamic & static cupping techniques for soft tissue.' },
    { title: 'Fascia and Myofascial Release', code: 'MFR-518', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Fascial anatomy, cross-friction massage, and direct/indirect MFR techniques.' },
    { title: 'Manual Therapy', code: 'MTH-519', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Maitland, Kaltenborn, Mulligan mobilization, and spinal manipulation techniques.' },
    { title: 'Trigger Point Therapy', code: 'TPT-520', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Ischemic compression, strain-counterstrain, and myofascial trigger point mapping.' },
    { title: 'Nutrition', code: 'NUT-521', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Clinical nutrition, sports dietetics, anti-inflammatory nutrition, and recovery diet.' },
    { title: 'Evidence Based Practice', code: 'EBP-522', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'PICO questions, searching PubMed, appraising clinical evidence for patient care.' },
    { title: 'AI and Research', code: 'AIR-523', yearCode: AcademicYearEnum.OTHER, category: SubjectCategory.SPECIALIZED, desc: 'Machine learning applications in gait analysis, computer vision for joint angle tracking.' },
  ];

  const allSubjectDefs = [...coreSubjects, ...alliedSubjects];

  for (const s of allSubjectDefs) {
    const yearObj = yearMap[s.yearCode];
    const subject = await prisma.subject.upsert({
      where: { code: s.code },
      update: {},
      create: {
        title: s.title,
        code: s.code,
        description: s.desc,
        yearId: yearObj.id,
        category: s.category,
        icon: 'BookOpen',
        coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600',
        isPublished: true,
      },
    });

    // Create 2 sample Chapters & Topics with Notes for each subject
    const chapter1 = await prisma.chapter.create({
      data: {
        subjectId: subject.id,
        title: `Chapter 1: Principles & Fundamentals of ${subject.title}`,
        description: `Introductory overview and theoretical foundation for ${subject.title}.`,
        orderIndex: 1,
      },
    });

    const topic1 = await prisma.topic.create({
      data: {
        chapterId: chapter1.id,
        title: `Topic 1.1: Core Concepts & Assessment in ${subject.title}`,
        contentSummary: `Detailed clinical breakdown of essential principles in ${subject.title}.`,
        orderIndex: 1,
      },
    });

    await prisma.note.create({
      data: {
        topicId: topic1.id,
        title: `${subject.title} - Master Lecture Notes & Study Guide`,
        description: `Comprehensive High-Yield PDF Study Guide prepared by senior faculty for ${subject.title}.`,
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSizeBytes: 2450000,
        readingTimeMinutes: 15,
        isDownloadable: true,
        isPublished: true,
      },
    });
  }

  // 5. Seed Team Members (Faculty Directory)
  console.log('Seeding Team Members...');
  const teamMembers = [
    {
      name: 'Dr. Heena Nawaz PT',
      qualification: 'BPT, MPTH (Musculoskeletal), Certified Manual Therapist',
      designation: 'Founder & Managing Director',
      specialization: 'Musculoskeletal & Orthopedic Physiotherapy',
      biography: 'Dr. Heena Nawaz PT is a visionary edtech founder and lead academician dedicated to strengthening clinical reasoning and practical skills among physiotherapy students nationwide.',
      category: TeamCategory.TEACHING,
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      socialLinks: JSON.stringify({ linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' }),
      orderIndex: 1,
    },
    {
      name: 'Dr. Rajesh Verma PT',
      qualification: 'BPT, MPT (Neuro-Physiotherapy)',
      designation: 'Professor & Head of Neuro Rehabilitation',
      specialization: 'Neurological Conditions & Neuro-rehabilitation',
      biography: 'Over 15 years of neuro-rehabilitation expertise specializing in stroke rehabilitation, spinal cord injuries, and movement disorders.',
      category: TeamCategory.TEACHING,
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
      socialLinks: JSON.stringify({ linkedin: 'https://linkedin.com' }),
      orderIndex: 2,
    },
    {
      name: 'Dr. Ananya Iyer PT',
      qualification: 'BPT, MPT (Cardiopulmonary)',
      designation: 'Associate Professor',
      specialization: 'Cardiovascular & Pulmonary Rehabilitation',
      biography: 'Expert in ICU early mobilization, ventilator weaning, and post-cardiac surgery rehabilitation.',
      category: TeamCategory.SUBJECT_EXPERT,
      photoUrl: 'https://images.unsplash.com/photo-1594824813566-88824278c161?w=400',
      socialLinks: JSON.stringify({ linkedin: 'https://linkedin.com' }),
      orderIndex: 3,
    },
  ];

  for (const tm of teamMembers) {
    await prisma.teamMember.create({ data: tm });
  }

  // 6. Seed LMS Courses
  console.log('Seeding LMS Courses...');
  const course1 = await prisma.course.create({
    data: {
      title: 'Clinical Orthopedic Assessment & Goniometry Masterclass',
      slug: 'clinical-orthopedic-assessment-masterclass',
      description: 'Master step-by-step joint range of motion measurement, special tests, manual muscle testing, and clinical biomechanics reasoning.',
      instructorName: 'Dr. Heena Nawaz PT',
      instructorTitle: 'Founder & Senior Musculoskeletal Specialist',
      thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600',
      academicYear: AcademicYearEnum.SECOND_YEAR,
      category: 'Orthopedic Physiotherapy',
      priceINR: 1499.0,
      totalDurationMinutes: 180,
      isPublished: true,
    },
  });

  const module1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: Upper Limb Joint Assessment',
      description: 'Shoulder, elbow, and wrist special tests and biomechanical evaluation.',
      orderIndex: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Lesson 1.1: Shoulder Impingement & Rotator Cuff Special Tests',
      description: 'Demonstration of Neer test, Hawkins-Kennedy, Empty Can test, and Lift-off test.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      durationMinutes: 25,
      orderIndex: 1,
    },
  });

  // 7. Seed Research Articles & Blog Posts
  console.log('Seeding Research Desk Articles & Blogs...');
  await prisma.researchArticle.create({
    data: {
      title: 'Efficacy of Early Progressive Resistance Exercise Post-ACL Reconstruction: A Systematic Review',
      slug: 'early-progressive-resistance-acl-reconstruction',
      authors: JSON.stringify(['Dr. Heena Nawaz PT', 'Dr. Rajesh Verma PT']),
      abstractText: 'This systematic review evaluates knee stability, muscle quad torque, and return-to-sport rates following early open vs closed kinetic chain exercise protocols.',
      category: 'Sports & Musculoskeletal',
      publishedDate: new Date(),
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      doi: '10.1016/j.pt.2026.04.012',
      tags: 'ACL, Knee Rehab, Sports Physiotherapy, Systematic Review',
    },
  });

  const blogCat = await prisma.blogCategory.create({
    data: { name: 'Clinical Advice', slug: 'clinical-advice' },
  });

  await prisma.blog.create({
    data: {
      title: '5 Common Mistakes BPT Students Make During Clinical Postings (And How to Fix Them)',
      slug: '5-common-mistakes-bpt-students-clinical-postings',
      summary: 'Learn how to transition seamlessly from textbook memorization to confident patient assessment and evidence-based treatment plans.',
      content: `Physiotherapy is much more than memorising subjects and preparing for examinations. It is about understanding the human body, connecting concepts, developing clinical reasoning, building practical skills, and becoming confident healthcare professionals.

Here are 5 core strategies to excel in your hospital clinical postings...`,
      categoryId: blogCat.id,
      authorId: adminUser.id,
      coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      seoTitle: '5 Clinical Posting Mistakes for Physiotherapy Students',
      seoDescription: 'Expert tips for BPT students to master clinical posting, patient examination, and clinical reasoning.',
      isPublished: true,
    },
  });

  // 8. Seed Live Class Schedule
  console.log('Seeding Live Classes...');
  await prisma.liveClass.create({
    data: {
      title: 'Live Case Discussion: Differential Diagnosis of Low Back Pain & Lumbar Radiculopathy',
      instructor: 'Dr. Heena Nawaz PT',
      scheduledAt: new Date(Date.now() + 86400000 * 2), // 2 days from now
      durationMinutes: 90,
      description: 'Interactive clinical case analysis, MRI interpretation, neural mobilization, and live Q&A session for BPT students.',
      category: LiveClassCategory.CLASS,
      zoomMeetingUrl: 'https://zoom.us/j/9876543210',
      zoomMeetingId: '987 654 3210',
      registrationUrl: 'https://physioedvance.com/live-classes/lumbar-radiculopathy',
    },
  });

  // 9. Seed Sample Appointment Request
  console.log('Seeding Sample Appointment Request...');
  await prisma.appointment.create({
    data: {
      name: 'Rohan Deshmukh',
      email: 'rohan@example.com',
      phone: '+91 9988776655',
      preferredDate: '2026-09-05',
      preferredTime: '11:00 AM',
      service: 'Musculoskeletal Consultation',
      message: 'Persistent right shoulder pain during overhead sports activities for 3 months.',
      status: AppointmentStatus.PENDING,
    },
  });

  console.log('✅ PhysioEdvance Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
