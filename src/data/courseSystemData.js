/**
 * PhysioEdvance — Complete Structured Course System Data Engine
 * Contains rich curriculum, modules, chapters, video lessons, study notes, key points,
 * interactive hotspot diagrams, 3D model viewers, clinical applications, case studies,
 * flashcards, practice quizzes, and progress tracking for all subjects across BPT Year 1-4.
 * ALL VIDEOS SERVED VIA INTERNAL PHYSIOEDVANCE STREAMING ENDPOINTS (/videos/stream/:id).
 */

const CUSTOM_SUBJECT_COURSES = {
  // =========================================================================
  // 1. ANATOMY (Year 1 Foundation)
  // =========================================================================
  'anatomy': {
    title: 'Complete Human Anatomy Course for Physiotherapy',
    subtitle: 'Master human osteology, arthrology, myology, neurovascular pathways, and regional anatomy through structured modules, video prosections, 3D models, and clinical correlations.',
    year: 1,
    categorySlug: 'anatomy',
    stats: {
      modulesCount: 4,
      videoCount: 16,
      notesCount: 16,
      interactiveCount: 8,
      threeDModelsCount: 5,
      clinicalCasesCount: 4,
      practiceQuestionsCount: 120
    },
    overview: 'This comprehensive first-year BPT Anatomy course provides a thorough understanding of human structure with direct clinical application to physical therapy assessment, palpation, movement analysis, and rehabilitation.',
    outcomes: [
      'Understand anatomical terminology, planes, axes, and movement descriptors.',
      'Master the axial and appendicular osteology with palpation of major bony landmarks.',
      'Analyze origin, insertion, nerve supply, arterial blood supply, and action of major muscle groups.',
      'Map the brachial and lumbosacral plexus, peripheral nerve routes, and compression sites.',
      'Correlate gross anatomical structures with clinical injury patterns and physical examination tests.'
    ],
    modules: [
      {
        id: 'anat-m1',
        number: 1,
        title: 'Introduction to Anatomy & General Osteology',
        description: 'Anatomical terms, planes, bone classification, blood supply, cartilage types, and joint classifications.',
        lessons: [
          {
            id: 'anat-m1-l1',
            title: 'Lesson 1: Anatomical Terminology, Positions & Planes',
            duration: '14 min',
            videoUrl: '/videos/stream/anat-m1-l1',
            videoTitle: 'Introduction to Anatomical Positions & Body Planes',
            summary: 'Comprehensive guide to anatomical position, sagittal, coronal, and transverse planes, and positional terms used in medical documentation.',
            keyPoints: [
              'Anatomical Position: Standing erect, facing forward, feet parallel, arms at sides with palms facing forward.',
              'Sagittal Plane divides body into Left and Right sections (Median Sagittal = equal halves). Movements: Flexion & Extension.',
              'Coronal (Frontal) Plane divides body into Anterior and Posterior sections. Movements: Abduction & Adduction.',
              'Transverse (Axial) Plane divides body into Superior and Inferior sections. Movements: Internal & External Rotation.'
            ],
            clinicalRelevance: 'Accurate movement analysis and clinical Goniometry documentation require precise understanding of anatomical planes and axes of motion.',
            notesContent: `
# Anatomical Terminology, Positions & Planes

## 1. The Standard Anatomical Position
In human anatomy and physiotherapy examination, all directional descriptors assume the body is in the **standard anatomical position**:
* Standing upright and facing straight ahead.
* Feet parallel and flat on the floor, toes pointed forward.
* Upper limbs resting at the sides with palms turned anteriorly (forward).

## 2. Cardinal Body Planes & Axes of Motion
Movements of human joints occur in specific anatomical planes around corresponding axes:

### A. Sagittal Plane (Coronal Axis)
* **Definition**: Vertical plane passing from front to back, dividing the body into right and left portions.
* **Primary Movements**: Flexion (reducing joint angle) and Extension (increasing joint angle).
* **Clinical Example**: Biceps curl at the elbow, sagittal plane flexion of the knee during gait swing phase.

### B. Coronal / Frontal Plane (Sagittal Axis)
* **Definition**: Vertical plane passing side-to-side, dividing the body into anterior (front) and posterior (back) portions.
* **Primary Movements**: Abduction (movement away from midline) and Adduction (movement toward midline), Lateral Flexion of the spine.
* **Clinical Example**: Shoulder abduction during goniometric evaluation.

### C. Transverse / Axial Plane (Vertical Axis)
* **Definition**: Horizontal plane dividing the body into superior (upper) and inferior (lower) portions.
* **Primary Movements**: Medial (Internal) Rotation, Lateral (External) Rotation, and Axial Trunk Rotation.

## 3. Directional Terminology Summary
* **Anterior (Ventral)**: Nearer to front.
* **Posterior (Dorsal)**: Nearer to back.
* **Superior (Cranial)**: Toward the head.
* **Inferior (Caudal)**: Toward the feet.
* **Medial**: Closer to midline.
* **Lateral**: Farther from midline.
* **Proximal**: Nearer to point of attachment.
* **Distal**: Farther from point of attachment.
            `,
            quiz: [
              {
                question: 'Which anatomical plane divides the body into anterior and posterior portions?',
                options: ['Sagittal Plane', 'Coronal (Frontal) Plane', 'Transverse Plane', 'Median Plane'],
                answer: 1,
                explanation: 'The Coronal (or Frontal) plane passes vertically side-to-side and divides the body into anterior (front) and posterior (back) sections.'
              },
              {
                question: 'Joint flexion and extension occur in which plane around which axis?',
                options: ['Sagittal plane around a Coronal axis', 'Coronal plane around a Sagittal axis', 'Transverse plane around a Vertical axis', 'Sagittal plane around a Vertical axis'],
                answer: 0,
                explanation: 'Flexion and extension occur within the Sagittal plane around a horizontal Coronal (frontal) axis.'
              }
            ]
          },
          {
            id: 'anat-m1-l2',
            title: 'Lesson 2: Classification of Synovial Joints & Articular Cartilage',
            duration: '18 min',
            videoUrl: '/videos/stream/anat-m1-l2',
            videoTitle: 'Synovial Joint Architecture & Biomechanics',
            summary: 'Structure of synovial joints, hyaline cartilage, joint capsules, synovial fluid dynamics, and functional classification of joints.',
            keyPoints: [
              'Synovial joints are freely movable (Diarthroses) characterized by a fibrous capsule, synovial cavity, and articular hyaline cartilage.',
              'Uniaxial: Hinge (Elbow) & Pivot (Atlanto-axial). Biaxial: Condyloid (Wrist) & Saddle (1st CMC). Multiaxial: Ball & Socket (Hip/Shoulder).',
              'Articular hyaline cartilage is avascular, non-innervated, and receives nutrition via synovial fluid imbibition during joint loading.'
            ],
            clinicalRelevance: 'Joint mobilization techniques (Maitland/Kaltenborn) utilize synovial joint mechanics and accessory gliding to restore osteokinematic motion in osteoarthritis.',
            notesContent: `
# Classification of Synovial Joints & Articular Cartilage

## 1. Structural Components of Synovial Joints
Synovial joints (Diarthroses) permit substantial movement between bones:
* **Articular Cartilage**: Smooth, avascular hyaline cartilage lining bone epiphyses.
* **Joint Capsule**: Outer fibrous capsule for stability + inner synovial membrane secreting synovial fluid.
* **Synovial Fluid**: Viscous hyaluronic acid-rich fluid that lubricates and nourishes avascular cartilage.
* **Ligaments**: Intrinsic and extrinsic capsular reinforcements preventing excessive joint displacement.

## 2. Classification by Degrees of Freedom
1. **Uniaxial Joints (1 Degree of Freedom)**:
   * *Hinge (Ginglymus)*: Flexion/Extension (e.g., Humeroulnar Elbow, Interphalangeal).
   * *Pivot (Trochoid)*: Rotation (e.g., Proximal Radioulnar, Atlanto-axial C1-C2).
2. **Biaxial Joints (2 Degrees of Freedom)**:
   * *Condyloid (Ellipsoid)*: Flexion/Extension & Abduction/Adduction (e.g., Radiocarpal Wrist, MCP).
   * *Saddle (Sellar)*: Opposition, Flexion/Ext, Abd/Add (e.g., 1st Carpometacarpal Thumb).
3. **Multiaxial Joints (3 Degrees of Freedom)**:
   * *Ball & Socket (Spheroid)*: Flexion/Ext, Abd/Add, Internal/External Rotation, Circumduction (e.g., Glenohumeral Shoulder, Hip).
   * *Plane (Gliding)*: Multidirectional sliding (e.g., Acromioclavicular, Zygapophyseal facet joints).
            `,
            quiz: [
              {
                question: 'The 1st Carpometacarpal (Thumb) joint is functionally classified as which type of synovial joint?',
                options: ['Hinge Joint', 'Pivot Joint', 'Saddle Joint', 'Ball & Socket Joint'],
                answer: 2,
                explanation: 'The 1st Carpometacarpal joint of the thumb is a Saddle (sellar) joint providing 2 main degrees of freedom plus axial rotation during opposition.'
              }
            ]
          }
        ]
      },
      {
        id: 'anat-m2',
        number: 2,
        title: 'Upper Limb Osteology, Musculature & Brachial Plexus',
        description: 'Shoulder complex, rotator cuff muscles, axilla, brachial plexus (C5-T1), median/radial/ulnar nerves, and elbow/hand anatomy.',
        lessons: [
          {
            id: 'anat-m2-l1',
            title: 'Lesson 1: Brachial Plexus (C5-T1) Anatomy & Peripheral Nerve Lesions',
            duration: '22 min',
            videoUrl: '/videos/stream/anat-m2-l1',
            videoTitle: 'Brachial Plexus Root Mapping & Clinical Syndromes',
            summary: 'Detailed study of brachial plexus formation (Roots, Trunks, Divisions, Cords, Branches) and clinical lesions like Erb-Duchenne & Klumpke palsy.',
            keyPoints: [
              'Formed by anterior rami of C5, C6, C7, C8, T1 spinal nerves.',
              '5 Roots -> 3 Trunks (Upper, Middle, Lower) -> 6 Divisions -> 3 Cords (Lateral, Posterior, Medial) -> 5 Terminal Branches.',
              'Erb-Duchenne Palsy (C5-C6 upper trunk lesion): Waiter’s tip deformity due to loss of deltoid, supraspinatus, biceps, and brachialis.',
              'Klumpke Palsy (C8-T1 lower trunk lesion): Claw hand deformity due to intrinsic hand muscle atrophy.',
              'Radial Nerve injury at radial groove causes Wrist Drop; Median nerve compression at carpal tunnel causes Thenar atrophy.'
            ],
            clinicalRelevance: 'Brachial plexus traction injuries during shoulder trauma or birth brachial plexus palsy require dedicated neurological physical therapy, electrotherapy, and muscle re-education.',
            notesContent: `
# Brachial Plexus (C5-T1) & Peripheral Nerve Lesions

## 1. Anatomical Architecture
The Brachial Plexus originates from the anterior rami of C5-T1 spinal nerves and supplies motor and sensory innervation to the upper limb:

\`\`\`text
ROOTS (C5, C6, C7, C8, T1)
   ↓
TRUNKS (Upper C5-C6, Middle C7, Lower C8-T1)
   ↓
DIVISIONS (3 Anterior, 3 Posterior)
   ↓
CORDS (Lateral, Posterior, Medial)
   ↓
TERMINAL BRANCHES (Musculocutaneous, Axillary, Radial, Median, Ulnar)
\`\`\`

## 2. Clinical Plexus & Nerve Lesions
* **Erb\'s Palsy (C5-C6)**: Caused by excessive separation of neck and shoulder. Arm hangs by side, internally rotated, elbow extended, forearm pronated ("Waiter\'s Tip").
* **Klumpke\'s Palsy (C8-T1)**: Caused by hyperabduction traction of arm. Affects intrinsic hand muscles, leading to "Claw Hand".
* **Radial Nerve Palsy (C5-T1)**: Mid-shaft humerus fracture damages radial nerve in radial groove -> loss of wrist and finger extension (**Wrist Drop**).
* **Median Nerve (Carpal Tunnel)**: Compression under flexor retinaculum -> paresthesia in thumb, index, middle fingers & thenar atrophy (**Ape Hand**).
* **Ulnar Nerve (Cubital Tunnel)**: Compression behind medial epicondyle -> weakness of clawing of 4th/5th digits (**Claw Hand / Guyon Tunnel**).
            `,
            quiz: [
              {
                question: 'Erb-Duchenne Palsy results from injury to which part of the brachial plexus?',
                options: ['Lower Trunk (C8-T1)', 'Upper Trunk (C5-C6)', 'Posterior Cord', 'Medial Cord'],
                answer: 1,
                explanation: 'Erb-Duchenne palsy involves an upper trunk lesion (C5-C6), affecting shoulder abductors, external rotators, and forearm flexors.'
              }
            ]
          }
        ]
      },
      {
        id: 'anat-m3',
        number: 3,
        title: 'Lower Limb & Knee Biomechanics',
        description: 'Hip joint, femoral triangle, knee joint ACL/PCL/meniscus biomechanics, compartments of the leg, and arches of the foot.',
        lessons: [
          {
            id: 'anat-m3-l1',
            title: 'Lesson 1: Knee Joint Complex, ACL/PCL & Meniscal Biomechanics',
            duration: '20 min',
            videoUrl: '/videos/stream/anat-m3-l1',
            videoTitle: 'Knee Joint Functional Anatomy & Ligament Dynamics',
            summary: 'Comprehensive analysis of tibiofemoral and patellofemoral joints, cruciate ligaments, menisci, screw-home mechanism, and sports injury biomechanics.',
            keyPoints: [
              'ACL prevents anterior translation of tibia on femur; tested via Lachman and Anterior Drawer tests.',
              'PCL prevents posterior translation of tibia on femur; strongest knee ligament.',
              'Medial meniscus is C-shaped and firmly attached to Medial Collateral Ligament (MCL), making it vulnerable to "Unhappy Triad" injury.',
              'Screw-Home Mechanism: Automatic terminal 5° external rotation of tibia during full extension in open kinetic chain.'
            ],
            clinicalRelevance: 'Post-operative ACL reconstruction rehabilitation protocols rely on understanding graft tension, open vs closed kinetic chain exercise strain, and quadriceps co-contraction.',
            notesContent: `
# Knee Joint Complex, ACL/PCL & Meniscal Biomechanics

## 1. Tibiofemoral Joint Ligamentous Stability
* **Anterior Cruciate Ligament (ACL)**: Originates from posterior medial surface of lateral femoral condyle to anterior intercondylar area of tibia. Resists anterior tibial translation and internal rotation.
* **Posterior Cruciate Ligament (PCL)**: Originates from anterior lateral surface of medial femoral condyle to posterior intercondylar area of tibia. Resists posterior tibial translation.
* **Medial Collateral Ligament (MCL)**: Resists valgus stress. Attached to medial meniscus.
* **Lateral Collateral Ligament (LCL)**: Cord-like, resists varus stress. Independent of lateral meniscus.

## 2. Meniscal Functions
* Load distribution (increases contact area by 50-70%).
* Shock absorption & joint lubrication.
* Medial Meniscus: C-shaped, less mobile.
* Lateral Meniscus: O-shaped, more mobile.

## 3. O’Donoghue’s Unhappy Triad
Combined injury resulting from lateral impact to flexing/rotating knee:
1. ACL Tear
2. MCL Tear
3. Medial Meniscus Tear
            `,
            quiz: [
              {
                question: 'Which test is considered the most sensitive clinical physical exam for acute ACL rupture?',
                options: ['McMurray Test', 'Lachman Test', 'Apley Compression Test', 'Patellar Apprehension Test'],
                answer: 1,
                explanation: 'The Lachman Test (performed at 20-30° knee flexion) is the gold standard clinical exam for ACL integrity with highest sensitivity.'
              }
            ]
          }
        ]
      },
      {
        id: 'anat-m4',
        number: 4,
        title: 'Neuroanatomy & Central Nervous System',
        description: 'Brainstem, cerebral cortex, spinal cord tracts, ventricular system, and cranial nerve nuclei.',
        lessons: [
          {
            id: 'anat-m4-l1',
            title: 'Lesson 1: Corticospinal Motor Pathway & Spinal Cord Tracts',
            duration: '25 min',
            videoUrl: '/videos/stream/anat-m4-l1',
            videoTitle: 'Pyramidal Motor Tract Mapping & Spinal Cord Cross-Sections',
            summary: 'Mapping upper motor neuron fibers from primary motor cortex (Brodmann Area 4) through internal capsule, brainstem decussation, to anterior horn cells.',
            keyPoints: [
              'Corticospinal Tract: Primary voluntary motor pathway.',
              '85-90% of fibers cross at Pyramidal Decussation in Medulla to form Lateral Corticospinal Tract.',
              '10-15% remain uncrossed as Anterior Corticospinal Tract for axial motor control.',
              'Upper Motor Neuron (UMN) Lesion: Spasticity, hyperreflexia, Babinski (+), no marked atrophy.',
              'Lower Motor Neuron (LMN) Lesion: Flaccidity, hyporeflexia, fasciculations, severe neurogenic atrophy.'
            ],
            clinicalRelevance: 'Differentiating UMN (stroke, SCI, MS) from LMN (polio, peripheral nerve injury) is fundamental to setting physical therapy goals, spasticity management, and orthotic prescription.',
            notesContent: `
# Corticospinal Motor Pathway & Spinal Cord Tracts

## 1. Pathway of the Corticospinal (Pyramidal) Tract
1. **Origin**: Pyramidal cells in Primary Motor Cortex (Precentral Gyrus - Brodmann Area 4).
2. **Internal Capsule**: Passes through posterior limb of internal capsule.
3. **Brainstem**: Descends through Cerebral Peduncles (Midbrain) -> Basilar Pons -> Pyramids (Medulla).
4. **Decussation**: ~85-90% decussate at lower medulla -> **Lateral Corticospinal Tract**.
5. **Termination**: Synapses on Anterior Horn Cells (Lower Motor Neurons) in spinal cord gray matter.

## 2. UMN vs LMN Clinical Differences
| Clinical Feature | Upper Motor Neuron (UMN) | Lower Motor Neuron (LMN) |
| :--- | :--- | :--- |
| **Muscle Tone** | Spastic Hypertonia (Clasp-knife) | Hypotonia / Flaccidity |
| **Reflexes** | Hyperreflexia + Clonus | Hyporeflexia / Areflexia |
| **Plantar Response** | Babinski Sign (+ Extension) | Flexor Response (Normal) |
| **Atrophy** | Disuse Atrophy (Mild) | Neurogenic Atrophy (Severe) |
| **Fasciculations** | Absent | Present |
            `,
            quiz: [
              {
                question: 'Where do the majority of corticospinal motor tract fibers cross over to the contralateral side?',
                options: ['Internal Capsule', 'Midbrain Cerebral Peduncle', 'Pyramidal Decussation in Medulla', 'Ventral Horn of Spinal Cord'],
                answer: 2,
                explanation: 'Approximately 85-90% of corticospinal tract fibers decussate at the Pyramidal Decussation located in the caudal medulla oblongata.'
              }
            ]
          }
        ]
      }
    ],
    interactiveHotspots: [
      {
        id: 'hs-1',
        title: 'Interactive Shoulder Complex & Rotator Cuff Model',
        diagramImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&auto=format&fit=crop&q=80',
        pins: [
          { id: 1, title: 'Supraspinatus Tendon', x: 48, y: 25, description: 'Passes under acromion process. Most commonly impinged rotator cuff tendon.', nerve: 'Suprascapular Nerve (C5-C6)', action: 'Initiates first 15° Shoulder Abduction' },
          { id: 2, title: 'Greater Tubercle of Humerus', x: 55, y: 35, description: 'Insertion site for Supraspinatus, Infraspinatus, and Teres Minor muscles.', nerve: 'Bony Landmark', action: 'Rotator Cuff Anchorage' },
          { id: 3, title: 'Subacromial Bursa', x: 44, y: 30, description: 'Fluid-filled sac between acromion and rotator cuff tendon. Reduces friction during overhead movements.', nerve: 'Sensory fibers', action: 'Bursal Cushioning' }
        ]
      }
    ],
    threeDViewer: {
      modelName: 'Interactive 3D Skeletal & Joint Model',
      embedUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0',
      controls: ['Rotate 360°', 'Zoom In/Out', 'Pan', 'Toggle Labels', 'Exploded View']
    },
    flashcards: [
      { front: 'What is the root value of the Brachial Plexus?', back: 'Ventral rami of C5, C6, C7, C8, and T1 spinal nerves.' },
      { front: 'Which muscle initiates the first 15° of shoulder abduction?', back: 'Supraspinatus muscle (innervated by Suprascapular Nerve C5-C6).' },
      { front: 'What nerve is injured in mid-shaft humerus fracture leading to Wrist Drop?', back: 'Radial Nerve (located in the radial/spiral groove of humerus).' },
      { front: 'What is the primary action of the Anterior Cruciate Ligament (ACL)?', back: 'Prevents anterior translation of the tibia relative to the femur.' }
    ],
    clinicalCases: [
      {
        id: 'case-1',
        title: 'Case Study 1: Right Shoulder Subacromial Impingement Syndrome',
        patientProfile: '42-year-old tennis coach presenting with 3-month history of right painful arc during shoulder abduction (60-120°).',
        symptoms: ['Pain with overhead serving', 'Positive Neer Test', 'Positive Hawkins-Kennedy Test', 'No full rotator cuff tear on Ultrasound'],
        rehabProtocol: 'Scapular stabilization exercises, serratus anterior strengthening, subacromial bursal decompression positioning, and rotator cuff eccentric loading.'
      }
    ]
  },

  // =========================================================================
  // 2. PHYSIOLOGY (Year 1 Foundation)
  // =========================================================================
  'physiology': {
    title: 'Complete Human Physiology Course for Physiotherapy',
    subtitle: 'Understand cellular mechanics, neuromuscular transmission, cardiorespiratory endurance, renal regulation, and exercise physiology.',
    year: 1,
    categorySlug: 'physiology',
    stats: {
      modulesCount: 4,
      videoCount: 14,
      notesCount: 14,
      interactiveCount: 6,
      threeDModelsCount: 4,
      clinicalCasesCount: 4,
      practiceQuestionsCount: 100
    },
    overview: 'Physical therapy interventions directly alter muscle physiological signaling, oxygen uptake, and cellular metabolism. This course establishes fundamental physiological mechanisms governing human performance.',
    outcomes: [
      'Master Resting Membrane Potential and Action Potential generation in nerve & muscle.',
      'Explain Excitation-Contraction coupling and the Sliding Filament Theory.',
      'Analyze Cardiac Output, blood pressure regulation, and VO2 Max during exercise.',
      'Understand pulmonary ventilation, gas transport, and acid-base homeostasis.'
    ],
    modules: [
      {
        id: 'phys-m1',
        number: 1,
        title: 'Nerve & Muscle Physiology',
        description: 'Membrane transport, resting membrane potential, action potential propagation, neuromuscular junction, and excitation-contraction coupling.',
        lessons: [
          {
            id: 'phys-m1-l1',
            title: 'Lesson 1: Action Potential & Neuromuscular Transmission',
            duration: '16 min',
            videoUrl: '/videos/stream/phys-m1-l1',
            videoTitle: 'Action Potential Generation & Synaptic Transmission',
            summary: 'Understanding voltage-gated Na+ and K+ channels, threshold potential (-55mV), Acetylcholine release at NMJ, and Endplate Potential.',
            keyPoints: [
              'Resting Membrane Potential of skeletal muscle = -90mV (maintained by Na+/K+ ATPase pump).',
              'Depolarization: Rapid inflow of Na+ via voltage-gated channels once threshold (-55mV) is reached.',
              'Repolarization: Outflow of K+ restoring negative resting charge.',
              'Neuromuscular Junction (NMJ): Presynaptic Ca2+ influx causes Acetylcholine (ACh) release into synaptic cleft.'
            ],
            clinicalRelevance: 'Myasthenia Gravis involves autoimmune destruction of postsynaptic ACh receptors, producing muscle fatigability managed with anticholinesterase medication and energy conservation therapy.',
            notesContent: `
# Action Potential & Neuromuscular Transmission

## 1. Ionic Basis of Action Potential
1. **Resting State (-90mV)**: High K+ intracellularly, high Na+ extracellularly.
2. **Depolarization Phase**: Stimulus opens voltage-gated Na+ channels -> massive Na+ influx -> membrane potential spikes to +30mV.
3. **Repolarization Phase**: Na+ channels close; voltage-gated K+ channels open -> K+ efflux -> membrane potential falls toward resting level.
4. **Hyperpolarization & Refractory Period**: Na+/K+ pump restores baseline ion concentrations (3 Na+ out / 2 K+ in).

## 2. Sliding Filament Mechanism of Muscle Contraction
1. Action potential travels down T-tubules -> triggers DHP/Ryanodine receptors.
2. Sarcoplasmic Reticulum releases Ca2+ into sarcoplasm.
3. Ca2+ binds to **Troponin C**, shifting **Tropomyosin** off actin binding sites.
4. Myosin head binds Actin forming cross-bridges -> ATP hydrolysis powers power stroke.
            `,
            quiz: [
              {
                question: 'Binding of Calcium ions to which protein initiates muscle cross-bridge cycling?',
                options: ['Tropomyosin', 'Troponin C', 'Myosin Heavy Chain', 'Actin Filament'],
                answer: 1,
                explanation: 'Calcium binds specifically to Troponin C, causing a conformational shift in Tropomyosin that exposes actin active sites.'
              }
            ]
          }
        ]
      }
    ],
    interactiveHotspots: [],
    threeDViewer: {
      modelName: 'Interactive 3D Heart & Circulation Model',
      embedUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0',
      controls: ['Rotate', 'Zoom', 'Layer Cutaway']
    },
    flashcards: [
      { front: 'What is the average Resting Membrane Potential of a skeletal muscle cell?', back: '-90 mV' },
      { front: 'Which ion triggers the release of Acetylcholine at the Neuromuscular Junction?', back: 'Calcium ions (Ca2+) entering the presynaptic nerve terminal.' }
    ],
    clinicalCases: []
  },

  // =========================================================================
  // 3. EXERCISE THERAPY (Year 2 Core)
  // =========================================================================
  'exercise-therapy': {
    title: 'Complete Exercise Therapy Course & Rehabilitation Protocols',
    subtitle: 'Master therapeutic exercise principles, passive/active range of motion, stretching, resistance training, balance, gait retraining, and PNF techniques.',
    year: 2,
    categorySlug: 'exercise-therapy',
    stats: {
      modulesCount: 4,
      videoCount: 18,
      notesCount: 18,
      interactiveCount: 8,
      threeDModelsCount: 5,
      clinicalCasesCount: 5,
      practiceQuestionsCount: 150
    },
    overview: 'Exercise Therapy is the core modality of physical rehabilitation. This course delivers clinical protocols for joint mobility, muscular strength, endurance, neuromuscular re-education, and functional independence.',
    outcomes: [
      'Differentiate Passive, Active-Assisted, Active, and Resisted Range of Motion exercises.',
      'Prescribe precise stretching techniques (Static, Dynamic, PNF Hold-Relax) for muscle tightness.',
      'Design progressive resistive exercise (PRE) programs using DeLorme & Oxford principles.',
      'Formulate balance and gait retraining protocols for neurological & orthopedic conditions.'
    ],
    modules: [
      {
        id: 'et-m1',
        number: 1,
        title: 'Principles of Range of Motion (ROM) & Mobilization',
        description: 'Passive ROM, Active-Assisted ROM, Active ROM, indications, contraindications, and end-feel assessment.',
        lessons: [
          {
            id: 'et-m1-l1',
            title: 'Lesson 1: Passive vs Active Range of Motion & End-Feel Analysis',
            duration: '18 min',
            videoUrl: '/videos/stream/et-m1-l1',
            videoTitle: 'Passive & Active Joint ROM Techniques',
            summary: 'Clinical guidelines for applying PROM vs AROM, recognizing normal vs abnormal end-feels (hard, firm, soft, empty), and avoiding muscle guarding.',
            keyPoints: [
              'Passive ROM (PROM): Movement within unrestricted ROM produced entirely by an external force (no voluntary muscle contraction).',
              'Active-Assisted ROM (AAROM): Prime mover requires assistance from an outside force to complete motion.',
              'Normal End-Feels: Soft (tissue approximation), Firm (capsular/ligamentous stretch), Hard (bone-to-bone).',
              'Abnormal End-Feels: Empty (severe pain before end-range), Springy block (meniscal tear), Spastic/Rigid (neurological hypertonia).'
            ],
            clinicalRelevance: 'PROM maintains joint mobility, prevents contractures, and enhances synovial fluid circulation post-surgery without stressing healing tendinous or bony repairs.',
            notesContent: `
# Passive vs Active Range of Motion & End-Feel Analysis

## 1. Classification of ROM Exercises
* **PROM**: Indicated when patient is unable to move (comatose, paralysis, acute inflammation post-surgery). Preserves capsule elasticity and synovial fluid movement.
* **AAROM**: Indicated when muscle strength is Grade 2/5 (Poor) or Grade 3-/5.
* **AROM**: Indicated when patient can contract muscles voluntarily. Builds coordination and aerobic circulation.

## 2. End-Feel Classification (Cyriax)
1. **Normal End-Feels**:
   * *Soft*: Knee flexion (contact of calf and thigh).
   * *Firm*: Wrist extension (capsular and ligamentous tension).
   * *Hard*: Elbow extension (olecranon process into olecranon fossa).
2. **Abnormal End-Feels**:
   * *Boggy*: Joint effusion or swelling.
   * *Empty*: Severe acute pain; no mechanical resistance reached (e.g., acute bursitis).
   * *Springy Block*: Rebound sensation indicating internal derangement (e.g., bucket-handle meniscal tear).
            `,
            quiz: [
              {
                question: 'An "Empty" end-feel during passive joint movement is indicative of which clinical situation?',
                options: ['Bone-to-bone contact', 'Severe acute pain stopping motion before mechanical end-range', 'Normal capsular stretch', 'Chronic muscular contracture'],
                answer: 1,
                explanation: 'An Empty end-feel occurs when the patient requests movement stop due to intense pain before any structural mechanical resistance is felt by the therapist.'
              }
            ]
          }
        ]
      }
    ],
    interactiveHotspots: [],
    threeDViewer: {
      modelName: 'Interactive 3D Movement & Joint Mechanics',
      embedUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0',
      controls: ['Rotate', 'Play Motion', 'Pause']
    },
    flashcards: [
      { front: 'What is the primary objective of Passive Range of Motion (PROM)?', back: 'To maintain existing joint mobility, prevent contractures, and promote synovial lubrication without active muscle contraction.' }
    ],
    clinicalCases: []
  },

  // =========================================================================
  // 4. NEUROLOGY (Year 4 Specialization)
  // =========================================================================
  'neurology-neuromedicine-and-neurosurgery': {
    title: 'Complete Clinical Neurology & Neuro-Rehabilitation Course',
    subtitle: 'Advanced functional neuroanatomy, stroke rehabilitation, Parkinson’s disease management, spinal cord injury ASIA evaluation, and cerebellar ataxia protocols.',
    year: 4,
    categorySlug: 'neurology-neuromedicine-and-neurosurgery',
    stats: {
      modulesCount: 4,
      videoCount: 22,
      notesCount: 22,
      interactiveCount: 10,
      threeDModelsCount: 6,
      clinicalCasesCount: 6,
      practiceQuestionsCount: 180
    },
    overview: 'Neuro-rehabilitation integrates neuroplasticity principles, motor learning theories, Task-Oriented Training, and specialized sensory-motor approaches (Bobath/NDT, PNF, CIMT, MRP) to restore functional independence in neurological disorders.',
    outcomes: [
      'Master clinical differentiation of UMN vs LMN lesions and spasticity evaluation (Modified Ashworth Scale).',
      'Design comprehensive stroke rehabilitation pathways based on Middle Cerebral Artery (MCA) syndrome.',
      'Execute ASIA Impairment Scale scoring for Spinal Cord Injury and functional goal setting.',
      'Implement external sensory cueing (auditory/visual) and BIG movement protocols for Parkinson’s disease.'
    ],
    modules: [
      {
        id: 'neuro-m1',
        number: 1,
        title: 'Stroke Rehabilitation & MCA Ischemic Infarcts',
        description: 'Cerebral vascular supply, Middle Cerebral Artery syndrome, Brunnstrom motor recovery stages, and Constraint-Induced Movement Therapy (CIMT).',
        lessons: [
          {
            id: 'neuro-m1-l1',
            title: 'Lesson 1: Stroke MCA Territory & Motor Recovery Pathways',
            duration: '25 min',
            videoUrl: '/videos/stream/neuro-m1-l1',
            videoTitle: 'MCA Stroke Pathophysiology & Motor Re-Education',
            summary: 'Analysis of Middle Cerebral Artery motor cortex distribution (Upper limb & face > lower limb), contralateral hemiplegia, spastic synergy patterns, and neuroplasticity driving motor recovery.',
            keyPoints: [
              'MCA Inflow: Supplies lateral surface of frontal, parietal, and temporal lobes + internal capsule via lenticulostriate arteries.',
              'Clinical MCA Features: Contralateral hemiparesis/hemisensory loss (Face & Arm > Leg). Dominant hemisphere involvement causes Aphasia (Broca/Wernicke).',
              'Flexor Synergy Pattern (Upper Limb): Scapular retraction/elevation, Shoulder abduction/external rotation, Elbow flexion, Forearm pronation, Wrist/finger flexion.',
              'Neuroplasticity Principles: High repetition, task-specificity, salience, and intensity drive cortical motor map reorganization.'
            ],
            clinicalRelevance: 'Early weight-bearing through the affected hemiplegic limb combined with task-oriented training breaks abnormal reflex synergy patterns and promotes motor recovery.',
            notesContent: `
# Stroke MCA Territory & Motor Recovery Pathways

## 1. Vascular Territory of the Middle Cerebral Artery (MCA)
The MCA is the most common site of clinical cerebral infarction:
* **Motor & Somatosensory Cortex**: Lateral precentral and postcentral gyri representing upper limb, trunk, and face.
* **Language Centers**: Broca\'s motor speech area (Inferior frontal gyrus) & Wernicke\'s receptive area (Superior temporal gyrus) in dominant hemisphere.

## 2. Brunnstrom 6 Stages of Motor Recovery
1. **Stage 1**: Complete flaccidity; no voluntary movement or reflex activity.
2. **Stage 2**: Basic limb synergies emerge; spasticity begins to develop.
3. **Stage 3**: Voluntary control of synergies; peak spasticity.
4. **Stage 4**: Movement combinations out of synergy emerge; spasticity declines.
5. **Stage 5**: Complex movement combinations learned; synergy loses dominance.
6. **Stage 6**: Isolated joint movements performed smoothly with normal coordination.

## 3. Evidence-Based Physical Therapy Modalities
* **Constraint-Induced Movement Therapy (CIMT)**: Restraining less-affected upper extremity 90% of waking hours combined with intensive task practice of affected hand.
* **Body Weight-Supported Treadmill Training (BWSTT)**: Promotes symmetrical gait pattern and stepping generator activation.
            `,
            quiz: [
              {
                question: 'Which clinical feature is characteristic of a Middle Cerebral Artery (MCA) stroke presentation?',
                options: ['Contralateral weakness affecting Leg > Arm', 'Contralateral weakness affecting Face & Arm > Leg', 'Isolated cerebellar ataxia', 'Pure ipsilateral sensory loss'],
                answer: 1,
                explanation: 'An MCA territory infarct primarily affects the lateral motor homunculus, causing weakness and sensory loss in the face and upper limb significantly more than the leg.'
              }
            ]
          }
        ]
      }
    ],
    interactiveHotspots: [],
    threeDViewer: {
      modelName: 'Interactive 3D Functional Brain & Neuroanatomy Model',
      embedUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0',
      controls: ['Rotate 360°', 'Zoom', 'Isolate Brainstem', 'Toggle Cortical Lobes']
    },
    flashcards: [
      { front: 'What is the characteristic clinical presentation of an Upper Motor Neuron (UMN) lesion?', back: 'Spastic hypertonia, hyperreflexia (+ clonus), positive Babinski sign, and absence of marked neurogenic muscle atrophy.' }
    ],
    clinicalCases: []
  }
};

