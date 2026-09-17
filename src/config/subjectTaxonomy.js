/**
 * PhysioEdvance — Canonical Subject Taxonomy
 * Sourced directly from the INK Worldwide proposal (Section 4.3, "Scope of Work for Website").
 * This is the single source of truth for year-wise subjects across the platform —
 * used by the seed script, the subjects subdomain routes, and the digital library.
 */

const YEAR_SUBJECTS = {
  1: [
    'Human Anatomy',
    'Human Physiology',
    'Biochemistry',
    'Fundamentals of Exercise Modalities',
    'Fundamentals of Electro Physical Agents',
    'Psychology & Sociology',
    'Fundamentals of Healthcare Delivery System in India',
    'English [NUES]',
    'Information Technology [NUES]',
    'Clinic Orientation'
  ],
  2: [
    'Pathology & Microbiology',
    'Pharmacology',
    'Public Health & Health Promotion',
    'Emergency Care and Life Support Skills',
    'Exercise Therapy',
    'Electrotherapy',
    'Biomechanics & Kinesiology',
    'Yoga and Systems of Medicine',
    'Clinical Observation'
  ],
  3: [
    'General Medicine and Pediatrics',
    'General Surgery',
    'Orthopedics',
    'Physiotherapy in Adult and Pediatric Medical and Surgical Conditions',
    'Physiotherapy in Adult and Pediatric Orthopedics Conditions',
    'Physical & Functional Diagnosis and Prescription',
    'Research Methodology, Biostatistics and Evidence Based Practice',
    'Clinical Education'
  ],
  4: [
    'Neurology, Psychiatry and Neurosurgery',
    'Physiotherapy in Adult and Pediatric Neurological and Neurosurgical Conditions',
    'Cardiothoracic Diseases and Surgeries',
    'Physiotherapy in Adult and Pediatric Cardiothoracic Conditions and Surgical Conditions',
    'Sports Physiotherapy & Exercise Prescription',
    'PT Ethics, Medico Legal Aspects, Management & Administration',
    'Community Physiotherapy & Rehabilitation',
    'Project Work Orientation [NUES]',
    'Clinical Rotation'
  ]
};

const SUBJECT_ABBREVIATIONS = {
  'Human Anatomy': 'HA',
  'Human Physiology': 'HP',
  'Biochemistry': 'BC',
  'Fundamentals of Exercise Modalities': 'FoEM',
  'Fundamentals of Electro Physical Agents': 'FoEA',
  'Psychology & Sociology': 'PS',
  'Fundamentals of Healthcare Delivery System in India': 'FoHS',
  'English [NUES]': 'EG',
  'Information Technology [NUES]': 'IT',
  'Clinic Orientation': 'COr',
  'Pathology & Microbiology': 'PM',
  'Pharmacology': 'PC',
  'Public Health & Health Promotion': 'PH',
  'Emergency Care and Life Support Skills': 'ECLS',
  'Exercise Therapy': 'ExT',
  'Electrotherapy': 'ET',
  'Biomechanics & Kinesiology': 'BK',
  'Yoga and Systems of Medicine': 'YoG',
  'Clinical Observation': 'COb',
  'General Medicine and Pediatrics': 'GMP',
  'General Surgery': 'GS',
  'Orthopedics': 'OR',
  'Physiotherapy in Adult and Pediatric Medical and Surgical Conditions': 'PTMS',
  'Physiotherapy in Adult and Pediatric Orthopedics Conditions': 'PTO',
  'Physical & Functional Diagnosis and Prescription': 'PFDP',
  'Research Methodology, Biostatistics and Evidence Based Practice': 'RMB',
  'Clinical Education': 'CEd',
  'Neurology, Psychiatry and Neurosurgery': 'NPNS',
  'Physiotherapy in Adult and Pediatric Neurological and Neurosurgical Conditions': 'PTN',
  'Cardiothoracic Diseases and Surgeries': 'CTD',
  'Physiotherapy in Adult and Pediatric Cardiothoracic Conditions and Surgical Conditions': 'PTCT',
  'Sports Physiotherapy & Exercise Prescription': 'PTS',
  'PT Ethics, Medico Legal Aspects, Management & Administration': 'PTLM',
  'Community Physiotherapy & Rehabilitation': 'CPTR',
  'Project Work Orientation [NUES]': 'PW',
  'Clinical Rotation': 'CR'
};

