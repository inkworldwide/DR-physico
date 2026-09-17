const db = require('../db/connection');

// ============ NOTES ============
const Notes = {
  async byCategory(categoryId) {
    let notes = await db.prepare(`SELECT * FROM notes WHERE category_id = ? ORDER BY position, id`).all(categoryId);
    if (!notes || notes.length === 0) {
      const cat = await db.prepare(`SELECT * FROM categories WHERE id = ?`).get(categoryId);
      if (cat) {
        notes = await db.prepare(`
          SELECT n.* FROM notes n
          JOIN categories c ON n.category_id = c.id
          WHERE c.slug = ? OR c.name LIKE ?
          ORDER BY n.position, n.id
        `).all(cat.slug, `%${cat.name}%`);
      }
    }
    return notes || [];
  },
  async byYear(year) {
    return db.prepare(`
      SELECT n.*, c.name as subject_name, c.slug as subject_slug
      FROM notes n JOIN categories c ON n.category_id = c.id
      WHERE n.year = ?
      ORDER BY c.name, n.position
    `).all(year);
  },
  async findById(id) {
    return db.prepare(`SELECT n.*, c.name as subject_name FROM notes n JOIN categories c ON n.category_id = c.id WHERE n.id = ?`).get(id);
  },
  async create({ category_id, course_id, title, content, file_url, year, created_by }) {
    const cleanFileUrl = (file_url && file_url !== '/images/logo-icon.png') ? file_url : null;
    const posRow = await db.prepare(`SELECT COALESCE(MAX(position)+1,0) as p FROM notes WHERE category_id = ?`).get(category_id);
    const pos = posRow ? posRow.p : 0;
    const info = await db.prepare(`
      INSERT INTO notes (category_id, course_id, title, content, file_url, year, position, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(category_id, course_id || null, title || 'Uploaded Study Note', content || '', cleanFileUrl, year || 1, pos, created_by || null);
    return this.findById(info.lastInsertRowid);
  },
  async delete(id) {
    await db.prepare(`DELETE FROM notes WHERE id = ?`).run(id);
  }
};

// ============ TEAM MEMBERS ============
const Team = {
  async byGroup(group) {
    return db.prepare(`SELECT * FROM team_members WHERE group_name = ? AND is_active = 1 ORDER BY display_order, id`).all(group);
  },
  async featuredHomepage() {
    return db.prepare(`SELECT * FROM team_members WHERE is_active = 1 ORDER BY display_order ASC, id ASC LIMIT 4`).all();
  },
  async aboutStatements() {
    return db.prepare(`SELECT * FROM team_members WHERE show_on_about = 1 AND is_active = 1 ORDER BY display_order, id`).all();
  },
  async all() {
    return db.prepare(`SELECT * FROM team_members ORDER BY display_order ASC, id ASC`).all();
  },
  async findById(id) {
    return db.prepare(`SELECT * FROM team_members WHERE id = ?`).get(id);
  },
  async normalizePositions() {
    const members = await db.prepare(`SELECT id FROM team_members ORDER BY display_order ASC, id ASC`).all();
    for (let i = 0; i < members.length; i++) {
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(i + 1, members[i].id);
    }
  },
  async normalizeAllGroupPositions() {
    await this.normalizePositions();
  },
  async create(data) {
    const groupName = data.group_name || 'founding';
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    
    await db.prepare(`UPDATE team_members SET display_order = display_order + 1 WHERE display_order >= ?`).run(targetOrder);

    const roleVal = data.role || data.designation || 'Faculty';
    const desigVal = data.designation || data.role || 'Faculty';

    const merged = { photo: '/images/team/default-avatar.png', display_order: targetOrder, show_on_about: 0, statement: '', ...data, role: roleVal, designation: desigVal };
    const info = await db.prepare(`
      INSERT INTO team_members (name, role, designation, qualification, photo, bio, group_name, display_order, show_on_about, statement)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(merged.name, merged.role, merged.designation, merged.qualification || '', merged.photo, merged.bio || '', groupName, targetOrder, merged.show_on_about ? 1 : 0, merged.statement);

    await this.normalizePositions();
    return db.prepare(`SELECT * FROM team_members WHERE id = ?`).get(info.lastInsertRowid);
  },
  async toggleAboutShow(id) {
    const member = await this.findById(id);
    if (!member) return null;
    const newStatus = member.show_on_about ? 0 : 1;
    await db.prepare(`UPDATE team_members SET show_on_about = ? WHERE id = ?`).run(newStatus, id);
    return newStatus;
  },
  async toggleActive(id) {
    const member = await this.findById(id);
    if (!member) return null;
    const newStatus = member.is_active ? 0 : 1;
    await db.prepare(`UPDATE team_members SET is_active = ? WHERE id = ?`).run(newStatus, id);
    return newStatus;
  },
  async update(id, data) {
    const existing = await this.findById(id);
    const targetGroup = data.group_name || (existing ? existing.group_name : 'founding');
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);

    if (existing && existing.display_order !== targetOrder) {
      await db.prepare(`UPDATE team_members SET display_order = display_order + 1 WHERE display_order >= ? AND id != ?`).run(targetOrder, id);
    }

    const roleVal = data.role || data.designation || (existing ? existing.role : 'Faculty');
    const desigVal = data.designation || data.role || (existing ? existing.designation : 'Faculty');

    await db.prepare(`
      UPDATE team_members
      SET name = ?, role = ?, designation = ?, qualification = ?, photo = ?, bio = ?, group_name = ?, display_order = ?, show_on_about = ?, statement = ?
      WHERE id = ?
    `).run(
      data.name, roleVal, desigVal, data.qualification || '',
      data.photo || '/images/team/default-avatar.png', data.bio || '',
      targetGroup, targetOrder,
      data.show_on_about ? 1 : 0, data.statement || '', id
    );

    await this.normalizePositions();
  },
  async delete(id) {
    await db.prepare(`DELETE FROM team_members WHERE id = ?`).run(id);
    await this.normalizePositions();
  },
  async moveUp(id) {
    const current = await this.findById(id);
    if (!current) return;
    const prev = await db.prepare(`SELECT * FROM team_members WHERE group_name = ? AND display_order <= ? AND id != ? ORDER BY display_order DESC, id DESC LIMIT 1`).get(current.group_name, current.display_order, current.id);
    if (prev) {
      const tempOrder = current.display_order;
      const targetOrder = prev.display_order === current.display_order ? Math.max(1, current.display_order - 1) : prev.display_order;
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(targetOrder, current.id);
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(tempOrder, prev.id);
    } else {
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(Math.max(1, current.display_order - 1), current.id);
    }
    await this.normalizePositions(current.group_name);
  },
  async moveDown(id) {
    const current = await this.findById(id);
    if (!current) return;
    const next = await db.prepare(`SELECT * FROM team_members WHERE group_name = ? AND display_order >= ? AND id != ? ORDER BY display_order ASC, id ASC LIMIT 1`).get(current.group_name, current.display_order, current.id);
    if (next) {
      const tempOrder = current.display_order;
      const targetOrder = next.display_order === current.display_order ? current.display_order + 1 : next.display_order;
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(targetOrder, current.id);
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(tempOrder, next.id);
    } else {
      await db.prepare(`UPDATE team_members SET display_order = ? WHERE id = ?`).run(current.display_order + 1, current.id);
    }
    await this.normalizePositions(current.group_name);
  }
};

