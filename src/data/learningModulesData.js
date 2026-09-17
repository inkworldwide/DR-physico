/**
 * PhysioEdvance — Learning Modules Q&A & MCQ Master Data
 * Provides structured MCQs, Large Q&A, and Small Q&A for BPT & MPT syllabus.
 */

const learningModulesData = {
  // 1. Human Anatomy
  'human-anatomy': {
    name: 'Human Anatomy',
    shortCode: 'HA',
    year: 1,
    overview: 'Core structural and functional human anatomy covering osteology, myology, neuroanatomy, and visceral systems.',
    mcqs: [
      {
        id: 1,
        question: 'Which nerve roots form the superior trunk of the Brachial Plexus?',
        options: ['C5 and C6', 'C7 only', 'C8 and T1', 'C4 and C5'],
        correct: 0,
        explanation: 'The anterior rami of C5 and C6 unite to form the Upper (Superior) Trunk of the brachial plexus.',
        difficulty: 'Medium',
        topic: 'Brachial Plexus'
      },
      {
        id: 2,
        question: 'Which muscle of the rotator cuff initiates shoulder abduction (first 0-15 degrees)?',
        options: ['Infraspinatus', 'Supraspinatus', 'Subscapularis', 'Teres Minor'],
        correct: 1,
        explanation: 'Supraspinatus initiates abduction up to 15 degrees, after which the Deltoid muscle becomes the primary abductor.',
        difficulty: 'Easy',
        topic: 'Shoulder Complex'
      },
      {
        id: 3,
        question: 'The femoral artery is located within which boundary of the femoral triangle?',
        options: ['Between sartorius and adductor longus', 'Lateral to the femoral nerve', 'Medial to the femoral vein', 'Posterior to pectineus'],
        correct: 0,
        explanation: 'The femoral triangle is bounded laterally by sartorius and medially by adductor longus, containing the femoral nerve, artery, and vein (from lateral to medial: NAV).',
        difficulty: 'Medium',
        topic: 'Lower Limb'
      },
      {
        id: 4,
        question: 'Which tract is responsible for transmitting pain and temperature sensations to the brain?',
        options: ['Dorsal Column-Medial Lemniscus', 'Lateral Spinothalamic Tract', 'Corticospinal Tract', 'Rubrospinal Tract'],
        correct: 1,
        explanation: 'The lateral spinothalamic tract carries pain and temperature sensations from peripheral receptors to the thalamus.',
        difficulty: 'Hard',
        topic: 'Neuroanatomy'
      },
      {
        id: 5,
        question: 'Winged scapula is typically caused by injury to which nerve?',
        options: ['Axillary nerve', 'Long thoracic nerve', 'Suprascapular nerve', 'Dorsal scapular nerve'],
        correct: 1,
        explanation: 'Injury to the Long Thoracic Nerve of Bell (C5-C7) paralyzes the Serratus Anterior, resulting in medial winging of the scapula.',
        difficulty: 'Medium',
        topic: 'Upper Limb'
      }
    ],
    largeQA: [
      {
        id: 'ha-lq-1',
        title: 'Brachial Plexus: Anatomy, Branches, and Clinical Implications',
        marks: 15,
        question: 'Describe the formation, relations, cords, and terminal branches of the Brachial Plexus in detail. Add a comprehensive note on Erb\'s Palsy and Klumpke\'s Palsy.',
        modelAnswer: {
          introduction: 'The Brachial Plexus is a complex network of nerves supplying the upper limb, derived from anterior rami of spinal nerves C5 to T1.',
          sections: [
            {
              heading: '1. Formation & Subdivisions',
              content: '• Roots: Anterior primary rami of C5, C6, C7, C8, T1.\n• Trunks: Upper (C5+C6), Middle (C7), Lower (C8+T1).\n• Divisions: Each trunk splits into Anterior and Posterior divisions.\n• Cords: Lateral (anterior of upper+middle), Medial (anterior of lower), Posterior (all 3 posterior divisions).'
            },
            {
              heading: '2. Major Terminal Branches',
              content: '• Musculocutaneous Nerve (Lateral Cord, C5-C7): Biceps, Coracobrachialis, Brachialis.\n• Median Nerve (Lateral + Medial Cords, C5-T1): Forearm flexors and thenar muscles.\n• Ulnar Nerve (Medial Cord, C8-T1): FCU, medial FDP, intrinsic hand muscles.\n• Radial Nerve (Posterior Cord, C5-T1): Extensors of elbow, wrist, and digits.\n• Axillary Nerve (Posterior Cord, C5-C6): Deltoid and Teres Minor.'
            },
            {
              heading: '3. Clinical Correlation — Erb\'s vs Klumpke\'s Palsy',
              content: '• Erb-Duchenne Palsy (Upper Trunk C5-C6 Injury):\n  - Mechanism: Excessive traction on neck during delivery or fall on shoulder.\n  - Deformity: Policeman\'s tip / Waiter\'s tip hand (adducted, internally rotated shoulder, extended elbow, pronated forearm).\n• Klumpke\'s Palsy (Lower Trunk C8-T1 Injury):\n  - Mechanism: Upward traction on arm (breech delivery, grabbing tree branch while falling).\n  - Deformity: Claw Hand (intrinsic hand muscle paralysis, Horner\'s syndrome if T1 sympathetic chain affected).'
            }
          ]
        }
      },
      {
        id: 'ha-lq-2',
        title: 'Knee Joint: Structure, Ligaments, Menisci & Biomechanics',
        marks: 10,
        question: 'Describe the functional anatomy of the Knee Joint. Detail the cruciate ligaments, menisci, and the "Screw-Home Mechanism".',
        modelAnswer: {
          introduction: 'The knee joint is a compound synovial hinge/condylar joint between the distal femur, proximal tibia, and patella.',
          sections: [
            {
              heading: '1. Articular Components & Capsule',
              content: '• Medial and lateral tibiofemoral compartments plus patellofemoral articulation.\n• Thin fibrous capsule reinforced by collateral ligaments and extensor retinacula.'
            },
            {
              heading: '2. Cruciate Ligaments & Menisci',
              content: '• Anterior Cruciate Ligament (ACL): Prevents anterior translation of tibia on femur; taut in extension.\n• Posterior Cruciate Ligament (PCL): Stronger ligament; prevents posterior translation of tibia on femur; primary stabilizer against posterior sag.\n• Menisci: C-shaped medial meniscus (attached to MCL, less mobile) and O-shaped lateral meniscus (more mobile, shock absorption and load distribution).'
            },
            {
              heading: '3. Screw-Home Mechanism (Terminal Locking)',
              content: '• In open kinetic chain (OKC) extension: Tibia externally rotates ~5-10° on femur in the last 30° of extension.\n• In closed kinetic chain (CKC) extension: Femur internally rotates on fixed tibia.\n• Unlocking is mediated by Popliteus muscle (internal rotation of tibia / external rotation of femur).'
            }
          ]
        }
      }
    ],
    smallQA: [
      {
        id: 'ha-sq-1',
        title: 'Rotator Cuff Muscles (SITS)',
        marks: 5,
        question: 'Enumerate the rotator cuff muscles, their nerve supply, and primary functional role.',
        answer: '1. Supraspinatus: Suprascapular N. (C5-C6) — Initiates shoulder abduction (0-15°).\n2. Infraspinatus: Suprascapular N. (C5-C6) — External rotation of humeral head.\n3. Teres Minor: Axillary N. (C5-C6) — External rotation & dynamic humeral stabilization.\n4. Subscapularis: Upper & Lower Subscapular N. (C5-C6) — Internal rotation.\n• Collective Function: Dynamic force couple compressing the humeral head into the shallow glenoid fossa during arm elevation.'
      },
      {
        id: 'ha-sq-2',
        title: 'Carpal Tunnel Syndrome (CTS)',
        marks: 5,
        question: 'Define Carpal Tunnel, list its contents, and state clinical signs of Median Nerve compression.',
        answer: '• Boundary: Formed by carpal bones (floor/sides) and Flexor Retinaculum (roof).\n• Contents: 1 Median Nerve + 9 Flexor Tendons (4 FDS, 4 FDP, 1 FPL).\n• Clinical Signs: Thenar atrophy (Ape-hand deformity), paresthesia in thumb, index, middle and lateral half of ring finger. Positive Tinel\'s sign and Phalen\'s test.'
      },
      {
        id: 'ha-sq-3',
        title: 'Femoral Triangle Boundaries and Contents',
        marks: 3,
        question: 'List the boundaries and contents of the Femoral Triangle.',
        answer: '• Superior: Inguinal ligament.\n• Lateral: Medial border of Sartorius.\n• Medial: Medial border of Adductor Longus.\n• Floor: Iliopsoas, Pectineus, Adductor Longus.\n• Contents (Lateral to Medial): Femoral Nerve, Femoral Artery, Femoral Vein, Deep Inguinal Lymph Nodes (NAVL).'
      },
      {
        id: 'ha-sq-4',
        title: 'Differences between Upper and Lower Motor Neuron Lesions',
        marks: 5,
        question: 'Tabulate the cardinal differences between UMN and LMN lesions.',
        answer: '• Tone: Spastic (Clasp-knife) in UMN vs Flaccid / Hypotonia in LMN.\n• Reflexes: Hyperreflexia & Clonus in UMN vs Hyporeflexia / Areflexia in LMN.\n• Plantar Response: Babinski sign positive (extensor) in UMN vs Normal (flexor) or absent in LMN.\n• Muscle Wasting: Disuse atrophy (minimal) in UMN vs Marked Denervation Atrophy in LMN.\n• Fasciculations: Absent in UMN vs Frequently Present in LMN.'
      }
    ]
  },

  // 2. Human Physiology
  'human-physiology': {
    name: 'Human Physiology',
    shortCode: 'HP',
    year: 1,
    overview: 'Cellular physiology, neuromuscular transmission, cardiovascular hemodynamics, respiratory mechanics, and endocrine control.',
    mcqs: [
      {
        id: 1,
        question: 'What is the resting membrane potential of a typical mammalian skeletal muscle fiber?',
        options: ['-70 mV', '-90 mV', '-55 mV', '+30 mV'],
        correct: 1,
        explanation: 'Skeletal muscle fibers have a resting membrane potential around -90 mV, maintained by Na+/K+ ATPase pump and K+ leak channels.',
        difficulty: 'Easy',
        topic: 'Neuromuscular'
      },
      {
        id: 2,
        question: 'During cardiac cycle, when do the atrioventricular (AV) valves close?',
        options: ['At the onset of ventricular systole (isovolumetric contraction)', 'During isovolumetric relaxation', 'At mid-diastole', 'During rapid ejection phase'],
        correct: 0,
        explanation: 'AV valves (Mitral & Tricuspid) close at the beginning of ventricular systole when ventricular pressure exceeds atrial pressure, generating the First Heart Sound (S1).',
        difficulty: 'Medium',
        topic: 'Cardiovascular'
      },
      {
        id: 3,
        question: 'Which chemical agent binds to Troponin C to expose actin binding sites during muscle contraction?',
        options: ['Potassium', 'Calcium', 'Sodium', 'Magnesium'],
        correct: 1,
        explanation: 'Calcium released from the sarcoplasmic reticulum binds to Troponin C, shifting tropomyosin away from actin active sites.',
        difficulty: 'Easy',
        topic: 'Muscle Contraction'
      }
    ],
    largeQA: [
      {
        id: 'hp-lq-1',
        title: 'Neuromuscular Junction: Transmission & Excitation-Contraction Coupling',
        marks: 15,
        question: 'Describe the sequence of events in neuromuscular transmission. Explain sliding filament theory and excitation-contraction coupling.',
        modelAnswer: {
          introduction: 'The neuromuscular junction (NMJ) is the chemical synapse between motor axon terminal and skeletal muscle motor endplate.',
          sections: [
            {
              heading: '1. Synaptic Transmission Steps',
              content: '• Action potential depolarizes presynaptic axon terminal.\n• Voltage-gated Ca2+ channels open; Ca2+ influx triggers ACh vesicle exocytosis.\n• ACh binds to nicotinic ACh receptors on the motor endplate.\n• Na+ influx generates End-Plate Potential (EPP), propagating down T-tubules.'
            },
            {
              heading: '2. Excitation-Contraction Coupling',
              content: '• Depolarization activates DHP receptors in T-tubules, opening Ryanodine receptors on Sarcoplasmic Reticulum (SR).\n• Massive Ca2+ release into sarcoplasm binds Troponin C.\n• Conformational change shifts Tropomyosin, exposing Actin active sites.\n• Myosin head cross-bridge cycling: Power stroke powered by ATP hydrolysis.'
            }
          ]
        }
      }
    ],
    smallQA: [
      {
        id: 'hp-sq-1',
        title: 'Cardiac Output: Definition & Determinants',
        marks: 5,
        question: 'Define Cardiac Output (CO) and list the factors regulating Stroke Volume.',
        answer: '• Definition: Volume of blood pumped by each ventricle per minute (CO = Heart Rate × Stroke Volume; normal ~5.0 L/min at rest).\n• Determinants of Stroke Volume:\n  1. Preload (End-Diastolic Volume / Frank-Starling Law)\n  2. Myocardial Contractility (Inotropic state)\n  3. Afterload (Total Peripheral Resistance)'
      }
    ]
  },

  // 3. Exercise Therapy
  'exercise-therapy': {
    name: 'Exercise Therapy',
    shortCode: 'ExT',
    year: 2,
    overview: 'Principles of therapeutic exercise, ROM techniques, stretching, manual muscle testing, mobilization, and posture re-education.',
    mcqs: [
      {
        id: 1,
        question: 'According to the Oxford Muscle Grading scale, Grade 3 is defined as:',
        options: ['Full ROM against gravity with maximum resistance', 'Full ROM against gravity without resistance', 'Full ROM gravity eliminated', 'Flicker of contraction'],
        correct: 1,
        explanation: 'Grade 3 (Fair) is complete active range of motion against gravity with no added manual resistance.',
        difficulty: 'Easy',
        topic: 'MMT'
      },
      {
        id: 2,
        question: 'Which stretching technique utilizes reciprocal inhibition to increase muscle length?',
        options: ['Contract-Relax (CR)', 'Hold-Relax with Agonist Contraction (HR-AC)', 'Ballistic Stretching', 'Static Passive Stretching'],
        correct: 1,
        explanation: 'Hold-Relax with Agonist Contraction utilizes autogenic inhibition (from GTO) and reciprocal inhibition (from muscle spindles of antagonist).',
        difficulty: 'Medium',
        topic: 'PNF Stretching'
      }
    ],
    largeQA: [
      {
        id: 'ext-lq-1',
        title: 'Therapeutic Principles of Resistance Training and Progressive Overload',
        marks: 10,
        question: 'Explain the principles of Progressive Resisted Exercise (PRE). Compare DeLorme and Oxford protocols in clinical physiotherapy.',
        modelAnswer: {
          introduction: 'Progressive Resisted Exercise is a systematic method of increasing muscular strength, endurance, and power through incremental external loading.',
          sections: [
            {
              heading: '1. DeLorme vs Oxford Technique',
              content: '• 10-Repetition Maximum (10-RM) determination.\n• DeLorme (Ascending):\n  - Set 1: 10 reps @ 50% 10-RM (Warm-up)\n  - Set 2: 10 reps @ 75% 10-RM\n  - Set 3: 10 reps @ 100% 10-RM\n• Oxford (Descending / Fatigue-adapted):\n  - Set 1: 10 reps @ 100% 10-RM\n  - Set 2: 10 reps @ 75% 10-RM\n  - Set 3: 10 reps @ 50% 10-RM'
            }
          ]
        }
      }
    ],
    smallQA: [
      {
        id: 'ext-sq-1',
        title: 'Mobilization Grades (Maitland)',
        marks: 5,
        question: 'Describe the 4 Maitland grades of joint mobilization and their clinical indications.',
        answer: '• Grade I: Small amplitude movement near starting position (for pain relief & neuro-modulation).\n• Grade II: Large amplitude movement within resistance-free range (for pain & muscle spasm).\n• Grade III: Large amplitude movement reaching into tissue resistance (to stretch joint capsule & increase ROM).\n• Grade IV: Small amplitude movement at the anatomical limit of resistance (to gain final range of motion).'
      }
    ]
  },

  // 4. Physiotherapy in Orthopedics
  'physiotherapy-in-adult-and-pediatric-orthopedics-conditions': {
    name: 'Physiotherapy in Orthopedics',
    shortCode: 'PTO',
    year: 3,
    overview: 'Clinical assessment, post-operative rehabilitation, fracture management, joint arthroplasty, and musculoskeletal protocols.',
    mcqs: [
      {
        id: 1,
        question: 'Following Total Knee Arthroplasty (TKA), what is the immediate target active knee flexion range by discharge (post-op day 3-5)?',
        options: ['45-60 degrees', '90 degrees', '135 degrees', '110 degrees'],
        correct: 1,
        explanation: 'A key functional milestone before discharge post-TKA is achieving 90 degrees of knee flexion and full terminal extension (0 degrees).',
        difficulty: 'Medium',
        topic: 'Arthroplasty'
      },
      {
        id: 2,
        question: 'Lachman\'s test is most sensitive and specific for assessing injury to which structure?',
        options: ['Posterior Cruciate Ligament', 'Anterior Cruciate Ligament', 'Medial Meniscus', 'Patellar Tendon'],
        correct: 1,
        explanation: 'Lachman\'s test (performed at 20-30 degrees of knee flexion) is the gold-standard clinical test for ACL integrity.',
        difficulty: 'Easy',
        topic: 'Ligament Injuries'
      }
    ],
    largeQA: [
      {
        id: 'pto-lq-1',
        title: 'Rehabilitation Protocol Post ACL Reconstruction (Bone-Patellar Tendon-Bone Graft)',
        marks: 15,
        question: 'Outline the phase-wise physiotherapy rehabilitation protocol following ACL reconstruction from Day 1 to Return to Sport (6 months).',
        modelAnswer: {
          introduction: 'ACL reconstruction rehabilitation focuses on early graft protection, restoring full extension, quad reactivation, neuromuscular control, and functional sports progression.',
          sections: [
            {
              heading: 'Phase 1: Immediate Post-Op (Weeks 0-2)',
              content: '• Goals: Full passive knee extension (0°), reduce effusion, restore patellar mobility, quad firing.\n• Interventions: Ankle pumps, patellar glides, prone hangs, quad sets, straight leg raises (SLR) without lag in brace, partial weight-bearing with crutches.'
            },
            {
              heading: 'Phase 2: Early Functional (Weeks 2-6)',
              content: '• Goals: Full ROM (0-120°+), normal gait pattern, wean off crutches.\n• Interventions: Stationary cycling, mini-squats (0-45°), step-ups, hamstring curls, balance board proprioception.'
            },
            {
              heading: 'Phase 3: Strengthening & Proprioception (Weeks 6-12)',
              content: '• Goals: Symmetrical strength, advanced balance, light jogging.\n• Interventions: Leg press (0-60°), Romanian deadlifts, single-leg squats, slide board, agility ladder.'
            },
            {
              heading: 'Phase 4: Return to Sport (Months 4-6+)',
              content: '• Goals: Plyometrics, sport-specific drills, passing Y-balance test and limb symmetry index (LSI > 90%).'
            }
          ]
        }
      }
    ],
    smallQA: [
      {
        id: 'pto-sq-1',
        title: 'Frozen Shoulder (Adhesive Capsulitis) Stages',
        marks: 5,
        question: 'Enumerate the 3 clinical stages of Frozen Shoulder and primary PT goals in each stage.',
        answer: '1. Freezing Stage (Pain dominant, 2-9 months): Modalities for pain relief, gentle pain-free pendulum exercises, postural correction.\n2. Frozen Stage (Stiffness dominant, 4-12 months): Joint mobilization (Maitland Gr. III/IV), active-assisted stretching, capsular stretching.\n3. Thawing Stage (Recovery phase, 12-24 months): Progressive strengthening, full functional overhead reaching drills.'
      }
    ]
  }
};

