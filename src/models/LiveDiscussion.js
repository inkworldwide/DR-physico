const db = require('../db/connection');

const LiveDiscussion = {
  async initTable() {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS live_discussions (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL DEFAULT 'orthopedics',
        tag_label TEXT DEFAULT 'Clinical Case Round',
        title TEXT NOT NULL,
        summary TEXT NOT NULL,
        questions TEXT NOT NULL,
        takeaway TEXT,
        author_name TEXT NOT NULL,
        author_role TEXT DEFAULT 'Faculty / Clinician',
        author_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        is_active INTEGER DEFAULT 1,
        is_pinned INTEGER DEFAULT 0,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS live_discussion_replies (
        id SERIAL PRIMARY KEY,
        discussion_id INTEGER NOT NULL REFERENCES live_discussions(id) ON DELETE CASCADE,
        parent_id INTEGER REFERENCES live_discussion_replies(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name TEXT NOT NULL,
        author_role TEXT,
        content TEXT NOT NULL,
        is_mentor INTEGER DEFAULT 0,
        upvotes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    try {
      await db.prepare(`ALTER TABLE live_discussion_replies ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES live_discussion_replies(id) ON DELETE CASCADE`).run();
    } catch (e) {}
    try {
      await db.prepare(`ALTER TABLE live_discussion_replies ADD COLUMN IF NOT EXISTS upvotes INTEGER DEFAULT 0`).run();
    } catch (e) {}
    try {
      await db.prepare(`ALTER TABLE live_discussion_replies ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0`).run();
    } catch (e) {}
    try {
      await db.prepare(`ALTER TABLE live_discussions ADD COLUMN IF NOT EXISTS downvotes INTEGER DEFAULT 0`).run();
    } catch (e) {}

    // Check count and seed default discussions if empty
    const countRow = await db.prepare(`SELECT COUNT(*) as c FROM live_discussions`).get();
    if (Number(countRow ? countRow.c : 0) === 0 || Number(countRow ? countRow.c : 0) < 10) {
      const defaultDiscussions = [
        {
          category: 'orthopedics',
          tag_label: 'Clinical Case Round',
          title: '28yo Athlete with 10° Extensor Lag & Patellofemoral Pain 6-Weeks Post-ACL Reconstruction',
          summary: 'A 28-year-old amateur footballer underwent Hamstring Autograft ACL reconstruction 6 weeks ago. Presents with full passive knee extension, but an active extensor lag of 10° and anterior knee pain during closed-chain mini-squats (0°–45°).',
          questions: '1. Is the extensor lag primary arthrogenic muscle inhibition (AMI) or graft tightness?\n2. Should Open Kinetic Chain (OKC) quadriceps knee extensions in 90°–45° be introduced now or deferred?\n3. What specific NMES parameters should be selected on Vastus Medialis Oblique (VMO)?',
          takeaway: 'Standard Clinical Consensus: At 6 weeks, graft healing is in the remodeling phase. Extensor lag with full passive extension indicates vastus arthrogenic inhibition rather than mechanical obstruction. High-intensity NMES (75Hz, 250µs, 1:3 duty cycle) combined with terminal active quad setting in supine is indicated. OKC seated extension from 90°–45° produces minimal ACL strain and safely restores quadriceps peak torque without patellar overload.',
          author_name: 'Dr. Anand Kumar, MPT (Ortho)',
          author_role: 'Senior Faculty',
          is_pinned: 1,
          upvotes: 24
        },
        {
          category: 'neurology',
          tag_label: 'Mentor Clinical Pearl',
          title: 'Managing 2-Finger Inferior Shoulder Subluxation in Subacute MCA Stroke (Brunnstrom Stage 2)',
          summary: 'A 62-year-old male 3 weeks post-right MCA ischemic infarct presents with Left flaccid hemiparesis and a noticeable 2-finger sulcus sign at the left glenohumeral joint upon upright standing, with early traction discomfort.',
          questions: '1. Does prolonged Bobath shoulder sling use encourage adductor-internal rotator spastic pattern?\n2. Optimal electrode placement for Functional Electrical Stimulation (FES) to prevent subluxation?\n3. Should weight-bearing through the extended wrist and elbow in sitting be prioritized over overhead pulleys?',
          takeaway: 'Standard Clinical Consensus: Overhead reciprocating pulleys are strictly contraindicated in flaccid hemiplegia due to high risk of subacromial impingement and complex regional pain syndrome (CRPS). FES applied to posterior deltoid and supraspinatus for 30–60 minutes daily significantly reduces sulcus depth.',
          author_name: 'Dr. Varun Nair, MPT (Neuro)',
          author_role: 'Neuro Specialist',
          is_pinned: 1,
          upvotes: 31
        },
        {
          category: 'neurology',
          tag_label: 'Movement Disorders',
          title: 'Parkinsonian Freezing of Gait (FOG) & Visual/Auditory Cueing Strategies',
          summary: 'A 68-year-old female with Idiopathic Parkinson\'s Disease (Hoehn & Yahr Stage III) experiences frequent freezing when turning in narrow doorways or initiating locomotion.',
          questions: '1. Rhythmic Auditory Stimulation (RAS) metronome tempo selection vs baseline cadence.\n2. Visual laser line projector vs step-over tape cues for overcoming motor block.\n3. Dual-task cognitive interference during functional gait re-education.',
          takeaway: 'Standard Neuro Consensus: External cueing bypasses damaged basal ganglia motor loops by utilizing intact cortical visual and auditory motor pathways.',
          author_name: 'Dr. Shalini Das, MPT (Neuro)',
          author_role: 'Neuro Faculty',
          is_pinned: 0,
          upvotes: 26
        },
        {
          category: 'orthopedics',
          tag_label: 'Shoulder Rehabilitation',
          title: 'Subacromial Impingement vs Rotator Cuff Tendinopathy: Scapular Dyskinesis & Isotonic Loading',
          summary: 'A 34-year-old swimmer presents with painful arc (60°-120° abduction) and positive Hawkins-Kennedy test. Kibler Type II scapular winging noted during lowering phase of arm elevation.',
          questions: '1. Serratus Anterior & Lower Trapezius muscle re-education vs upper trap dominance.\n2. Role of scapular retraction (scapular assistance test) in restoring subacromial space width.\n3. Progressive eccentric loading of supraspinatus vs subscapularis.',
          takeaway: 'Standard Ortho Consensus: Scapular motor control training restores normal upward rotation and posterior tilt, opening subacromial clearance without surgical acromioplasty.',
          author_name: 'Dr. Anand Kumar, MPT (Ortho)',
          author_role: 'Senior Faculty',
          is_pinned: 0,
          upvotes: 34
        },
        {
          category: 'psychology-sociology',
          tag_label: 'Pain Psychology & Patient Behavior',
          title: 'Managing Pain Catastrophizing and High Kinesiophobia in Chronic Musculoskeletal Patients',
          summary: 'A 45-year-old chronic low back pain patient presents with Tampa Scale of Kinesiophobia score 48/68 and fear-avoidance beliefs. Patient refuses spinal mobilization due to catastrophic fear of permanent nerve damage.',
          questions: '1. How to integrate Cognitive Behavioral Therapy (CBT) principles into physiotherapy pain education?\n2. What graded exposure in vivo protocols work best for spinal flexion fear?\n3. Differentiating adaptive vs maladaptive pain coping strategies in chronic pain.',
          takeaway: 'Standard Clinical Consensus: Pain Neuroscience Education (PNE) combined with graded exposure in vivo significantly reduces pain catastrophizing and fear-avoidance beliefs compared to traditional bio-anatomical explanations alone.',
          author_name: 'Dr. Radhika Sharma, MPT (Rehab)',
          author_role: 'Psychosocial Lead Faculty',
          is_pinned: 1,
          upvotes: 38
        },
        {
          category: 'human-anatomy',
          tag_label: 'Musculoskeletal & Gross Anatomy',
          title: 'Rotator Interval Anatomy & Subcoracoid Impingement Biomechanics',
          summary: 'Cadaveric and high-resolution MRI correlation of the coracohumeral ligament, superior glenohumeral ligament, and biceps reflex pulley in shoulder anterior stability.',
          questions: '1. Anatomical boundaries of the Rotator Interval and clinical signs of laxity.\n2. Subcoracoid vs Subacromial impingement differential clinical tests.\n3. Vascular supply of supraspinatus critical zone (Codman\'s area).',
          takeaway: 'Standard Anatomical Consensus: The Rotator Interval plays a vital role as a static stabilizer against inferior and anterior glenohumeral translation at 0° abduction.',
          author_name: 'Dr. Harish Patel, MS (Anatomy)',
          author_role: 'Senior Anatomist',
          is_pinned: 0,
          upvotes: 27
        },
        {
          category: 'human-physiology',
          tag_label: 'Exercise & Neuromuscular Physiology',
          title: 'Motor Unit Recruitment Dynamics: Henneman Size Principle During Submaximal Fatigue',
          summary: 'Analysis of EMG frequency spectrum shifts (Median Frequency drop) during fatiguing isometric quadriceps contractions.',
          questions: '1. Why high-threshold Type IIb fast-fatigable motor units are recruited last during incremental effort?\n2. Central vs Peripheral neuromuscular fatigue markers.\n3. Impact of blood flow restriction (BFR) training on hypoxia-induced motor unit recruitment.',
          takeaway: 'Standard Physiology Consensus: Under hypoxic BFR conditions, low-load resistance training (20-30% 1RM) accelerates the Henneman Size Principle, recruiting Type II muscle fibers early without high joint shear stress.',
          author_name: 'Dr. Sunita Rao, MD (Physiology)',
          author_role: 'Physiology Professor',
          is_pinned: 0,
          upvotes: 22
        },
        {
          category: 'biomechanics-kinesiology',
          tag_label: 'Gait & Kinesiological Analysis',
          title: 'Sagittal & Frontal Plane Biomechanics in Trendelenburg & Compensated Abductor Gait',
          summary: 'Biomechanical calculation of hip joint reaction forces (JRF) during single-leg stance phase and the mechanical advantage of using a cane in the contralateral hand.',
          questions: '1. Why holding a walking stick in the CONTRALATERAL hand reduces hip joint compression by 60%.\n2. Moments created by gluteus medius vs body weight lever arm.\n3. Frontal plane pelvic drop vs lateral trunk lean compensation.',
          takeaway: 'Standard Biomechanics Consensus: Contralateral cane placement increases the effort arm length and creates an additive abductor moment, dramatically reducing required gluteus medius tension and joint reaction force.',
          author_name: 'Dr. Amit Varma, MPT (Biomechanics)',
          author_role: 'Kinesiology Chair',
          is_pinned: 0,
          upvotes: 35
        },
        {
          category: 'exercise-therapy',
          tag_label: 'Therapeutic Exercise Protocols',
          title: 'DeLorme vs Oxford Progressive Resistance Exercise (PRE) Protocols in Quadriceps Re-education',
          summary: 'Comparative trial of ascending (DeLorme: 50%-75%-100% 10RM) versus descending (Oxford: 100%-75%-50% 10RM) loading paradigms in muscle hypertrophy and fatigue management.',
          questions: '1. Why DeLorme protocol warm-up sets reduce risk of acute tendon strain.\n2. How Oxford protocol accounts for progressive neuromuscular fatigue during working sets.\n3. Determining 10RM vs 1RM safety in early post-operative phases.',
          takeaway: 'Standard Clinical Consensus: Oxford protocol provides optimal fatigue accommodation during working sets, whereas DeLorme protocol is superior for tendon collagen preparation and physiological warm-up.',
          author_name: 'Dr. Rajiv Kapoor, MPT (ExTherapy)',
          author_role: 'Exercise Therapy Lead',
          is_pinned: 0,
          upvotes: 29
        },
        {
          category: 'electrotherapy',
          tag_label: 'Electrophysical Agents',
          title: 'Interferential Therapy (IFT) Vector Sweep vs TENS Gate Control in Lumbar Radiculopathy',
          summary: 'Differentiating 4-pole quadripolar vector sweep IFT (4000Hz carrier frequency) from High-Frequency TENS (100Hz, 50µs) for deep tissue segmental analgesia.',
          questions: '1. Skin resistance reduction using 4000Hz carrier frequency vs 100Hz low frequency.\n2. Beat frequency selection: 80-120Hz for acute pain vs 1-10Hz for endogenous opioid release.\n3. Contraindications near cardiac pacemakers and metal implants.',
          takeaway: 'Standard Electrotherapy Consensus: IFT utilizes kilohertz-range skin impedance reduction to deliver deeper penetration with comfortable sensory stimulation compared to surface TENS.',
          author_name: 'Dr. Nidhi Saxena, MPT (Electro)',
          author_role: 'Electrotherapy Specialist',
          is_pinned: 0,
          upvotes: 33
        },
        {
          category: 'cardiopulmonary',
          tag_label: 'ICU Protocols',
          title: 'Post-CABG Day-2 Left Basilar Atelectasis with Sternotomy Precautions',
          summary: 'A 59-year-old diabetic male Day 2 post-triple vessel CABG extubated onto 2L nasal prongs. SpO2 91%, shallow breathing rate 26/min. Auscultation reveals coarse crackles with decreased air entry in left lower zone.',
          questions: '1. Is high-pressure manual chest clapping safe with fresh median sternotomy wires?\n2. How does Active Cycle of Breathing Techniques (ACBT) with sternal pillow support compare with incentive spirometry?\n3. Criteria for initiating progressive bed-to-chair dangling and early hallway ambulation?',
          takeaway: 'Standard Clinical Consensus: Direct chest clapping over or adjacent to median sternotomy is contraindicated in acute phase. ACBT utilizing thoracic expansion exercises (TEE) with a 3-second inspiratory hold and self-splinted huffing (pillow hug) promotes collateral ventilation through Channels of Martin and Pores of Kohn without increasing sternal shear force.',
          author_name: 'Dr. Sneha Sen, MPT (Cardio-Pulm)',
          author_role: 'Cardiorespiratory Faculty',
          is_pinned: 0,
          upvotes: 19
        },
        {
          category: 'sports',
          tag_label: 'Return-to-Play Criteria',
          title: 'Midportion Achilles Tendinopathy in a National Badminton Player: HSR vs Eccentric Alfredson Protocol',
          summary: 'A 23-year-old state-level singles badminton player has had 4 months of morning stiffness and localized nodular tenderness 4cm proximal to calcaneal insertion. Pain is 6/10 on first 10 minutes of lunging and hopping.',
          questions: '1. Why Heavy Slow Resistance (HSR) produces superior collagen remodeling compared to isolated eccentric dropping?\n2. Role of isometric holds (5x45 sec at 70% MVC) for immediate tendon neuroplastic analgesia?\n3. What specific Hop Test battery (>90% Limb Symmetry Index) dictates return to competitive match play?',
          takeaway: 'Standard Clinical Consensus: High-load isometric holds reduce cortical inhibition and provide 4-6 hours of analgesia. HSR (3 sets of 6–8 reps, 3-second concentric, 3-second eccentric, 3x/week) maximizes tendon stiffness and mechanotransduction.',
          author_name: 'Dr. Rahul Deshmukh, MPT (Sports)',
          author_role: 'Sports Clinician',
          is_pinned: 0,
          upvotes: 42
        },
        {
          category: 'exam_prep',
          tag_label: 'University Exam High-Yield',
          title: 'Clinical Differentiation: True Lumbar Radiculopathy vs Piriformis Syndrome vs SI Joint Dysfunction',
          summary: 'A 36-year-old software engineer presents with right buttock and posterior thigh pain radiating to calf. What special test battery and neurological reflexes conclusively isolate nerve root compression from extraspinal entrapment?',
          questions: '1. Comparison of Straight Leg Raise (SLR) + Braggard\'s vs FAIR (Flexion-Adduction-Internal Rotation) test.\n2. Laslett\'s SIJ cluster (Distraction, Thigh Thrust, Compression, Sacral Thrust) validity rules.\n3. Dermatomal / Myotomal neurological findings (L5 vs S1) vs trigger point referral patterns.',
          takeaway: 'Viva Reference Points: True radiculopathy demonstrates positive Slump test, dermatomal sensory changes (L5 dorsum of foot / S1 lateral border), and myotomal weakness (extensor hallucis longus or calf). Piriformis syndrome reproduces sciatic pain during FAIR test or resisted abduction in seated position (Pace\'s sign) with normal spine ROM.',
          author_name: 'Dr. Meera Kulkarni, MPT (Academic HOD)',
          author_role: 'Professor',
          is_pinned: 0,
          upvotes: 56
        },
        {
          category: 'pediatrics',
          tag_label: 'Developmental Rounds',
          title: 'Equinus Gait & Crouch Posture in a 4yo Child with Spastic Diplegia (GMFCS Level II)',
          summary: '4-year-old girl with spastic diplegic cerebral palsy ambulates independently with bilateral toe-walking and 15° knee flexion during midstance. Modified Ashworth Scale (MAS) is 2 for gastrocnemius-soleus bilaterally.',
          questions: '1. Solid AFO vs Hinged AFO vs Ground Reaction AFO (GRAFO) selection for crouch control.\n2. Role of serial casting protocol combined with Botulinum Toxin-A (Botox) injections.\n3. Facilitating hip extensor (gluteus maximus) and quadriceps power during play-based functional training.',
          takeaway: 'Standard Clinical Consensus: In GMFCS Level II crouch gait, Ground Reaction AFOs (GRAFO) create an extension moment at the knee during midstance by blocking ankle dorsiflexion, preventing further quad fatigue.',
          author_name: 'Dr. Aarti Tiwari, MPT (Pediatrics)',
          author_role: 'Pediatric Specialist',
          is_pinned: 0,
          upvotes: 28
        },
        {
          category: 'research',
          tag_label: 'Evidence-Based Practice & Research',
          title: 'Systematic Review & Meta-Analysis Critique: PEDro Scale Assessment & Forest Plot Interpretation',
          summary: 'Step-by-step guide to appraising clinical trials, risk of bias, confidence intervals, and Odds Ratios in physiotherapy intervention studies.',
          questions: '1. How to interpret heterogeneity (I² statistic > 50%) in meta-analyses.\n2. PEDro scale 11-point item criteria for clinical trial validity.\n3. Intention-to-treat (ITT) vs Per-protocol analysis.',
          takeaway: 'Standard Research Consensus: Rigorous EBP requires assessing methodological quality via PEDro scale (score >= 6/10) and evaluating forest plot I² statistics before translating trial findings to clinical practice.',
          author_name: 'Dr. Vikram Joshi, PhD (Research)',
          author_role: 'Research Director',
          is_pinned: 0,
          upvotes: 31
        }
      ];

      for (const d of defaultDiscussions) {
        const existing = await db.prepare(`SELECT id FROM live_discussions WHERE title = ?`).get(d.title);
        if (!existing) {
          const info = await db.prepare(`
            INSERT INTO live_discussions (category, tag_label, title, summary, questions, takeaway, author_name, author_role, is_pinned, upvotes, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1) RETURNING id
          `).run(d.category, d.tag_label, d.title, d.summary, d.questions, d.takeaway, d.author_name, d.author_role, d.is_pinned, d.upvotes);

          if (d.category === 'orthopedics') {
            await db.prepare(`
              INSERT INTO live_discussion_replies (discussion_id, author_name, author_role, content, is_mentor)
              VALUES (?, 'Pooja Sharma', 'MPT Neuro', 'We also use biofeedback EMG training with prone hangs for full hyperextension symmetry before starting heavy squats.', 1)
            `).run(info.lastInsertRowid);
            await db.prepare(`
              INSERT INTO live_discussion_replies (discussion_id, author_name, author_role, content, is_mentor)
              VALUES (?, 'Rohan Mehta', 'BPT Intern', 'Is patellar taping (McConnell technique) beneficial here for offloading the superior patellar pole during mini-squats?', 0)
            `).run(info.lastInsertRowid);
          }
        }
      }
    }
  },

  async all({ category, search, activeOnly = false, includeReplies = true } = {}) {
    await this.initTable();
    let sql = `
      SELECT ld.*,
        (SELECT COUNT(*) FROM live_discussion_replies WHERE discussion_id = ld.id) as replies_count
      FROM live_discussions ld
      WHERE 1=1
    `;
    const params = [];

    if (activeOnly) {
      sql += ` AND ld.is_active = 1`;
    }
    if (category && category !== 'all') {
      sql += ` AND ld.category = ?`;
      params.push(category);
    }
    if (search) {
      sql += ` AND (ld.title ILIKE ? OR ld.summary ILIKE ? OR ld.questions ILIKE ? OR ld.category ILIKE ?)`;
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ` ORDER BY ld.is_pinned DESC, ld.created_at DESC`;
    const rows = await db.prepare(sql).all(...params);

    if (includeReplies && rows.length > 0) {
      const allReplies = await db.prepare(`
        SELECT r.*, p.author_name as parent_author_name
        FROM live_discussion_replies r
        LEFT JOIN live_discussion_replies p ON r.parent_id = p.id
        ORDER BY r.created_at ASC, r.id ASC
      `).all();
      const replyMap = {};
      (allReplies || []).forEach(rep => {
        if (!replyMap[rep.discussion_id]) replyMap[rep.discussion_id] = [];
        replyMap[rep.discussion_id].push(rep);
      });

      return rows.map(r => {
        const flat = replyMap[r.id] || [];
        const tree = buildReplyTree(flat);
        return {
          ...r,
          replies_count: flat.length,
          replies: tree
        };
      });
    }

    return rows.map(r => ({
      ...r,
      replies_count: Number(r.replies_count || 0),
      replies: []
    }));
  },

  async findById(id) {
    await this.initTable();
    const row = await db.prepare(`SELECT * FROM live_discussions WHERE id = ?`).get(id);
    if (!row) return null;
    const flatReplies = await db.prepare(`
      SELECT r.*, p.author_name as parent_author_name
      FROM live_discussion_replies r
      LEFT JOIN live_discussion_replies p ON r.parent_id = p.id
      WHERE r.discussion_id = ?
      ORDER BY r.created_at ASC, r.id ASC
    `).all(id);
    return {
      ...row,
      replies_count: (flatReplies || []).length,
      replies: buildReplyTree(flatReplies || [])
    };
  },

  async create(data) {
    await this.initTable();
    const info = await db.prepare(`
      INSERT INTO live_discussions (
        category, tag_label, title, summary, questions, takeaway,
        author_name, author_role, author_id, is_active, is_pinned
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(
      data.category || 'orthopedics',
      data.tag_label || 'Clinical Case Round',
      data.title,
      data.summary,
      data.questions,
      data.takeaway || null,
      data.author_name || 'Admin Faculty',
      data.author_role || 'Faculty / Clinician',
      data.author_id || null,
      data.is_active === 0 || data.is_active === '0' ? 0 : 1,
      data.is_pinned === 1 || data.is_pinned === '1' ? 1 : 0
    );
    return this.findById(info.lastInsertRowid);
  },

  async update(id, data) {
    await this.initTable();
    await db.prepare(`
      UPDATE live_discussions SET
        category = COALESCE(?, category),
        tag_label = COALESCE(?, tag_label),
        title = COALESCE(?, title),
        summary = COALESCE(?, summary),
        questions = COALESCE(?, questions),
        takeaway = COALESCE(?, takeaway),
        author_name = COALESCE(?, author_name),
        author_role = COALESCE(?, author_role),
        is_active = COALESCE(?, is_active),
        is_pinned = COALESCE(?, is_pinned),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.category,
      data.tag_label,
      data.title,
      data.summary,
      data.questions,
      data.takeaway,
      data.author_name,
      data.author_role,
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : null,
      data.is_pinned !== undefined ? (data.is_pinned ? 1 : 0) : null,
      id
    );
    return this.findById(id);
  },

  async toggleActive(id) {
    await this.initTable();
    const item = await this.findById(id);
    if (!item) return null;
    const newStatus = item.is_active ? 0 : 1;
    await db.prepare(`UPDATE live_discussions SET is_active = ? WHERE id = ?`).run(newStatus, id);
    return newStatus;
  },

  async togglePinned(id) {
    await this.initTable();
    const item = await this.findById(id);
    if (!item) return null;
    const newStatus = item.is_pinned ? 0 : 1;
    await db.prepare(`UPDATE live_discussions SET is_pinned = ? WHERE id = ?`).run(newStatus, id);
    return newStatus;
  },

  async delete(id) {
    await this.initTable();
    await db.prepare(`DELETE FROM live_discussion_replies WHERE discussion_id = ?`).run(id);
    await db.prepare(`DELETE FROM live_discussions WHERE id = ?`).run(id);
  },

  async addReply(discussionId, { userId, authorName, authorRole, content, isMentor = 0, parentId = null }) {
    await this.initTable();
    let validParentId = null;
    let parentAuthorName = null;
    if (parentId) {
      const parent = await db.prepare(`SELECT id, discussion_id, author_name FROM live_discussion_replies WHERE id = ?`).get(parentId);
      if (parent && String(parent.discussion_id) === String(discussionId)) {
        validParentId = parent.id;
        parentAuthorName = parent.author_name;
      }
    }

    const info = await db.prepare(`
      INSERT INTO live_discussion_replies (discussion_id, parent_id, user_id, author_name, author_role, content, is_mentor, upvotes)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0) RETURNING id
    `).run(discussionId, validParentId, userId || null, authorName, authorRole || 'Student Member', content, isMentor ? 1 : 0);
    
    const row = await db.prepare(`SELECT * FROM live_discussion_replies WHERE id = ?`).get(info.lastInsertRowid);
    return {
      ...row,
      parent_author_name: parentAuthorName,
      replies: []
    };
  },

  async deleteReply(replyId) {
    await this.initTable();
    await db.prepare(`DELETE FROM live_discussion_replies WHERE id = ?`).run(replyId);
  },

  async voteReply(replyId, { action, previousState } = {}) {
    await this.initTable();
    const reply = await db.prepare(`SELECT upvotes, downvotes FROM live_discussion_replies WHERE id = ?`).get(replyId);
    if (!reply) return { upvotes: 0, downvotes: 0 };

    let upvotes = Number(reply.upvotes || 0);
    let downvotes = Number(reply.downvotes || 0);

    if (action === 'like') {
      upvotes += 1;
      if (previousState === 'disliked' && downvotes > 0) {
        downvotes -= 1;
      }
    } else if (action === 'unlike') {
      if (upvotes > 0) upvotes -= 1;
    } else if (action === 'dislike') {
      downvotes += 1;
      if (previousState === 'liked' && upvotes > 0) {
        upvotes -= 1;
      }
    } else if (action === 'undislike') {
      if (downvotes > 0) downvotes -= 1;
    }

    await db.prepare(`UPDATE live_discussion_replies SET upvotes = ?, downvotes = ? WHERE id = ?`).run(upvotes, downvotes, replyId);
    return { upvotes, downvotes };
  },

  async upvoteReply(replyId) {
    const res = await this.voteReply(replyId, { action: 'like' });
    return res.upvotes;
  },

  async vote(id, { action, previousState } = {}) {
    await this.initTable();
    const disc = await db.prepare(`SELECT upvotes, downvotes FROM live_discussions WHERE id = ?`).get(id);
    if (!disc) return { upvotes: 0, downvotes: 0 };

    let upvotes = Number(disc.upvotes || 0);
    let downvotes = Number(disc.downvotes || 0);

    if (action === 'like') {
      upvotes += 1;
      if (previousState === 'disliked' && downvotes > 0) {
        downvotes -= 1;
      }
    } else if (action === 'unlike') {
      if (upvotes > 0) upvotes -= 1;
    } else if (action === 'dislike') {
      downvotes += 1;
      if (previousState === 'liked' && upvotes > 0) {
        upvotes -= 1;
      }
    } else if (action === 'undislike') {
      if (downvotes > 0) downvotes -= 1;
    }

    await db.prepare(`UPDATE live_discussions SET upvotes = ?, downvotes = ? WHERE id = ?`).run(upvotes, downvotes, id);
    return { upvotes, downvotes };
  },

  async upvote(id) {
    const res = await this.vote(id, { action: 'like' });
    return res.upvotes;
  }
};

function buildReplyTree(flatReplies) {
  if (!flatReplies || flatReplies.length === 0) return [];

  const map = {};
  const tree = [];

  flatReplies.forEach(rep => {
    map[rep.id] = {
      ...rep,
      replies: []
    };
  });

  flatReplies.forEach(rep => {
    const node = map[rep.id];
    if (rep.parent_id && map[rep.parent_id]) {
      map[rep.parent_id].replies.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}

module.exports = LiveDiscussion;