// ============ BLOG ============
const Blog = {
  async published({ type } = {}) {
    if (type) return db.prepare(`SELECT b.*, u.name as author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.status='published' AND b.post_type=? ORDER BY b.published_at DESC`).all(type);
    return db.prepare(`SELECT b.*, u.name as author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.status='published' ORDER BY b.published_at DESC`).all();
  },
  async findBySlug(slug) {
    return db.prepare(`SELECT b.*, u.name as author_name, u.avatar as author_avatar FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id WHERE b.slug = ?`).get(slug);
  },
  async all() {
    return db.prepare(`SELECT b.*, u.name as author_name FROM blog_posts b LEFT JOIN users u ON b.author_id = u.id ORDER BY b.created_at DESC`).all();
  },
  async create(data) {
    const slug = data.title.toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-') + '-' + Date.now().toString().slice(-5);
    const merged = {
      cover_image: '/images/blog/default-cover.jpg',
      published_at: data.status === 'published' ? new Date().toISOString() : null,
      ...data, slug
    };
    const info = await db.prepare(`
      INSERT INTO blog_posts (title, slug, excerpt, content, cover_image, post_type, author_id, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(merged.title, merged.slug, merged.excerpt, merged.content, merged.cover_image, merged.post_type, merged.author_id, merged.status, merged.published_at);
    return db.prepare(`SELECT * FROM blog_posts WHERE id = ?`).get(info.lastInsertRowid);
  },
  async delete(id) {
    await db.prepare(`DELETE FROM blog_posts WHERE id = ?`).run(id);
  }
};

// ============ LIVE SESSIONS ============
const LiveSessions = {
  async upcoming() {
    return db.prepare(`
      SELECT ls.*, u.name as host_name, c.name as subject_name,
        (SELECT COUNT(*) FROM live_session_registrations WHERE session_id = ls.id) as registered_count
      FROM live_sessions ls
      LEFT JOIN users u ON ls.host_id = u.id
      LEFT JOIN categories c ON ls.category_id = c.id
      WHERE ls.status = 'scheduled' AND ls.scheduled_at >= CURRENT_TIMESTAMP
      ORDER BY ls.scheduled_at ASC
    `).all();
  },
  async byType(type) {
    return db.prepare(`
      SELECT ls.*, u.name as host_name, c.name as subject_name
      FROM live_sessions ls
      LEFT JOIN users u ON ls.host_id = u.id
      LEFT JOIN categories c ON ls.category_id = c.id
      WHERE ls.session_type = ? ORDER BY ls.scheduled_at DESC
    `).all(type);
  },
  async findById(id) {
    return db.prepare(`
      SELECT ls.*, u.name as host_name, c.name as subject_name
      FROM live_sessions ls
      LEFT JOIN users u ON ls.host_id = u.id
      LEFT JOIN categories c ON ls.category_id = c.id
      WHERE ls.id = ?
    `).get(id);
  },
  async all() {
    return db.prepare(`SELECT ls.*, u.name as host_name FROM live_sessions ls LEFT JOIN users u ON ls.host_id = u.id ORDER BY ls.scheduled_at DESC`).all();
  },
  async create(data) {
    const merged = { status: 'scheduled', zoom_meeting_id: null, zoom_join_url: null, zoom_start_url: null, ...data };
    const info = await db.prepare(`
      INSERT INTO live_sessions (title, description, session_type, category_id, host_id, scheduled_at, duration_minutes, zoom_meeting_id, zoom_join_url, zoom_start_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(merged.title, merged.description, merged.session_type, merged.category_id, merged.host_id, merged.scheduled_at,
      merged.duration_minutes, merged.zoom_meeting_id, merged.zoom_join_url, merged.zoom_start_url, merged.status);
    return this.findById(info.lastInsertRowid);
  },
  async attachZoomMeeting(id, { zoomMeetingId, joinUrl, startUrl }) {
    await db.prepare(`UPDATE live_sessions SET zoom_meeting_id=?, zoom_join_url=?, zoom_start_url=? WHERE id=?`).run(zoomMeetingId, joinUrl, startUrl, id);
  },
  async delete(id) {
    await db.prepare(`DELETE FROM live_sessions WHERE id = ?`).run(id);
  },
  async register(sessionId, userId) {
    await db.prepare(`INSERT INTO live_session_registrations (session_id, user_id) VALUES (?, ?) ON CONFLICT (session_id, user_id) DO NOTHING`).run(sessionId, userId);
  },
  async isRegistered(sessionId, userId) {
    const row = await db.prepare(`SELECT 1 as x FROM live_session_registrations WHERE session_id=? AND user_id=?`).get(sessionId, userId);
    return !!row;
  },
  async registrants(sessionId) {
    return db.prepare(`
      SELECT r.*, u.name, u.email, u.phone FROM live_session_registrations r
      JOIN users u ON r.user_id = u.id WHERE r.session_id = ?
    `).all(sessionId);
  }
};

// ============ HERO FEATURES ============
const HeroFeature = {
  async allActive() {
    return db.prepare(`SELECT * FROM hero_features WHERE is_active = 1 ORDER BY display_order ASC, id ASC`).all();
  },
  async all() {
    return db.prepare(`SELECT * FROM hero_features ORDER BY display_order ASC, id ASC`).all();
  },
  async findById(id) {
    return db.prepare(`SELECT * FROM hero_features WHERE id = ?`).get(id);
  },
  async normalizePositions() {
    const items = await db.prepare(`SELECT id FROM hero_features ORDER BY display_order ASC, id ASC`).all();
    for (let i = 0; i < items.length; i++) {
      await db.prepare(`UPDATE hero_features SET display_order = ? WHERE id = ?`).run(i + 1, items[i].id);
    }
  },
  async create(data) {
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    await db.prepare(`UPDATE hero_features SET display_order = display_order + 1 WHERE display_order >= ?`).run(targetOrder);
    const info = await db.prepare(`
      INSERT INTO hero_features (title, subtitle, icon, url, badge_color, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(
      data.title, data.subtitle || '', data.icon || 'ri-star-line',
      data.url || '/courses', data.badge_color || 'warning',
      targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1
    );
    await this.normalizePositions();
    return db.prepare(`SELECT * FROM hero_features WHERE id = ?`).get(info.lastInsertRowid);
  },
  async update(id, data) {
    const existing = await this.findById(id);
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    if (existing && existing.display_order !== targetOrder) {
      await db.prepare(`UPDATE hero_features SET display_order = display_order + 1 WHERE display_order >= ? AND id != ?`).run(targetOrder, id);
    }
    await db.prepare(`
      UPDATE hero_features
      SET title = ?, subtitle = ?, icon = ?, url = ?, badge_color = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      data.title, data.subtitle || '', data.icon || 'ri-star-line',
      data.url || '/courses', data.badge_color || 'warning',
      targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1, id
    );
    await this.normalizePositions();
  },
  async delete(id) {
    await db.prepare(`DELETE FROM hero_features WHERE id = ?`).run(id);
    await this.normalizePositions();
  }
};

// ============ CLINICAL SPECIALTIES ============
const ClinicalSpecialty = {
  formatCard(row) {
    if (!row) return null;
    let itemsArr = [];
    if (typeof row.items === 'string') {
      itemsArr = row.items.split(/[\n,]+/).map(i => i.trim()).filter(Boolean);
    } else if (Array.isArray(row.items)) {
      itemsArr = row.items;
    }
    return {
      ...row,
      items: itemsArr,
      itemsRaw: row.items
    };
  },
  async allActive() {
    const rows = await db.prepare(`SELECT * FROM clinical_specialties WHERE is_active = 1 ORDER BY display_order ASC, id ASC`).all();
    return rows.map(r => this.formatCard(r));
  },
  async all() {
    const rows = await db.prepare(`SELECT * FROM clinical_specialties ORDER BY display_order ASC, id ASC`).all();
    return rows.map(r => this.formatCard(r));
  },
  async findById(id) {
    const row = await db.prepare(`SELECT * FROM clinical_specialties WHERE id = ?`).get(id);
    return this.formatCard(row);
  },
  async normalizePositions() {
    const items = await db.prepare(`SELECT id FROM clinical_specialties ORDER BY display_order ASC, id ASC`).all();
    for (let i = 0; i < items.length; i++) {
      await db.prepare(`UPDATE clinical_specialties SET display_order = ? WHERE id = ?`).run(i + 1, items[i].id);
    }
  },
  async create(data) {
    const slug = (data.slug || data.name).toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    await db.prepare(`UPDATE clinical_specialties SET display_order = display_order + 1 WHERE display_order >= ?`).run(targetOrder);

    // Auto non-repeating theme palette
    const PALETTE = ['primary', 'success', 'warning', 'danger', 'info', 'purple', 'indigo', 'teal', 'orange'];
    const count = Number((await db.prepare(`SELECT COUNT(*) as c FROM clinical_specialties`).get()).c);
    const autoTheme = data.theme || PALETTE[count % PALETTE.length];

    // Smart contextual icon resolver
    let autoIcon = data.icon;
    if (!autoIcon || autoIcon === 'ri-stethoscope-fill') {
      const n = (data.name || '').toLowerCase();
      if (n.includes('surgery') || n.includes('surgical')) autoIcon = 'ri-hospital-line';
      else if (n.includes('geriatric') || n.includes('elderly') || n.includes('senior')) autoIcon = 'ri-user-heart-line';
      else if (n.includes('pain') || n.includes('chronic') || n.includes('spine')) autoIcon = 'ri-mental-health-line';
      else if (n.includes('ortho') || n.includes('sports') || n.includes('injury')) autoIcon = 'ri-run-line';
      else if (n.includes('pediatric') || n.includes('child') || n.includes('baby')) autoIcon = 'ri-bear-smile-line';
      else if (n.includes('neuro') || n.includes('brain') || n.includes('stroke')) autoIcon = 'ri-brain-line';
      else if (n.includes('cardio') || n.includes('chest')) autoIcon = 'ri-heart-pulse-fill';
      else autoIcon = 'ri-stethoscope-fill';
    }

    const info = await db.prepare(`
      INSERT INTO clinical_specialties (name, slug, icon, badge, theme, items, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(
      data.name, slug, autoIcon,
      data.badge || 'Clinical', autoTheme,
      data.items || '', targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1
    );
    await this.normalizePositions();
    return this.findById(info.lastInsertRowid);
  },
  async update(id, data) {
    const existing = await this.findById(id);
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    const slug = (data.slug || data.name).toString().toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
    if (existing && existing.display_order !== targetOrder) {
      await db.prepare(`UPDATE clinical_specialties SET display_order = display_order + 1 WHERE display_order >= ? AND id != ?`).run(targetOrder, id);
    }
    await db.prepare(`
      UPDATE clinical_specialties
      SET name = ?, slug = ?, icon = ?, badge = ?, theme = ?, items = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      data.name, slug, data.icon || 'ri-stethoscope-fill',
      data.badge || 'Clinical', data.theme || 'primary',
      data.items || '', targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1, id
    );
    await this.normalizePositions();
  },
  async toggleActive(id) {
    const existing = await this.findById(id);
    if (!existing) return;
    const newStatus = existing.is_active ? 0 : 1;
    await db.prepare(`UPDATE clinical_specialties SET is_active = ? WHERE id = ?`).run(newStatus, id);
  },
  async delete(id) {
    await db.prepare(`DELETE FROM clinical_specialties WHERE id = ?`).run(id);
    await this.normalizePositions();
  }
};

// ============ SITE SETTINGS (VISION & MISSION) ============
const SiteSettings = {
  async initTable() {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run();
  },
  async get(key, defaultValue = '') {
    await this.initTable();
    const row = await db.prepare(`SELECT value FROM site_settings WHERE key = ?`).get(key);
    return row ? row.value : defaultValue;
  },
  async set(key, value) {
    await this.initTable();
    await db.prepare(`
      INSERT INTO site_settings (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, value);
  },
  async getVisionMission() {
    const vision = await this.get('our_vision', 'To become the one-stop educational destination for physiotherapy students across India — making advanced, clinically-relevant physiotherapy education accessible to every student, regardless of which college they attend.');
    const mission = await this.get('our_mission', '"Help students to help themselves." We build structured notes, digital library content, live discussions, and research resources that empower physiotherapy students to learn independently and confidently, year after year.');
    return { vision, mission };
  },
  async updateVisionMission(vision, mission) {
    await this.set('our_vision', vision);
    await this.set('our_mission', mission);
  },
  async isGroupEnabled(groupName, defaultVal = 1) {
    const key = `team_group_enabled_${groupName}`;
    const val = await this.get(key, defaultVal.toString());
    return val === '1';
  },
  async setGroupEnabled(groupName, enabled) {
    const key = `team_group_enabled_${groupName}`;
    await this.set(key, enabled ? '1' : '0');
  },
  async getTeamGroupStatuses() {
    return {
      teaching_staff: await this.isGroupEnabled('teaching_staff', 1),
      non_teaching_staff: await this.isGroupEnabled('non_teaching_staff', 1),
      subject_experts: await this.isGroupEnabled('subject_experts', 1),
      technical_assistance: await this.isGroupEnabled('technical_assistance', 1),
      other_staff: await this.isGroupEnabled('other_staff', 1)
    };
  },
  async updateTeamGroupStatuses(statuses) {
    const groups = ['teaching_staff', 'non_teaching_staff', 'subject_experts', 'technical_assistance', 'other_staff'];
    for (const g of groups) {
      await this.setGroupEnabled(g, !!statuses[g]);
    }
  },
  async getHeroSettings() {
    const badgeText = await this.get('hero_badge_text', '#1 Platform for BPT Students & Physios');
    const badgeIcon = await this.get('hero_badge_icon', 'ri-heart-pulse-fill');
    const titlePrefix = await this.get('hero_title_prefix', 'Advanced Physiotherapy Education,');
    const titleHighlight = await this.get('hero_title_highlight', 'All in One Place.');
    const subtext = await this.get('hero_subtext', 'Master your BPT degree with expert-led Seminars, HD Recorded Videos, interactive Workshops, real-time Live Classes, and 100% Free Courses.');
    const imageUrl = await this.get('hero_image_url', '/images/hero_physio_education.jpg');
    const tickerEnabled = await this.get('hero_ticker_enabled', '1');
    const tickerCustomSubjects = await this.get('hero_ticker_custom_subjects', '');
    const trustBarEnabled = await this.get('hero_trust_bar_enabled', '1');
    const defaultTrustItems = JSON.stringify([
      { icon: 'ri-megaphone-line', text: 'Quick Revision' },
      { icon: 'ri-book-open-line', text: 'Examination Preparation' },
      { icon: 'ri-stack-line', text: 'Subject-wise Learning' },
      { icon: 'ri-settings-4-line', text: 'Clinical Application' },
      { icon: 'ri-file-text-line', text: 'Evidence-Informed Answers' },
      { icon: 'ri-focus-3-line', text: 'Aligned with Indian Physiotherapy Curriculum' }
    ]);
    const rawTrustItems = await this.get('hero_trust_bar_items', defaultTrustItems);
    let trustBarItems = [];
    try {
      trustBarItems = JSON.parse(rawTrustItems);
    } catch (e) {
      trustBarItems = JSON.parse(defaultTrustItems);
    }

    const tickerSpeed = parseInt(await this.get('hero_ticker_speed', '110'), 10) || 110;
    const trustBarSpeed = parseInt(await this.get('hero_trust_bar_speed', '55'), 10) || 55;

    return {
      badgeText,
      badgeIcon,
      titlePrefix,
      titleHighlight,
      subtext,
      imageUrl,
      tickerEnabled: tickerEnabled === '1',
      tickerCustomSubjects,
      tickerSpeed,
      trustBarEnabled: trustBarEnabled === '1',
      trustBarItems,
      trustBarSpeed
    };
  },
  async updateHeroSettings({ badgeText, badgeIcon, titlePrefix, titleHighlight, subtext, imageUrl, tickerEnabled, tickerCustomSubjects, tickerSpeed, trustBarEnabled, trustBarItems, trustBarSpeed }) {
    if (badgeText !== undefined) await this.set('hero_badge_text', badgeText);
    if (badgeIcon !== undefined) await this.set('hero_badge_icon', badgeIcon);
    if (titlePrefix !== undefined) await this.set('hero_title_prefix', titlePrefix);
    if (titleHighlight !== undefined) await this.set('hero_title_highlight', titleHighlight);
    if (subtext !== undefined) await this.set('hero_subtext', subtext);
    if (imageUrl !== undefined && imageUrl) await this.set('hero_image_url', imageUrl);
    if (tickerEnabled !== undefined) await this.set('hero_ticker_enabled', tickerEnabled ? '1' : '0');
    if (tickerCustomSubjects !== undefined) await this.set('hero_ticker_custom_subjects', tickerCustomSubjects);
    if (tickerSpeed !== undefined) await this.set('hero_ticker_speed', String(tickerSpeed));
    if (trustBarEnabled !== undefined) await this.set('hero_trust_bar_enabled', trustBarEnabled ? '1' : '0');
    if (trustBarSpeed !== undefined) await this.set('hero_trust_bar_speed', String(trustBarSpeed));
    if (trustBarItems !== undefined) {
      const itemsStr = typeof trustBarItems === 'string' ? trustBarItems : JSON.stringify(trustBarItems);
      await this.set('hero_trust_bar_items', itemsStr);
    }
  },
  async getCurriculumSettings() {
    const badgeText = await this.get('curriculum_badge_text', 'Academic Curriculum & Syllabus');
    const badgeIcon = await this.get('curriculum_badge_icon', 'ri-graduation-cap-line');
    const title = await this.get('curriculum_title', 'Comprehensive Physiotherapy Curriculum by Year');
    const subtext = await this.get('curriculum_subtext', 'Master foundational medical sciences, clinical assessments, rehabilitation specialties, and allied disciplines — structured systematically as per the Indian Physiotherapy University curriculum.');
    const isEnabled = await this.get('curriculum_section_enabled', '1');
    return {
      badgeText,
      badgeIcon,
      title,
      subtext,
      isEnabled: isEnabled === '1'
    };
  },
  async updateCurriculumSettings({ badgeText, badgeIcon, title, subtext, isEnabled }) {
    if (badgeText !== undefined) await this.set('curriculum_badge_text', badgeText);
    if (badgeIcon !== undefined) await this.set('curriculum_badge_icon', badgeIcon);
    if (title !== undefined) await this.set('curriculum_title', title);
    if (subtext !== undefined) await this.set('curriculum_subtext', subtext);
    if (isEnabled !== undefined) await this.set('curriculum_section_enabled', isEnabled ? '1' : '0');
  },
  async getLearningJourneySettings() {
    const badgeText = await this.get('journey_badge_text', 'Academic Pathways & Resources');
    const badgeIcon = await this.get('journey_badge_icon', 'ri-compass-3-line');
    const title = await this.get('journey_title', 'Your Learning Journey');
    const subtext = await this.get('journey_subtext', 'Access everything you need for academic learning, examination preparation and clinical application.');
    const isEnabled = await this.get('journey_section_enabled', '1');
    return {
      badgeText,
      badgeIcon,
      title,
      subtext,
      isEnabled: isEnabled === '1'
    };
  },
  async updateLearningJourneySettings({ badgeText, badgeIcon, title, subtext, isEnabled }) {
    if (badgeText !== undefined) await this.set('journey_badge_text', badgeText);
    if (badgeIcon !== undefined) await this.set('journey_badge_icon', badgeIcon);
    if (title !== undefined) await this.set('journey_title', title);
    if (subtext !== undefined) await this.set('journey_subtext', subtext);
    if (isEnabled !== undefined) await this.set('journey_section_enabled', isEnabled ? '1' : '0');
  },
  async getCTASettings() {
    const badgeText = await this.get('cta_badge_text', 'Free Forever');
    const badgeIcon = await this.get('cta_badge_icon', 'ri-graduation-cap-line');
    const title = await this.get('cta_title', 'Start your physiotherapy learning journey today');
    const subtext = await this.get('cta_subtext', 'Join thousands of physiotherapy students already learning on PhysioEdvance — 100% free.');
    const primaryBtnText = await this.get('cta_primary_btn_text', 'Create Free Account');
    const primaryBtnUrl = await this.get('cta_primary_btn_url', '/auth/register');
    const primaryBtnIcon = await this.get('cta_primary_btn_icon', 'ri-user-add-line');
    const secondaryBtnText = await this.get('cta_secondary_btn_text', 'Explore Subjects');
    const secondaryBtnUrl = await this.get('cta_secondary_btn_url', '/subjects');
    const secondaryBtnIcon = await this.get('cta_secondary_btn_icon', 'ri-arrow-right-line');
    const noteText = await this.get('cta_note_text', 'No credit card required · 100% Free');
    const isEnabled = await this.get('cta_section_enabled', '1');
    return {
      badgeText,
      badgeIcon,
      title,
      subtext,
      primaryBtnText,
      primaryBtnUrl,
      primaryBtnIcon,
      secondaryBtnText,
      secondaryBtnUrl,
      secondaryBtnIcon,
      noteText,
      isEnabled: isEnabled === '1'
    };
  },
  async updateCTASettings(data) {
    if (data.badgeText !== undefined) await this.set('cta_badge_text', data.badgeText);
    if (data.badgeIcon !== undefined) await this.set('cta_badge_icon', data.badgeIcon);
    if (data.title !== undefined) await this.set('cta_title', data.title);
    if (data.subtext !== undefined) await this.set('cta_subtext', data.subtext);
    if (data.primaryBtnText !== undefined) await this.set('cta_primary_btn_text', data.primaryBtnText);
    if (data.primaryBtnUrl !== undefined) await this.set('cta_primary_btn_url', data.primaryBtnUrl);
    if (data.primaryBtnIcon !== undefined) await this.set('cta_primary_btn_icon', data.primaryBtnIcon);
    if (data.secondaryBtnText !== undefined) await this.set('cta_secondary_btn_text', data.secondaryBtnText);
    if (data.secondaryBtnUrl !== undefined) await this.set('cta_secondary_btn_url', data.secondaryBtnUrl);
    if (data.secondaryBtnIcon !== undefined) await this.set('cta_secondary_btn_icon', data.secondaryBtnIcon);
    if (data.noteText !== undefined) await this.set('cta_note_text', data.noteText);
    if (data.isEnabled !== undefined) await this.set('cta_section_enabled', data.isEnabled ? '1' : '0');
  }
};

// ============ CURRICULUM YEAR CARDS ============
const CurriculumYearCard = {
  async initTable() {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS curriculum_year_cards (
        id SERIAL PRIMARY KEY,
        year_key TEXT NOT NULL,
        tag TEXT,
        title TEXT NOT NULL,
        subtitle TEXT,
        icon TEXT DEFAULT 'ri-book-3-fill',
        theme_color TEXT DEFAULT 'primary',
        display_order INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1
      )
    `).run();

    const count = Number((await db.prepare(`SELECT COUNT(*) as c FROM curriculum_year_cards`).get()).c);
    if (count === 0) {
      const defaults = [
        { year_key: '1', tag: 'Year 1 • Foundation', title: 'First Year', subtitle: 'Core Anatomy, Physiology, Biomechanics & basic principles', icon: 'ri-book-3-fill', theme_color: 'primary', display_order: 1 },
        { year_key: '2', tag: 'Year 2 • Clinical Core', title: 'Second Year', subtitle: 'Pathology, Pharmacology, Exercise Therapy & Electrotherapy', icon: 'ri-microscope-line', theme_color: 'success', display_order: 2 },
        { year_key: '3', tag: 'Year 3 • Advanced Practice', title: 'Third Year', subtitle: 'General Medicine, Surgery, Orthopedics & Clinical Diagnosis', icon: 'ri-heart-pulse-fill', theme_color: 'danger', display_order: 3 },
        { year_key: '4', tag: 'Year 4 • Specialties & Rehab', title: 'Fourth Year', subtitle: 'Neurology, Cardiothoracic, Sports PT & Community Rehabilitation', icon: 'ri-stethoscope-fill', theme_color: 'warning', display_order: 4 },
        { year_key: 'other', tag: 'Allied • Interdisciplinary', title: 'Other Subjects', subtitle: 'Allied health, research methodology & clinical skill modules', icon: 'ri-apps-2-fill', theme_color: 'purple', display_order: 5 }
      ];
      for (const d of defaults) {
        await db.prepare(`
          INSERT INTO curriculum_year_cards (year_key, tag, title, subtitle, icon, theme_color, display_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `).run(d.year_key, d.tag, d.title, d.subtitle, d.icon, d.theme_color, d.display_order);
      }
    }
  },
  async allActive() {
    await this.initTable();
    return db.prepare(`SELECT * FROM curriculum_year_cards WHERE is_active = 1 ORDER BY display_order ASC, id ASC`).all();
  },
  async all() {
    await this.initTable();
    return db.prepare(`SELECT * FROM curriculum_year_cards ORDER BY display_order ASC, id ASC`).all();
  },
  async findById(id) {
    await this.initTable();
    return db.prepare(`SELECT * FROM curriculum_year_cards WHERE id = ?`).get(id);
  },
  async normalizePositions() {
    await this.initTable();
    const items = await db.prepare(`SELECT id FROM curriculum_year_cards ORDER BY display_order ASC, id ASC`).all();
    for (let i = 0; i < items.length; i++) {
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(i + 1, items[i].id);
    }
  },
  async create(data) {
    await this.initTable();
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    await db.prepare(`UPDATE curriculum_year_cards SET display_order = display_order + 1 WHERE display_order >= ?`).run(targetOrder);
    const info = await db.prepare(`
      INSERT INTO curriculum_year_cards (year_key, tag, title, subtitle, icon, theme_color, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(
      data.year_key || '1', data.tag || '', data.title, data.subtitle || '', data.icon || 'ri-book-3-fill',
      data.theme_color || 'primary', targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1
    );
    await this.normalizePositions();
    return this.findById(info.lastInsertRowid);
  },
  async update(id, data) {
    await this.initTable();
    const existing = await this.findById(id);
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    if (existing && existing.display_order !== targetOrder) {
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = display_order + 1 WHERE display_order >= ? AND id != ?`).run(targetOrder, id);
    }
    await db.prepare(`
      UPDATE curriculum_year_cards
      SET year_key = ?, tag = ?, title = ?, subtitle = ?, icon = ?, theme_color = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      data.year_key || '1', data.tag || '', data.title, data.subtitle || '', data.icon || 'ri-book-3-fill',
      data.theme_color || 'primary', targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1, id
    );
    await this.normalizePositions();
  },
  async delete(id) {
    await this.initTable();
    await db.prepare(`DELETE FROM curriculum_year_cards WHERE id = ?`).run(id);
    await this.normalizePositions();
  },
  async moveUp(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const prev = await db.prepare(`SELECT * FROM curriculum_year_cards WHERE display_order <= ? AND id != ? ORDER BY display_order DESC, id DESC LIMIT 1`).get(current.display_order, current.id);
    if (prev) {
      const tempOrder = current.display_order;
      const targetOrder = prev.display_order === current.display_order ? Math.max(1, current.display_order - 1) : prev.display_order;
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(targetOrder, current.id);
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(tempOrder, prev.id);
    } else {
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(Math.max(1, current.display_order - 1), current.id);
    }
    await this.normalizePositions();
  },
  async moveDown(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const next = await db.prepare(`SELECT * FROM curriculum_year_cards WHERE display_order >= ? AND id != ? ORDER BY display_order ASC, id ASC LIMIT 1`).get(current.display_order, current.id);
    if (next) {
      const tempOrder = current.display_order;
      const targetOrder = next.display_order === current.display_order ? current.display_order + 1 : next.display_order;
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(targetOrder, current.id);
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(tempOrder, next.id);
    } else {
      await db.prepare(`UPDATE curriculum_year_cards SET display_order = ? WHERE id = ?`).run(current.display_order + 1, current.id);
    }
    await this.normalizePositions();
  }
};

// ============ LEARNING JOURNEY CARDS ============
const LearningJourneyCard = {
  async initTable() {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS learning_journey_cards (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        icon TEXT DEFAULT 'ri-file-text-line',
        url TEXT DEFAULT '/learning-modules',
        badge_color TEXT DEFAULT 'primary',
        display_order INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1
      )
    `).run();

    const count = Number((await db.prepare(`SELECT COUNT(*) as c FROM learning_journey_cards`).get()).c);
    if (count === 0) {
      const defaults = [
        { title: 'MCQs', subtitle: 'Practice subject-wise MCQs with instant results', icon: 'ri-file-text-line', url: '/learning-modules?type=mcq', badge_color: 'primary', display_order: 1 },
        { title: 'LAQs & SAQs', subtitle: 'Prepare with structured long and short answers', icon: 'ri-edit-2-line', url: '/learning-modules?type=large-qa', badge_color: 'info', display_order: 2 },
        { title: 'Case Discussion', subtitle: 'Discuss clinical cases with peers and mentors', icon: 'ri-group-line', url: '/live-discussion', badge_color: 'success', display_order: 3 },
        { title: 'Live Classes', subtitle: 'Join interactive learning sessions', icon: 'ri-play-circle-fill', url: '/live-sessions', badge_color: 'danger', display_order: 4 },
        { title: 'Reference Books', subtitle: 'Explore recommended textbooks and resources', icon: 'ri-book-2-line', url: '/subjects', badge_color: 'warning', display_order: 5 }
      ];
      for (const d of defaults) {
        await db.prepare(`
          INSERT INTO learning_journey_cards (title, subtitle, icon, url, badge_color, display_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `).run(d.title, d.subtitle, d.icon, d.url, d.badge_color, d.display_order);
      }
    }
  },
  async allActive() {
    await this.initTable();
    return db.prepare(`SELECT * FROM learning_journey_cards WHERE is_active = 1 ORDER BY display_order ASC, id ASC`).all();
  },
  async all() {
    await this.initTable();
    return db.prepare(`SELECT * FROM learning_journey_cards ORDER BY display_order ASC, id ASC`).all();
  },
  async findById(id) {
    await this.initTable();
    return db.prepare(`SELECT * FROM learning_journey_cards WHERE id = ?`).get(id);
  },
  async normalizePositions() {
    await this.initTable();
    const items = await db.prepare(`SELECT id FROM learning_journey_cards ORDER BY display_order ASC, id ASC`).all();
    for (let i = 0; i < items.length; i++) {
      await db.prepare(`UPDATE learning_journey_cards SET display_order = ? WHERE id = ?`).run(i + 1, items[i].id);
    }
  },
  async create(data) {
    await this.initTable();
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    await db.prepare(`UPDATE learning_journey_cards SET display_order = display_order + 1 WHERE display_order >= ?`).run(targetOrder);
    const info = await db.prepare(`
      INSERT INTO learning_journey_cards (title, subtitle, icon, url, badge_color, display_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
    `).run(
      data.title, data.subtitle || '', data.icon || 'ri-file-text-line',
      data.url || '/learning-modules', data.badge_color || 'primary',
      targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1
    );
    await this.normalizePositions();
    return this.findById(info.lastInsertRowid);
  },
  async update(id, data) {
    await this.initTable();
    const existing = await this.findById(id);
    const targetOrder = Math.max(1, parseInt(data.display_order) || 1);
    if (existing && existing.display_order !== targetOrder) {
      await db.prepare(`UPDATE learning_journey_cards SET display_order = display_order + 1 WHERE display_order >= ? AND id != ?`).run(targetOrder, id);
    }
    await db.prepare(`
      UPDATE learning_journey_cards
      SET title = ?, subtitle = ?, icon = ?, url = ?, badge_color = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(
      data.title, data.subtitle || '', data.icon || 'ri-file-text-line',
      data.url || '/learning-modules', data.badge_color || 'primary',
      targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1, id
    );
    await this.normalizePositions();
  },
  async delete(id) {
    await this.initTable();
    await db.prepare(`DELETE FROM learning_journey_cards WHERE id = ?`).run(id);
    await this.normalizePositions();
  },
  async moveUp(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const prev = await db.prepare(`SELECT * FROM learning_journey_cards WHERE display_order <= ? AND id != ? ORDER BY display_order DESC, id DESC LIMIT 1`).get(current.display_order, current.id);
    if (prev) {
      const tempOrder = current.display_order;
      const targetOrder = prev.display_order === current.display_order ? Math.max(1, current.display_order - 1) : prev.display_order;
      await db.prepare(`UPDATE learning_journey_cards SET display_order = ? WHERE id = ?`).run(targetOrder, current.id);
      await db.prepare(`UPDATE learning_journey_cards SET display_order = ? WHERE id = ?`).run(tempOrder, prev.id);
    } else {
      await db.prepare(`UPDATE learning_journey_cards SET display_order = ? WHERE id = ?`).run(Math.max(1, current.display_order - 1), current.id);
    }
    await this.normalizePositions();
  },
  async moveDown(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const next = await db.prepare(`SELECT * FROM learning_journey_cards WHERE display_order >= ? AND id != ? ORDER BY display_order ASC, id ASC LIMIT 1`).get(current.display_order, current.id);
    if (next) {
      const tempOrder = current.display_order;
      const targetOrder = next.display_order === current.display_order ? current.display_order + 1 : next.display_order;
      await db.prepare(`UPDATE learning_journey_cards SET display_order = ? WHERE id = ?`).run(targetOrder, current.id);
    } else {
      await db.prepare(`UPDATE learning_journey_cards SET display_order = ? WHERE id = ?`).run(current.display_order + 1, current.id);
    }
    await this.normalizePositions();
  }
};

// ============ HOMEPAGE SECTIONS POSITION ORDER & MANAGEMENT ============
const HomepageSection = {
  async initTable() {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS homepage_sections (
        id SERIAL PRIMARY KEY,
        section_key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT DEFAULT 'ri-layout-grid-line',
        admin_link TEXT DEFAULT '/admin/dashboard',
        display_order INTEGER DEFAULT 1,
        is_active INTEGER DEFAULT 1
      )
    `).run();

    const count = Number((await db.prepare(`SELECT COUNT(*) as c FROM homepage_sections`).get()).c);
    if (count === 0) {
      const defaults = [
        { section_key: 'curriculum', name: 'Curriculum Cards', description: 'Year 1-4 & elective subjects syllabus tabs with quick links', icon: 'ri-graduation-cap-line', admin_link: '/admin/curriculum', display_order: 1 },
        { section_key: 'learning_journey', name: 'Learning Journey', description: '5 interactive learning pillars (MCQs, LAQs & SAQs, Case Discussion, Live Classes, Reference Books)', icon: 'ri-route-line', admin_link: '/admin/learning-journey', display_order: 2 },
        { section_key: 'vision_mission', name: 'Vision & Mission', description: 'Educational vision, core mission statement, and student empowerment cards', icon: 'ri-compass-3-line', admin_link: '/admin/vision-mission', display_order: 3 },
        { section_key: 'founders', name: 'Expert Teachers & Team', description: 'Featured certified physiotherapists & founder leadership showcase', icon: 'ri-user-star-line', admin_link: '/admin/team', display_order: 4 },
        { section_key: 'blog', name: 'Blog', description: 'Clinical articles, student tips, and physiotherapy insights', icon: 'ri-article-line', admin_link: '/admin/blog', display_order: 5 },
        { section_key: 'live_sessions', name: 'Live Sessions', description: 'Interactive live classes, webinars, and case discussions', icon: 'ri-vidicon-line', admin_link: '/admin/live-sessions', display_order: 6 },
        { section_key: 'notes', name: 'Study Notes', description: 'High-yield study notes, PDFs, and revision materials', icon: 'ri-file-text-line', admin_link: '/admin/notes', display_order: 7 },
        { section_key: 'callback_appointment', name: 'Appointments', description: 'Academic inquiry callback request form & WhatsApp chat', icon: 'ri-calendar-check-line', admin_link: '/admin/appointments', display_order: 8 },
        { section_key: 'featured_subjects', name: 'Featured Subjects & Courses', description: 'Interactive course carousel & top-rated modules modal pop-up', icon: 'ri-star-line', admin_link: '/admin/courses', display_order: 9 },
        { section_key: 'faculty_trust', name: 'Faculty & Content Quality Banner', description: 'Content created and reviewed by qualified physiotherapists showcase', icon: 'ri-shield-check-line', admin_link: '/admin/dashboard', display_order: 10 },
        { section_key: 'cta', name: 'Final Call to Action Banner', description: 'Create free account forever and start learning banner', icon: 'ri-megaphone-line', admin_link: '/admin/dashboard', display_order: 11 }
      ];
      for (const d of defaults) {
        await db.prepare(`
          INSERT INTO homepage_sections (section_key, name, description, icon, admin_link, display_order, is_active)
          VALUES (?, ?, ?, ?, ?, ?, 1)
        `).run(d.section_key, d.name, d.description, d.icon, d.admin_link, d.display_order);
      }
    }
  },
  async all() {
    await this.initTable();
    return db.prepare(`SELECT * FROM homepage_sections ORDER BY display_order ASC, id ASC`).all();
  },
  async allActive() {
    await this.initTable();
    return db.prepare(`SELECT * FROM homepage_sections WHERE is_active = 1 ORDER BY display_order ASC, id ASC`).all();
  },
  async findById(id) {
    await this.initTable();
    return db.prepare(`SELECT * FROM homepage_sections WHERE id = ?`).get(id);
  },
  async normalizePositions() {
    const items = await db.prepare(`SELECT id FROM homepage_sections ORDER BY display_order ASC, id ASC`).all();
    for (let i = 0; i < items.length; i++) {
      await db.prepare(`UPDATE homepage_sections SET display_order = ? WHERE id = ?`).run(i + 1, items[i].id);
    }
  },
  async update(id, data) {
    await this.initTable();
    const existing = await this.findById(id);
    const targetOrder = Math.max(1, parseInt(data.display_order) || (existing ? existing.display_order : 1));
    if (existing && existing.display_order !== targetOrder) {
      if (targetOrder > existing.display_order) {
        await db.prepare(`UPDATE homepage_sections SET display_order = display_order - 1 WHERE display_order > ? AND display_order <= ? AND id != ?`).run(existing.display_order, targetOrder, id);
      } else {
        await db.prepare(`UPDATE homepage_sections SET display_order = display_order + 1 WHERE display_order >= ? AND display_order < ? AND id != ?`).run(targetOrder, existing.display_order, id);
      }
    }
    const name = data.name !== undefined && data.name.trim() ? data.name.trim() : (existing ? existing.name : '');
    const description = data.description !== undefined ? data.description.trim() : (existing ? existing.description : '');
    await db.prepare(`
      UPDATE homepage_sections
      SET name = ?, description = ?, display_order = ?, is_active = ?
      WHERE id = ?
    `).run(name, description, targetOrder, data.is_active === '0' || data.is_active === 0 ? 0 : 1, id);
    await this.normalizePositions();
  },
  async toggleActive(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const newStatus = current.is_active === 1 ? 0 : 1;
    await db.prepare(`UPDATE homepage_sections SET is_active = ? WHERE id = ?`).run(newStatus, id);
  },
  async moveUp(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const prev = await db.prepare(`SELECT * FROM homepage_sections WHERE display_order < ? ORDER BY display_order DESC, id DESC LIMIT 1`).get(current.display_order);
    if (prev) {
      const tempOrder = current.display_order;
      await db.prepare(`UPDATE homepage_sections SET display_order = ? WHERE id = ?`).run(prev.display_order, current.id);
      await db.prepare(`UPDATE homepage_sections SET display_order = ? WHERE id = ?`).run(tempOrder, prev.id);
    }
    await this.normalizePositions();
  },
  async moveDown(id) {
    await this.initTable();
    const current = await this.findById(id);
    if (!current) return;
    const next = await db.prepare(`SELECT * FROM homepage_sections WHERE display_order > ? ORDER BY display_order ASC, id ASC LIMIT 1`).get(current.display_order);
    if (next) {
      const tempOrder = current.display_order;
      await db.prepare(`UPDATE homepage_sections SET display_order = ? WHERE id = ?`).run(next.display_order, current.id);
      await db.prepare(`UPDATE homepage_sections SET display_order = ? WHERE id = ?`).run(tempOrder, next.id);
    }
    await this.normalizePositions();
  }
};

module.exports = { Notes, Team, Blog, LiveSessions, HeroFeature, ClinicalSpecialty, SiteSettings, CurriculumYearCard, LearningJourneyCard, HomepageSection };