// Helper: Generates robust generic learning module content for any subject slug
function getSubjectLearningData(slug, subjectName, year) {
  if (learningModulesData[slug]) {
    return learningModulesData[slug];
  }

  // Generate high quality dynamic fallback for any subject
  const cleanName = subjectName || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  return {
    name: cleanName,
    shortCode: cleanName.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase(),
    year: year || 1,
    overview: `Curriculum-aligned Learning Module for ${cleanName}, containing university-standard MCQs, 10-15 mark Large Question Answers, and high-yield Small Question Answers for clinical practice and exams.`,
    mcqs: [
      {
        id: 1,
        question: `Which fundamental clinical principle is central to the study and practice of ${cleanName}?`,
        options: [
          'Evidence-based assessment and targeted therapeutic prescription',
          'Symptomatic management without functional evaluation',
          'Immediate aggressive loading in acute inflammatory stages',
          'Standardized treatment without patient-specific adaptation'
        ],
        correct: 0,
        explanation: `In ${cleanName}, modern physiotherapy practice mandates evidence-based clinical reasoning, objective functional outcome measures, and individual patient adaptations.`,
        difficulty: 'Medium',
        topic: 'Core Principles'
      },
      {
        id: 2,
        question: `What is the initial phase objective in managing acute conditions within ${cleanName}?`,
        options: [
          'Pain modulation, protection of healing tissue, and gentle mobility',
          'High-intensity eccentric strength conditioning',
          'Full joint range mobilization against high resistance',
          'Prolonged immobilization without circulatory activation'
        ],
        correct: 0,
        explanation: 'Acute phase protocols prioritize pain management, minimizing secondary complications, protecting repairing structures, and gentle circulatory activation.',
        difficulty: 'Easy',
        topic: 'Clinical Protocol'
      },
      {
        id: 3,
        question: `Which diagnostic evaluation method provides objective baseline data in ${cleanName}?`,
        options: [
          'Standardized functional outcome measures and validated clinical grading scales',
          'Subjective patient self-reporting only',
          'Visual inspection without functional movement analysis',
          'Randomized manual testing without anatomical landmarks'
        ],
        correct: 0,
        explanation: 'Standardized outcome measures (ROM goniometry, MMT, functional scores) ensure repeatable, quantifiable tracking of rehabilitation progress.',
        difficulty: 'Hard',
        topic: 'Assessment & Diagnosis'
      }
    ],
    largeQA: [
      {
        id: `${slug}-lq-1`,
        title: `Comprehensive Clinical Evaluation & Therapeutic Management in ${cleanName}`,
        marks: 15,
        question: `Describe the detailed clinical evaluation, differential diagnosis, and evidence-based physiotherapy intervention strategy for major clinical conditions in ${cleanName}.`,
        modelAnswer: {
          introduction: `Clinical mastery in ${cleanName} requires systematic patient history, biomechanical examination, objective testing, and phase-wise rehabilitation planning.`,
          sections: [
            {
              heading: '1. Subjective & Objective Assessment',
              content: '• Patient History: Mechanism of onset, symptom aggravating/relieving factors, 24-hour symptom cycle, functional limitations.\n• Physical Examination: Postural analysis, active & passive ROM, neurological screen (dermatomes, myotomes, reflexes), special orthopedic/clinical tests.'
            },
            {
              heading: '2. Problem Identification & Goal Setting',
              content: '• Short-term Goals: Pain reduction (VAS), control of swelling, restoration of fundamental movement planes.\n• Long-term Goals: Full functional recovery, muscular balance, proprioceptive endurance, return to occupational and sports activities.'
            },
            {
              heading: '3. Phase-Wise Physiotherapy Intervention',
              content: '• Acute Phase: Cryotherapy/thermal agents, gentle active-assisted ROM, isometric stabilization.\n• Subacute Phase: Progressive resistive exercise (PRE), manual therapy, joint mobilizations, neuromuscular re-education.\n• Chronic/Maintenance Phase: High-load functional patterning, agility, endurance conditioning, ergonomics, and home program.'
            }
          ]
        }
      }
    ],
    smallQA: [
      {
        id: `${slug}-sq-1`,
        title: `Core Clinical Indicators in ${cleanName}`,
        marks: 5,
        question: `Enumerate the key diagnostic criteria, indications, and contraindications in ${cleanName}.`,
        answer: '• Indications: Functional movement deficits, musculoskeletal or neuro-muscular dysfunction, post-surgical stiffness, chronic pain syndromes.\n• Contraindications: Unstable fractures, active deep vein thrombosis (DVT), acute undiagnosed infectious arthritis, severe malignancy with bone metastasis.\n• Key Clinical Precautions: Continuous monitoring of vital signs, respect of pain thresholds, progressive graded loading.'
      },
      {
        id: `${slug}-sq-2`,
        title: `Differential Diagnosis & Outcome Measures`,
        marks: 3,
        question: `List the validated clinical outcome measures used to track progress in ${cleanName}.`,
        answer: '1. Visual Analog Scale (VAS) / Numeric Pain Rating Scale (NPRS)\n2. Goniometric Range of Motion (Active & Passive)\n3. Manual Muscle Testing (MMT / Medical Research Council scale)\n4. Disease-specific validated functional scales (e.g. DASH, ODI, LEFS, Berg Balance Scale).'
      }
    ]
  };
}

module.exports = {
  learningModulesData,
  getSubjectLearningData
};