// "Other Subjects" — cross-cutting / elective subjects not tied to a specific year
const OTHER_SUBJECTS = [
  'Professional Practice and Ethics',
  'Orientation to Physiotherapy',
  'Allied Therapies',
  'Yoga in Diseased Conditions',
  'Taping',
  'Kinesiology and Kinesiotherapy',
  'Basic Life Course (First Aid and CPR)',
  'Visceral Manipulation',
  'Exercise Physiology',
  'Electrophysiology',
  'Physiotherapeutics',
  'Functional Diagnosis',
  'Administrative, Management, and Marketing',
  'Constitution of India and Legal Aspects of the Physiotherapy Profession',
  'Principles of Bioengineering',
  'Dry Needling',
  'Cupping',
  'Fascia and Myofascial Release',
  'Manual Therapy',
  'Trigger Point Therapy',
  'Nutrition',
  'Evidence Based Practice',
  'AI and Research',
  'Post-Surgery Physiotherapy',
  'Geriatric / Elderly Care Physiotherapy',
  'Chronic Pain Management',
  'Orthopedic / Sports Injuries',
  'Pediatric Physiotherapy',
  'Specialty Care'
];

// Physiotherapy service/specialty areas shown on the homepage (Section 4.3)
const PHYSIOTHERAPY_SPECIALTIES = [
  { 
    name: 'Post-Surgery Physiotherapy', 
    icon: 'ri-hospital-fill',
    badge: 'Surgical Rehab',
    theme: 'primary',
    items: ['Total Knee / Hip Replacement', 'Shoulder / Hip / Knee Surgeries', 'Ankle / Elbow Fractures', 'Cervical / Spine Surgery'] 
  },
  { 
    name: 'Geriatric & Elderly Care', 
    icon: 'ri-user-heart-fill',
    badge: 'Senior Wellness',
    theme: 'success',
    items: ['Arthritis & Joint Care', 'Back & Muscular Pain', 'Gait & Balance Disorders', 'Urinary Incontinence Care'] 
  },
  { 
    name: 'Chronic Pain Management', 
    icon: 'ri-health-book-fill',
    badge: 'Pain Relief',
    theme: 'warning',
    items: ['Degenerative Disc & Sciatic Pain', 'Neck & Shoulder Stiffness', 'Migraines & Tension Headaches', 'Cervical Spondylosis'] 
  },
  { 
    name: 'Orthopedic & Sports Injuries', 
    icon: 'ri-body-scan-fill',
    badge: 'Sports Science',
    theme: 'danger',
    items: ['Sprains, Strains & Ligament Tears', 'Back, Neck & Joint Pain', 'Muscle Imbalance & Performance', 'Post-Traumatic Rehabilitation'] 
  },
  { 
    name: 'Pediatric Physiotherapy', 
    icon: 'ri-bear-smile-fill',
    badge: 'Child Care',
    theme: 'info',
    items: ['Cerebral Palsy Therapy', 'Developmental Delay Rehab', 'Spina Bifida & Torticollis', 'Pediatric Respiratory Rehab'] 
  },
  { 
    name: 'Specialty & Neurological Care', 
    icon: 'ri-mental-health-fill',
    badge: 'Specialized Clinical',
    theme: 'purple',
    items: ['Post-Stroke Neuro Rehab', 'Neurological Disorder Management', 'Musculoskeletal Strengthening', "Women's Health Physiotherapy"] 
  }
];

// Hero slider categories (Section 4.3 — "Images / Slider of Different types of Physio therapies")
const THERAPY_TYPES = [
  'Musculoskeletal Physiotherapy', 'Neurological Physiotherapy', 'Cardiopulmonary Physiotherapy',
  'Pediatric Physiotherapy', 'Geriatric Physiotherapy', 'Sports Physiotherapy',
  "Women's Health Physiotherapy", 'Vestibular Physiotherapy', 'Orthopedic Physiotherapy',
  'Occupational Physiotherapy', 'Pain Management Physiotherapy'
];

function slugify(text) {
  return text.toString().toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function allYearSubjectsFlat() {
  const flat = [];
  for (const [year, subjects] of Object.entries(YEAR_SUBJECTS)) {
    subjects.forEach(name => flat.push({ year: parseInt(year), name, slug: slugify(name) }));
  }
  return flat;
}

module.exports = {
  YEAR_SUBJECTS,
  SUBJECT_ABBREVIATIONS,
  OTHER_SUBJECTS,
  PHYSIOTHERAPY_SPECIALTIES,
  THERAPY_TYPES,
  slugify,
  allYearSubjectsFlat
};
