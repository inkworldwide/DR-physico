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
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        author_name TEXT NOT NULL,
        author_role TEXT,
        content TEXT NOT NULL,
        is_mentor INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // Check count and seed default discussions if empty
    const countRow = await db.prepare(`SELECT COUNT(*) as c FROM live_discussions`).get();
    if (Number(countRow ? countRow.c : 0) === 0) {
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
          takeaway: 'Standard Clinical Consensus: Overhead reciprocating pulleys are strictly contraindicated in flaccid hemiplegia due to high risk of subacromial impingement and complex regional pain syndrome (CRPS). FES applied to posterior deltoid and supraspinatus for 30–60 minutes daily significantly reduces sulcus depth. Dynamic shoulder strapping (e.g. GivMohr or Kinesio taping) should replace rigid slings during transfer training.',
          author_name: 'Dr. Varun Nair, MPT (Neuro)',
          author_role: 'Neuro Specialist',
          is_pinned: 1,
          upvotes: 31
        },
        {
          category: 'cardiopulmonary',
          tag_label: 'ICU Protocols',
          title: 'Post-CABG Day-2 Left Basilar Atelectasis with Sternotomy Precautions',
          summary: 'A 59-year-old diabetic male Day 2 post-triple vessel CABG extubated onto 2L nasal prongs. SpO2 91%, shallow breathing rate 26/min. Auscultation reveals coarse crackles with decreased air entry in left lower zone.',
          questions: '1. Is high-pressure manual chest clapping safe with fresh median sternotomy wires?\n2. How does Active Cycle of Breathing Techniques (ACBT) with sternal pillow support compare with incentive spirometry?\n3. Criteria for initiating progressive bed-to-chair dangling and early hallway ambulation?',
          takeaway: 'Standard Clinical Consensus: Direct chest clapping over or adjacent to median sternotomy is contraindicated in acute phase. ACBT utilizing thoracic expansion exercises (TEE) with a 3-second inspiratory hold and self-splinted huffing (pillow hug) promotes collateral ventilation through Channels of Martin and Pores of Kohn without increasing sternal shear force. Early upright edge-of-bed sitting immediately improves Functional Residual Capacity (FRC) by 20–30%.',
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
          takeaway: 'Standard Clinical Consensus (Cook & Purdam Continuum Model): Tendon pathology is characterized by tenocyte proliferation and matrix disorganization without acute inflammatory cells. High-load isometric holds reduce cortical inhibition and provide 4-6 hours of analgesia. HSR (3 sets of 6–8 reps, 3-second concentric, 3-second eccentric, 3x/week) maximizes tendon stiffness and mechanotransduction.',
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
          takeaway: 'Viva Reference Points: True radiculopathy demonstrates positive Slump test, dermatomal sensory changes (L5 dorsum of foot / S1 lateral border), and myotomal weakness (extensor hallucis longus or calf). Piriformis syndrome reproduces sciatic pain during FAIR test or resisted abduction in seated position (Pace\'s sign) with normal spine ROM. SI Joint dysfunction requires at least 2 of 4 positive Laslett provocation tests without centralization during McKenzie mechanical extension.',
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
          takeaway: 'Standard Clinical Consensus: In GMFCS Level II crouch gait, Ground Reaction AFOs (GRAFO) create an extension moment at the knee during midstance by blocking ankle dorsiflexion, preventing further quad fatigue. Solid AFOs are utilized when dynamic ankle control is insufficient. Task-specific functional strength training and treadmill with partial body-weight support yield superior motor outcomes over isolated passive stretching.',
          author_name: 'Dr. Aarti Tiwari, MPT (Pediatrics)',
          author_role: 'Pediatric Specialist',
          is_pinned: 0,
          upvotes: 28
        }
      ];

      for (const d of defaultDiscussions) {
        const info = await db.prepare(`
          INSERT INTO live_discussions (category, tag_label, title, summary, questions, takeaway, author_name, author_role, is_pinned, upvotes, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1) RETURNING id
        `).run(d.category, d.tag_label, d.title, d.summary, d.questions, d.takeaway, d.author_name, d.author_role, d.is_pinned, d.upvotes);

        // Seed 1-2 default replies
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
      const allReplies = await db.prepare(`SELECT * FROM live_discussion_replies ORDER BY created_at DESC`).all();
      const replyMap = {};
      (allReplies || []).forEach(rep => {
        if (!replyMap[rep.discussion_id]) replyMap[rep.discussion_id] = [];
        replyMap[rep.discussion_id].push(rep);
      });

      return rows.map(r => ({
        ...r,
        replies_count: Number(r.replies_count || 0),
        replies: replyMap[r.id] || []
      }));
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
    const replies = await db.prepare(`
      SELECT * FROM live_discussion_replies WHERE discussion_id = ? ORDER BY created_at DESC
    `).all(id);
    return {
      ...row,
      replies: replies || []
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

  async addReply(discussionId, { userId, authorName, authorRole, content, isMentor = 0 }) {
    await this.initTable();
    const info = await db.prepare(`
      INSERT INTO live_discussion_replies (discussion_id, user_id, author_name, author_role, content, is_mentor)
      VALUES (?, ?, ?, ?, ?, ?) RETURNING id
    `).run(discussionId, userId || null, authorName, authorRole || 'Student Member', content, isMentor ? 1 : 0);
    return db.prepare(`SELECT * FROM live_discussion_replies WHERE id = ?`).get(info.lastInsertRowid);
  },

  async deleteReply(replyId) {
    await this.initTable();
    await db.prepare(`DELETE FROM live_discussion_replies WHERE id = ?`).run(replyId);
  },

  async upvote(id) {
    await this.initTable();
    await db.prepare(`UPDATE live_discussions SET upvotes = upvotes + 1 WHERE id = ?`).run(id);
    const row = await db.prepare(`SELECT upvotes FROM live_discussions WHERE id = ?`).get(id);
    return row ? row.upvotes : 0;
  }
};

module.exports = LiveDiscussion;
