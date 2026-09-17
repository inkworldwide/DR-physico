module.exports = {
  // =========================================================================
  // 1. ANATOMY (Year 1 Foundation)
  // =========================================================================
  'anatomy': {
    intro: {
      title: 'Introduction to Functional & Human Anatomy',
      description: 'Comprehensive study of human osteology, arthrology, myology, neurovascular structures, and regional anatomy for BPT & MPT physiotherapy students.',
      demoVideoUrl: '/videos/stream/anatomy-intro'
    },

    regions: [
      { id: 'r1', name: 'Upper Limb & Shoulder Girdle', desc: 'Bony landmarks, clavicle, scapula, humerus, rotator cuff, axilla & brachial plexus.', icon: 'ri-body-scan-line' },
      { id: 'r2', name: 'Lower Limb & Pelvic Girdle', desc: 'Hip joint, femoral triangle, knee biomechanics, leg compartments & foot arch system.', icon: 'ri-walk-line' },
      { id: 'r3', name: 'Spine & Vertebral Column', desc: 'Cervical, thoracic, lumbar vertebrae, intervertebral discs & spinal cord nerve roots.', icon: 'ri-men-line' },
      { id: 'r4', name: 'Head, Neck & Brainstem', desc: 'Skull osteology, cranial nerve nuclei, cerebral hemispheres, brainstem & cerebellum.', icon: 'ri-brain-line' },
      { id: 'r5', name: 'Thorax & Visceral Organs', desc: 'Thoracic cage, intercostal nerves, lungs, mediastinum, heart & respiratory mechanics.', icon: 'ri-heart-pulse-line' }
    ],

    relatedSubjects: [
      { name: 'Physiology', slug: 'physiology', year: 1 },
      { name: 'Biomechanics', slug: 'biomechanics', year: 1 },
      { name: 'Exercise Therapy', slug: 'exercise-therapy', year: 2 },
      { name: 'Physio in Orthopedics', slug: 'physiotherapy-in-orthopedics', year: 3 },
      { name: 'Neurology', slug: 'neurology-neuromedicine-and-neurosurgery', year: 4 }
    ],

    syllabusUnits: [
      {
        unit: 'Unit 1',
        title: 'General Anatomy & Osteology Fundamentals',
        description: 'Introduction to anatomical terminology, planes, bone histology, classification of joints, and cartilage types.',
        objectives: ['Define anatomical positions & planes', 'Classify synovial joints & axis of motion', 'Understand bone blood supply & ossification'],
        topics: ['Anatomical Planes & Axis', 'Bone Classification & Ossification', 'Synovial Joint Classification', 'Muscle Types & Contraction Biomechanics', 'Fascia & Ligament Structure']
      },
      {
        unit: 'Unit 2',
        title: 'Upper Limb Anatomy & Brachial Plexus',
        description: 'Pectoral girdle, shoulder complex, brachial plexus, arm, forearm, and hand intrinsic muscles.',
        objectives: ['Map brachial plexus roots (C5-T1)', 'Identify rotator cuff musculature (SITS)', 'Analyze median, ulnar, and radial nerve lesions'],
        topics: ['Brachial Plexus C5-T1 Organization', 'Rotator Cuff & Shoulder Biomechanics', 'Axilla & Axillary Artery Branches', 'Cubital Fossa & Quadrangular Space', 'Wrist Carpal Tunnel & Intrinsic Hand']
      },
      {
        unit: 'Unit 3',
        title: 'Lower Limb Anatomy & Joint Biomechanics',
        description: 'Bones, joints, muscles, and neurovascular supply of the thigh, leg, knee joint, and ankle/foot system.',
        objectives: ['Understand femur & tibia osteology', 'Master ACL/PCL knee joint biomechanics', 'Trace femoral, obturator & sciatic nerve pathways'],
        topics: ['Hip Joint & Acetabular Labrum', 'Femoral Triangle & Adductor Canal', 'Knee Joint Cruciate & Collateral Ligaments', 'Anterior & Posterior Leg Compartments', 'Foot Arches & Plantar Fascia']
      },
      {
        unit: 'Unit 4',
        title: 'Neuroanatomy & Central Nervous System',
        description: 'Brainstem, cerebral cortex, spinal cord tracts, ventricular system, and cranial nerve nuclei.',
        objectives: ['Trace Corticospinal motor tract pathway', 'Map Posterior Column-Medial Lemniscus sensory route', 'Identify cranial nerves I to XII innervation'],
        topics: ['Cerebral Cortex & Functional Areas', 'Corticospinal Motor Pathway', 'Dorsal Column & Spinothalamic Pathways', 'Brainstem (Midbrain, Pons, Medulla)', 'Ventricular System & CSF Flow']
      },
      {
        unit: 'Unit 5',
        title: 'Thorax, Abdomen & Diaphragm Mechanics',
        description: 'Thoracic cage, intercostal nerves, diaphragm innervation, abdominal wall muscles, and respiratory mechanics.',
        objectives: ['Identify intercostal space neurovascular bundle', 'Understand diaphragm innervation (Phrenic Nerve C3, C4, C5)', 'Palpate thoracic bony landmarks'],
        topics: ['Thoracic Wall & Intercostal Muscles', 'Diaphragm Anatomy & Phrenic Nerve', 'Anterior Abdominal Wall Musculature', 'Surface Anatomy & Palpation Marks']
      },
      {
        unit: 'Unit 6',
        title: 'Surface Anatomy, Palpation & Applied Clinical Anatomy',
        description: 'Clinical surface marking, bony palpation for physical therapy assessment, nerve compression sites, and trigger points.',
        objectives: ['Palpate Greater Trochanter, ASIS, PSIS', 'Mark Sciatic & Radial nerve anatomical routes', 'Identify tendon palpation sites'],
        topics: ['Bony Prominence Palpation Protocols', 'Peripheral Nerve Compression Tunnel Sites', 'Surface Marking of Major Vessels', 'Clinical Trigger Point Mapping']
      }
    ],

    videos: [
      {
        id: 'v1',
        title: 'Introduction to Central Nervous System & Dissection',
        duration: '18 mins',
        instructor: 'UBC Neuroanatomy Faculty / Dr. Heena Nawaz',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/anatomy-intro'
      },
      {
        id: 'v2',
        title: 'Knee Joint Ligamentous Anatomy & Biomechanics',
        duration: '14 mins',
        instructor: 'Dr. Heena Nawaz PT',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/anatomy-knee'
      },
      {
        id: 'v3',
        title: 'Brachial Plexus C5-T1 Masterclass',
        duration: '18 mins',
        instructor: 'Dr. Priya Sharma PT',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/anatomy-brachial'
      },
      {
        id: 'v4',
        title: 'Rotator Cuff Muscles & Shoulder Impingement',
        duration: '12 mins',
        instructor: 'Dr. Arjun Mehta',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/anatomy-rotator'
      }
    ],

    hotspots: [
      { id: 1, title: 'Femur Head & Neck', x: 50, y: 22, description: 'Articulates with acetabulum forming hip joint. Common fracture site in geriatric falls (Femoral Neck Fracture).', nerveSupply: 'Obturator & Femoral Nerve branches', action: 'Weight bearing & Hip Range of Motion' },
      { id: 2, title: 'Quadriceps Femoris Tendon', x: 50, y: 55, description: 'Inserts into patella superior pole. Powerful extensor of the knee joint.', nerveSupply: 'Femoral Nerve (L2, L3, L4)', action: 'Knee Extension & Patellar Tracking' },
      { id: 3, title: 'Anterior Cruciate Ligament (ACL)', x: 48, y: 68, description: 'Prevents anterior translation of tibia on femur. Primary stabilizer assessed via Anterior Drawer Test.', nerveSupply: 'Tibial Nerve articular branches', action: 'Rotational & Anterior Knee Stability' },
      { id: 4, title: 'Patellar Ligament', x: 50, y: 78, description: 'Continuation of quadriceps tendon inserting into tibial tuberosity. Site of Patellar Reflex (L3-L4).', nerveSupply: 'Femoral Nerve (L3-L4)', action: 'Transmits Quad Force to Tibia' },
      { id: 5, title: 'Tibial Tuberosity', x: 52, y: 88, description: 'Bony elevation on anterior proximal tibia. Site of Osgood-Schlatter disease in young athletes.', nerveSupply: 'Periosteal sensory fibers', action: 'Distal Quad Insertion Landmark' }
    ],

    threeDModel: {
      title: 'Interactive 3D Knee Joint & Musculoskeletal Model',
      description: 'Rotate 360°, inspect distal femur, patella, tibia, fibula, ACL, PCL, MCL, and LCL ligaments in real-time 3D.',
      modelUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0'
    },

    crossSections: [
      {
        view: 'Coronal View',
        title: 'Proximal Tibiofemoral Coronal Slice',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80',
        labels: ['Femoral Condyle', 'Medial Meniscus', 'Lateral Meniscus', 'Tibial Plateau', 'Joint Space']
      },
      {
        view: 'Sagittal View',
        title: 'Mid-Sagittal Knee Joint & Ligamentous Slices',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80',
        labels: ['Patellar Tendon', 'Anterior Cruciate Ligament', 'Posterior Cruciate Ligament', 'Hoffa Fat Pad']
      },
      {
        view: 'Axial Transverse',
        title: 'Mid-Thigh Transverse Cross-Section',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80',
        labels: ['Rectus Femoris', 'Vastus Medialis', 'Vastus Lateralis', 'Femoral Artery & Vein']
      }
    ],

    mriScans: [
      {
        title: 'Normal Knee MRI vs. ACL Tear Comparison',
        anatomyDesc: 'Normal ACL appears as continuous dark low-signal band extending from posterior femur to anterior tibia.',
        mriDesc: 'Tear demonstrates disruption of ligament fiber continuity with joint effusion and bone marrow edema.',
        normalImg: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80',
        pathologyImg: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=80'
      }
    ],

    clinicalCases: [
      {
        title: 'Case 1: Anterior Cruciate Ligament (ACL) Injury & Rehab Protocol',
        history: '22-year-old football player presented with sudden knee pop, acute swelling, and inability to bear weight after non-contact pivot maneuver.',
        findings: ['Positive Lachman Test (>6mm translation)', 'Positive Anterior Drawer Test', 'Grade 3 ACL Rupture on High-Field T2 MRI'],
        rehabPlan: 'Phase 1: Quadriceps activation & swelling control -> Phase 2: Closed kinetic chain strengthening -> Phase 3: Proprioception & sports return.'
      },
      {
        title: 'Case 2: Carpal Tunnel Syndrome & Median Nerve Entrapment',
        history: '45-year-old computer programmer reporting nocturnal hand paresthesia, thumb weakness, and pain in thumb, index, and middle fingers.',
        findings: ['Positive Tinel Sign at Wrist', 'Positive Phalen Maneuver (<30 sec)', 'Thenar Eminence Muscle Atrophy'],
        rehabPlan: 'Wrist neutral splinting, tendon glide exercises, median nerve mobilization, and ergonomic desktop adjustment.'
      }
    ],

    quizzes: [
      {
        id: 1,
        question: 'Which nerve innervates the anterior compartment thigh muscles (Quadriceps Femoris)?',
        options: ['Sciatic Nerve', 'Obturator Nerve', 'Femoral Nerve', 'Tibial Nerve'],
        answer: 2,
        explanation: 'The Femoral Nerve (L2-L4) supplies all anterior compartment thigh muscles including Rectus Femoris and Vastus muscles.'
      },
      {
        id: 2,
        question: 'The Anterior Cruciate Ligament (ACL) primarily prevents which knee movement?',
        options: ['Posterior translation of tibia on femur', 'Anterior translation of tibia on femur', 'Valgus stress only', 'Hyperextension of hip'],
        answer: 1,
        explanation: 'The ACL prevents anterior translation of the tibia relative to the femur and resists internal rotation.'
      },
      {
        id: 3,
        question: 'Which spinal nerve roots contribute to the Brachial Plexus?',
        options: ['C1 to C4', 'C5 to T1', 'T2 to L1', 'L2 to S1'],
        answer: 1,
        explanation: 'The Brachial Plexus is formed by the ventral rami of spinal nerves C5, C6, C7, C8, and T1.'
      }
    ],

    glossary: [
      { muscle: 'Rectus Femoris', origin: 'Anterior Inferior Iliac Spine (AIIS)', insertion: 'Patella & Tibial Tuberosity', nerve: 'Femoral Nerve (L2-L4)', action: 'Knee extension & Hip flexion' },
      { muscle: 'Biceps Femoris', origin: 'Ischial Tuberosity (long head)', insertion: 'Head of Fibula', nerve: 'Sciatic Nerve (L5-S2)', action: 'Knee flexion & Hip extension' },
      { muscle: 'Tibialis Anterior', origin: 'Lateral Condyle of Tibia', insertion: 'Medial Cuneiform & 1st Metatarsal', nerve: 'Deep Peroneal Nerve (L4-L5)', action: 'Ankle dorsiflexion & inversion' },
      { muscle: 'Gastrocnemius', origin: 'Femoral Condyles (Medial/Lateral)', insertion: 'Calcaneus via Achilles Tendon', nerve: 'Tibial Nerve (S1-S2)', action: 'Ankle plantarflexion & Knee flexion' }
    ]
  },

  // =========================================================================
  // 2. NEUROLOGY (Year 4 Specialisation)
  // =========================================================================
  'neurology-neuromedicine-and-neurosurgery': {
    intro: {
      title: 'Introduction to Functional Neuroanatomy & Clinical Neurology',
      description: 'Comprehensive study of central nervous system pathways, stroke rehabilitation, motor control, basal ganglia disorders, and clinical neurological evaluation.',
      demoVideoUrl: '/videos/stream/neurology-intro'
    },

    regions: [
      { id: 'nr1', name: 'Cerebral Hemispheres & Cortex', desc: 'Frontal motor cortex, parietal somatosensory, temporal & occipital functional areas.', icon: 'ri-brain-line' },
      { id: 'nr2', name: 'Basal Ganglia & Subcortex', desc: 'Caudate nucleus, putamen, globus pallidus, substantia nigra & dopamine pathways.', icon: 'ri-node-tree' },
      { id: 'nr3', name: 'Brainstem (Midbrain, Pons, Medulla)', desc: 'Cranial nerve nuclei III-XII, reticular formation, medullary pyramids & vital centers.', icon: 'ri-pulse-line' },
      { id: 'nr4', name: 'Cerebellum & Motor Control', desc: 'Cerebellar hemispheres, vermis, spinocerebellar pathways & ataxia evaluation.', icon: 'ri-shield-star-line' },
      { id: 'nr5', name: 'Spinal Cord & Peripheral Nerves', desc: 'Corticospinal motor tract, dorsal column sensory route & ASIA spinal injury dermatomes.', icon: 'ri-men-line' }
    ],

    relatedSubjects: [
      { name: 'Anatomy', slug: 'anatomy', year: 1 },
      { name: 'Physiology', slug: 'physiology', year: 1 },
      { name: 'Physio in Neuro', slug: 'physiotherapy-in-neurological-conditions', year: 4 },
      { name: 'Pediatrics', slug: 'pediatrics-and-pediatric-neurology', year: 4 }
    ],

    syllabusUnits: [
      {
        unit: 'Unit 1',
        title: 'Upper Motor Neuron (UMN) vs Lower Motor Neuron (LMN) Lesions',
        description: 'Pathophysiology of corticospinal tract lesions vs peripheral nerve & anterior horn cell diseases.',
        objectives: ['Distinguish spasticity vs flaccidity', 'Understand Babinski sign mechanism', 'Evaluate deep tendon reflexes (DTRs)'],
        topics: ['Corticospinal Tract Anatomy', 'Spastic Hypertonia Mechanism', 'Hyperreflexia & Clonus', 'Muscle Atrophy & Fasciculations']
      },
      {
        unit: 'Unit 2',
        title: 'Stroke Rehabilitation & Middle Cerebral Artery (MCA) Syndrome',
        description: 'Ischemic & hemorrhagic stroke, vascular territories, MCA syndrome clinical presentation, and motor recovery.',
        objectives: ['Identify MCA motor cortex territory', 'Assess contralateral hemiparesis & sensory loss', 'Apply Brunnstrom Stages of Recovery'],
        topics: ['Cerebral Circulation & Circle of Willis', 'MCA Superior & Inferior Division Syndromes', 'Constraint-Induced Movement Therapy (CIMT)', 'Neuroplasticity & Motor Learning']
      },
      {
        unit: 'Unit 3',
        title: 'Basal Ganglia & Parkinson’s Disease Physiotherapy',
        description: 'Extrapyramidal system pathways, nigrostriatal dopamine depletion, resting tremor, rigidity, and gait retraining.',
        objectives: ['Understand Direct & Indirect Basal Ganglia loops', 'Recognize Lead-pipe & Cogwheel rigidity', 'Design Parkinsonian Cueing Gait Protocols'],
        topics: ['Basal Ganglia Circuitry', 'Cardinal Symptoms of Parkinsonism (TRAP)', 'Freezing of Gait (FOG) Management', 'Auditory & Visual Rhythmic Cueing']
      },
      {
        unit: 'Unit 4',
        title: 'Spinal Cord Injury (SCI) & ASIA Impairment Scale',
        description: 'Complete vs incomplete spinal cord syndromes, dermatome/myotome assessment, and functional independence.',
        objectives: ['Perform ASIA sensory & motor scoring', 'Manage Autonomic Dysreflexia (T6 and above)', 'Execute transfer & wheelchair skills'],
        topics: ['ASIA Neurological Examination Standard', 'Brown-Séquard & Central Cord Syndromes', 'Autonomic Dysreflexia Emergency Protocol', 'Locomotor Training & Body Weight Support']
      },
      {
        unit: 'Unit 5',
        title: 'Cerebellar Ataxia & Balance Rehabilitation',
        description: 'Cerebellar functional zones, dysmetria, dysdiadochokinesia, intention tremor, and Frenkel exercise protocols.',
        objectives: ['Distinguish cerebellar vs sensory ataxia', 'Perform Romberg & Finger-to-Nose tests', 'Prescribe Frenkel coordination exercises'],
        topics: ['Spinocerebellum & Vestibulocerebellum', 'Clinical Manifestations of Cerebellar Disease', 'Frenkel Exercises & Balance Training', 'Vestibular Rehabilitation Therapy (VRT)']
      },
      {
        unit: 'Unit 6',
        title: 'Peripheral Neuropathies & Guillain-Barré Syndrome (GBS)',
        description: 'Polyneuropathies, demyelinating GBS, radiculopathies, nerve conduction studies, and acute respiratory monitoring.',
        objectives: ['Understand ascending flaccid paralysis in GBS', 'Evaluate nerve conduction velocity (NCV)', 'Implement safe muscle re-education'],
        topics: ['GBS Acute Autoimmune Pathophysiology', 'Respiratory Vital Capacity Monitoring', 'Peripheral Nerve Regeneration Mechanics', 'Splinting & Contracture Prevention']
      }
    ],

    videos: [
      {
        id: 'nv1',
        title: 'Introduction to Central Nervous System & Brain Dissection',
        duration: '18 mins',
        instructor: 'UBC Neuroanatomy / Dr. Heena Nawaz PT',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/neurology-intro'
      },
      {
        id: 'nv2',
        title: 'Introduction to Spinal Cord Pathways & Tracts',
        duration: '16 mins',
        instructor: 'UBC Neuroanatomy / Dr. Heena Nawaz PT',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/neurology-spinal'
      },
      {
        id: 'nv3',
        title: 'Stroke MCA Infarct Motor Recovery & Gait Retraining',
        duration: '22 mins',
        instructor: 'Dr. Priya Sharma PT',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/neurology-stroke'
      },
      {
        id: 'nv4',
        title: 'Parkinsonian Gait & Visual Cueing Strategies',
        duration: '15 mins',
        instructor: 'Dr. Arjun Mehta',
        type: 'Internal Video Lecture',
        embedUrl: '/videos/stream/neurology-parkinsons'
      }
    ],

    hotspots: [
      { id: 1, title: 'Precentral Gyrus (Primary Motor Cortex)', x: 45, y: 30, description: 'Brodmann Area 4. Initiates voluntary motor movements. Somatotopic Motor Homunculus arrangement.', nerveSupply: 'Middle & Anterior Cerebral Arteries', action: 'Voluntary Motor Control' },
      { id: 2, title: 'Internal Capsule (Posterior Limb)', x: 50, y: 48, description: 'Densely packed corticospinal fibers. Lacunar infarcts here cause pure motor hemiparesis.', nerveSupply: 'Lenticulostriate Arteries', action: 'Motor Fiber Conduction Pathway' },
      { id: 3, title: 'Brainstem Pyramidal Decussation', x: 52, y: 72, description: '85-90% of corticospinal fibers cross to opposite side in caudal medulla.', nerveSupply: 'Vertebral & Anterior Spinal Arteries', action: 'Contralateral Motor Innervation' },
      { id: 4, title: 'Cerebellum (Lateral Hemispheres)', x: 68, y: 75, description: 'Coordinates voluntary movement, timing, equilibrium, and motor learning. Dysfunction causes ataxia.', nerveSupply: 'SCA, AICA, & PICA arteries', action: 'Coordination & Balance Control' }
    ],

    threeDModel: {
      title: 'Interactive 3D Functional Brain & Neuroanatomy Model',
      description: 'Rotate 360°, inspect frontal lobe, parietal lobe, brainstem, cerebellum, and motor cortex functional regions.',
      modelUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0'
    },

    crossSections: [
      {
        view: 'Coronal Brain Slice',
        title: 'Coronal Brain Slice showing Basal Ganglia & Thalamus',
        image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
        labels: ['Caudate Nucleus', 'Putamen', 'Globus Pallidus', 'Thalamus', 'Internal Capsule']
      },
      {
        view: 'Axial MRI Transverse',
        title: 'Axial Brain Slice showing Ventricles & MCA Territory',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80',
        labels: ['Lateral Ventricle', 'Anterior Limb', 'Posterior Limb', 'Insular Cortex']
      }
    ],

    mriScans: [
      {
        title: 'Normal Brain MRI vs. Acute MCA Stroke Ischemic Infarct',
        anatomyDesc: 'Normal T2/DWI MRI demonstrates symmetric brain parenchyma without hyperintensity or mass effect.',
        mriDesc: 'DWI MRI reveals bright hyperintense wedge-shaped area of restricted diffusion in right MCA territory.',
        normalImg: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&auto=format&fit=crop&q=80',
        pathologyImg: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80'
      }
    ],

    clinicalCases: [
      {
        title: 'Case 1: Right Middle Cerebral Artery (MCA) Ischemic Stroke',
        history: '68-year-old male with hypertension developed sudden left-sided weakness, left facial droop, and left hemisensory loss.',
        findings: ['Left Upper Limb > Lower Limb weakness (Grade 2/5)', 'Positive Babinski sign on Left Foot', 'Hyperreflexia (3+) Left Knee & Ankle'],
        rehabPlan: 'Neuro-developmental therapy (NDT/Bobath), weight-bearing on affected side, gait retraining with ankle-foot orthosis (AFO).'
      },
      {
        title: 'Case 2: Idiopathic Parkinson’s Disease (Stage 2 Hoehn & Yahr)',
        history: '62-year-old female complaining of right hand resting tremor ("pill-rolling"), micrographia, and sluggish movement during dressing.',
        findings: ['Cogwheel rigidity in bilateral elbows', 'Bradykinesia during rapid alternating finger tapping', 'Shuffling gait with reduced arm swing'],
        rehabPlan: 'BIG movement therapy (LSVT BIG), auditory rhythmic metronome cueing, trunk rotation exercises, and fall prevention.'
      }
    ],

    quizzes: [
      {
        id: 1,
        question: 'A positive Babinski sign (extensor plantar response) indicates a lesion in which structure?',
        options: ['Peripheral Nerve', 'Lower Motor Neuron', 'Upper Motor Neuron (Corticospinal Tract)', 'Cerebellum'],
        answer: 2,
        explanation: 'Babinski sign (dorsiflexion of big toe with fanning of other toes) is a classic indicator of UMN / Corticospinal tract lesion.'
      },
      {
        id: 2,
        question: 'Which cerebral artery supplies the lateral motor cortex controlling upper limb and facial movements?',
        options: ['Anterior Cerebral Artery (ACA)', 'Middle Cerebral Artery (MCA)', 'Posterior Cerebral Artery (PCA)', 'Basilar Artery'],
        answer: 1,
        explanation: 'The MCA supplies the convexity of the cerebral hemisphere controlling upper limb, face, and speech areas.'
      },
      {
        id: 3,
        question: 'The cardinal motor signs of Parkinson’s Disease include resting tremor, bradykinesia, rigidity, and:',
        options: ['Intention Tremor', 'Postural Instability', 'Spasticity', 'Chorea'],
        answer: 1,
        explanation: 'Parkinsonism cardinal features are summarized by TRAP: Tremor (resting), Rigidity, Akinesia/Bradykinesia, and Postural Instability.'
      }
    ],

    glossary: [
      { muscle: 'Upper Motor Neuron (UMN)', origin: 'Primary Motor Cortex (Brodmann Area 4)', insertion: 'Anterior Horn of Spinal Cord', nerve: 'Corticospinal Tract', action: 'Spasticity, Hyperreflexia, Babinski (+)' },
      { muscle: 'Lower Motor Neuron (LMN)', origin: 'Anterior Horn Cell', insertion: 'Neuromuscular Junction', nerve: 'Peripheral Nerve', action: 'Flaccidity, Hyporeflexia, Atrophy' },
      { muscle: 'Cerebellar Lesion', origin: 'Lateral Cerebellar Hemisphere', insertion: 'Deep Cerebellar Nuclei', nerve: 'Superior Cerebellar Peduncle', action: 'Ataxia, Dysmetria, Intention Tremor' }
    ]
  }
};