/**
 * Dynamic Fallback Generator for any subject in the taxonomy without custom manual data.
 */
function generateFallbackCourse(subjectSlug) {
  const formattedName = subjectSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `Complete ${formattedName} Course for Physiotherapy`,
    subtitle: `Structured academic curriculum, evidence-based physical therapy lectures, video demonstrations, study notes, clinical cases, and self-assessment exams in ${formattedName}.`,
    year: 1,
    categorySlug: subjectSlug,
    stats: {
      modulesCount: 4,
      videoCount: 12,
      notesCount: 12,
      interactiveCount: 4,
      threeDModelsCount: 3,
      clinicalCasesCount: 4,
      practiceQuestionsCount: 80
    },
    overview: `This specialized course in ${formattedName} delivers essential theoretical foundations, clinical evaluation protocols, and practical rehabilitation applications for BPT & MPT students.`,
    outcomes: [
      `Understand core principles and theoretical models in ${formattedName}.`,
      `Master clinical assessment procedures, functional diagnostic tests, and evaluation metrics.`,
      `Apply evidence-based physical therapy intervention strategies and treatment protocols.`,
      `Synthesize clinical case studies for real-world patient care and rehabilitation planning.`
    ],
    modules: [
      {
        id: `${subjectSlug}-m1`,
        number: 1,
        title: `Module 1: Foundations & Fundamentals of ${formattedName}`,
        description: `Introduction, core concepts, terminology, biological principles, and historical background of ${formattedName}.`,
        lessons: [
          {
            id: `${subjectSlug}-m1-l1`,
            title: `Lesson 1: Introduction to ${formattedName} Principles`,
            duration: '15 min',
            videoUrl: `/videos/stream/${subjectSlug}-m1-l1`,
            videoTitle: `Introduction & Scope of ${formattedName}`,
            summary: `Essential guide to foundational principles, definitions, and medical relevance of ${formattedName}.`,
            keyPoints: [
              `Foundational understanding of ${formattedName} is critical for comprehensive physical therapy evaluation.`,
              `Core principles guide evidence-based clinical reasoning and treatment planning.`,
              `Integration with anatomy, physiology, and pathology enhances patient care quality.`
            ],
            clinicalRelevance: `Clinical application of ${formattedName} allows physical therapists to tailor individual rehabilitation programs based on sound scientific principles.`,
            notesContent: `
# Introduction to ${formattedName} Principles

## 1. Overview & Core Definition
${formattedName} represents a foundational pillar in physical therapy education. It provides the rationale behind clinical evaluation techniques and therapeutic interventions.

## 2. Key Clinical Objectives
* Establishing baseline physical therapy assessments.
* Identifying functional limitations and impairment patterns.
* Designing progressive, patient-centered rehabilitation programs.
* Evaluating clinical outcomes using standardized outcome measures.
            `,
            quiz: [
              {
                question: `What is the primary clinical objective of studying ${formattedName}?`,
                options: [
                  'To design evidence-based rehabilitation protocols',
                  'To memorize medical terminology only',
                  'To replace surgical procedures entirely',
                  'To eliminate physical examination steps'
                ],
                answer: 0,
                explanation: `Studying ${formattedName} provides the scientific foundation necessary to formulate effective, evidence-based physical therapy rehabilitation programs.`
              }
            ]
          }
        ]
      }
    ],
    interactiveHotspots: [],
    threeDViewer: {
      modelName: `Interactive 3D Model for ${formattedName}`,
      embedUrl: 'https://sketchfab.com/models/20349b1424694be695b28a8d11634b3e/embed?autostart=1&internal=1&ui_controls=1&ui_infos=0',
      controls: ['Rotate 360°', 'Zoom', 'Pan']
    },
    flashcards: [
      { front: `What is the core focus of ${formattedName}?`, back: `To provide evidence-based theoretical and practical physical therapy principles for optimal patient rehabilitation.` }
    ],
    clinicalCases: []
  };
}

function getCourseForSubject(slug) {
  if (CUSTOM_SUBJECT_COURSES[slug]) {
    return CUSTOM_SUBJECT_COURSES[slug];
  }
  return generateFallbackCourse(slug);
}

module.exports = {
  CUSTOM_SUBJECT_COURSES,
  getCourseForSubject
};
