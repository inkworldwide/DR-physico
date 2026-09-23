const db = require('../db/connection');

// Standard Resource Categories & Definitions
const RESOURCE_GROUPS = [
  {
    resource: 'COURSE',
    label: 'Courses & Curriculum Modules',
    icon: 'ri-book-2-line',
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'PUBLISH', 'ASSIGN']
  },
  {
    resource: 'BLOG',
    label: 'Blog Posts & Articles',
    icon: 'ri-article-line',
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'PUBLISH', 'ASSIGN']
  },
  {
    resource: 'LIVE_CLASS',
    label: 'Live Classes & Webinars',
    icon: 'ri-vidicon-line',
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'PUBLISH', 'ASSIGN']
  },
  {
    resource: 'SUBJECT',
    label: 'Subjects & Curriculum Categories',
    icon: 'ri-folder-2-line',
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'ASSIGN']
  },
  {
    resource: 'CASE_DISCUSSION',
    label: 'Case Discussions & Question Bank',
    icon: 'ri-question-answer-line',
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'PUBLISH', 'ASSIGN']
  },
  {
    resource: 'USER',
    label: 'User & Learner Management',
    icon: 'ri-team-line',
    actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'TOGGLE_STATUS']
  },
  {
    resource: 'AUDIT_LOG',
    label: 'Audit Trail Logs',
    icon: 'ri-shield-check-line',
    actions: ['VIEW']
  },
  {
    resource: 'SETTINGS',
    label: 'Homepage & Platform Settings',
    icon: 'ri-settings-4-line',
    actions: ['VIEW', 'EDIT']
  }
];

const PermissionService = {
  RESOURCE_GROUPS,

  /**
   * Get all registered system permissions grouped by resource
   */
  async getAllPermissions() {
    const rows = await db.prepare(`SELECT * FROM permissions ORDER BY resource, action`).all();
    const grouped = {};
    for (const r of RESOURCE_GROUPS) {
      grouped[r.resource] = {
        ...r,
        permissions: []
      };
    }
    for (const row of rows) {
      if (!grouped[row.resource]) {
        grouped[row.resource] = {
          resource: row.resource,
          label: row.resource.replace(/_/g, ' '),
          icon: 'ri-lock-line',
          permissions: []
        };
      }
      grouped[row.resource].permissions.push(row);
    }
    return grouped;
  },

  /**
   * Get active permissions list for a user
   * @param {number} userId
   * @returns {Promise<Set<string>>} Set of permission keys
   */
  async getUserPermissions(userId) {
    if (!userId) return new Set();
    const rows = await db.prepare(`SELECT permission_key FROM user_permissions WHERE user_id = ?`).all(userId);
    return new Set(rows.map(r => r.permission_key));
  },

  /**
   * Set and sync permissions for a specific user
   * @param {number} targetUserId
   * @param {string[]} permissionKeys
   * @param {number} actorId - Superadmin user id making the change
   */
  async setUserPermissions(targetUserId, permissionKeys = [], actorId = null) {
    const targetUser = await db.prepare(`SELECT * FROM users WHERE id = ?`).get(targetUserId);
    if (!targetUser) throw new Error('User not found');

    const oldPerms = await this.getUserPermissions(targetUserId);
    const oldArray = Array.from(oldPerms).sort();
    const newArray = Array.from(new Set(permissionKeys)).filter(Boolean).sort();

    // Clear and re-insert
    await db.prepare(`DELETE FROM user_permissions WHERE user_id = ?`).run(targetUserId);

    for (const key of newArray) {
      await db.prepare(`
        INSERT INTO user_permissions (user_id, permission_key, granted_by)
        VALUES (?, ?, ?)
        ON CONFLICT (user_id, permission_key) DO NOTHING
      `).run(targetUserId, key, actorId);
    }

    // Log to audit trail
    await this.logAudit({
      actorId,
      action: 'PERMISSIONS_UPDATED',
      resource: 'USER_PERMISSIONS',
      resourceId: String(targetUserId),
      details: JSON.stringify({
        targetUser: { id: targetUser.id, name: targetUser.name, email: targetUser.email, role: targetUser.role },
        previousPermissions: oldArray,
        newPermissions: newArray
      })
    });

    return new Set(newArray);
  },

  /**
   * Check if a user has a specific permission
   * Superadmin always returns true for all permissions.
   * @param {object} user - session user object
   * @param {string} resource - e.g. 'COURSE', 'BLOG'
   * @param {string} action - e.g. 'CREATE', 'DELETE'
   */
  async hasPermission(user, resource, action) {
    if (!user) return false;
    // Super Admin has master override for all operations
    if (user.role === 'superadmin') return true;

    // Normal students / learners have no administrative permissions
    if (!['admin', 'instructor'].includes(user.role)) return false;

    const permKey = `${resource.toUpperCase()}:${action.toUpperCase()}`;
    const row = await db.prepare(`
      SELECT 1 as granted FROM user_permissions
      WHERE user_id = ? AND permission_key = ?
    `).get(user.id, permKey);

    return !!row;
  },

  /**
   * Synchronous check when user.permissions is pre-loaded on the request
   */
  hasPermissionSync(user, resource, action) {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    if (!['admin', 'instructor'].includes(user.role)) return false;
    if (!user.permissions) return false;

    const permKey = `${resource.toUpperCase()}:${action.toUpperCase()}`;
    if (user.permissions instanceof Set) {
      return user.permissions.has(permKey);
    }
    if (Array.isArray(user.permissions)) {
      return user.permissions.includes(permKey);
    }
    return false;
  },

  /**
   * Check if user can access a specific content item (Private vs Public rules)
   * @param {object} user - user object
   * @param {string} contentType - 'course' | 'blog' | 'live_session' | 'learning_module' | 'subject'
   * @param {object} item - content row
   * @param {string} requiredLevel - 'view' | 'edit' | 'admin'
   */
  async canAccessContent(user, contentType, item, requiredLevel = 'view') {
    if (!item) return false;

    // 1. Superadmin has absolute master override
    if (user && user.role === 'superadmin') return true;

    const visibility = (item.visibility || 'public').toLowerCase();
    const creatorId = item.created_by || item.instructor_id || item.author_id || item.host_id;

    // 2. Creator / Owner has full access
    if (user && creatorId && Number(user.id) === Number(creatorId)) {
      return true;
    }

    // 3. Check explicit content_access assignment
    if (user) {
      const access = await db.prepare(`
        SELECT permission_level FROM content_access
        WHERE content_type = ? AND content_id = ? AND user_id = ?
      `).get(contentType, item.id, user.id);

      if (access) {
        if (requiredLevel === 'view') return true;
        if (requiredLevel === 'edit' && ['edit', 'admin'].includes(access.permission_level)) return true;
        if (requiredLevel === 'admin' && access.permission_level === 'admin') return true;
      }
    }

    // 4. Public content is viewable if requiredLevel is 'view'
    if (visibility === 'public' && requiredLevel === 'view') {
      return true;
    }

    return false;
  },

  /**
   * Assign or update explicit content access for selected users
   */
  async assignContentAccess(contentType, contentId, userAssignments = [], actorId = null) {
    // userAssignments is array of { userId, permissionLevel }
    await db.prepare(`DELETE FROM content_access WHERE content_type = ? AND content_id = ?`).run(contentType, contentId);

    for (const item of userAssignments) {
      if (!item.userId) continue;
      const level = ['view', 'edit', 'admin'].includes(item.permissionLevel) ? item.permissionLevel : 'view';
      await db.prepare(`
        INSERT INTO content_access (content_type, content_id, user_id, permission_level, assigned_by)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT (content_type, content_id, user_id) DO UPDATE SET permission_level = EXCLUDED.permission_level
      `).run(contentType, contentId, item.userId, level, actorId);
    }

    await this.logAudit({
      actorId,
      action: 'CONTENT_ACCESS_ASSIGNED',
      resource: contentType.toUpperCase(),
      resourceId: String(contentId),
      details: JSON.stringify({ contentType, contentId, assignments: userAssignments })
    });
  },

  /**
   * Get list of users explicitly assigned to a content item
   */
  async getContentAssignedUsers(contentType, contentId) {
    return db.prepare(`
      SELECT ca.*, u.name, u.email, u.role, u.avatar
      FROM content_access ca
      JOIN users u ON ca.user_id = u.id
      WHERE ca.content_type = ? AND ca.content_id = ?
      ORDER BY u.name ASC
    `).all(contentType, contentId);
  },

  /**
   * Log an administrative or security action to audit_logs
   */
  async logAudit({ actorId, action, resource, resourceId = null, details = null, req = null }) {
    try {
      let actorName = 'System';
      let actorEmail = null;
      let actorRole = null;

      if (actorId) {
        const actor = await db.prepare(`SELECT name, email, role FROM users WHERE id = ?`).get(actorId);
        if (actor) {
          actorName = actor.name;
          actorEmail = actor.email;
          actorRole = actor.role;
        }
      }

      let ipAddress = null;
      let userAgent = null;
      if (req) {
        ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        userAgent = req.headers['user-agent'] || null;
      }

      await db.prepare(`
        INSERT INTO audit_logs (actor_id, actor_name, actor_email, actor_role, action, resource, resource_id, details, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        actorId || null,
        actorName,
        actorEmail,
        actorRole,
        action,
        resource,
        resourceId ? String(resourceId) : null,
        typeof details === 'object' ? JSON.stringify(details) : details,
        ipAddress,
        userAgent
      );
    } catch (e) {
      console.warn('Audit log write error:', e.message);
    }
  },

  /**
   * Retrieve audit logs with pagination and filters
   */
  async getAuditLogs({ limit = 50, offset = 0, resource = null, action = null, actorId = null } = {}) {
    let sql = `SELECT * FROM audit_logs WHERE 1=1`;
    const params = [];

    if (resource) {
      sql += ` AND resource = ?`;
      params.push(resource);
    }
    if (action) {
      sql += ` AND action ILIKE ?`;
      params.push(`%${action}%`);
    }
    if (actorId) {
      sql += ` AND actor_id = ?`;
      params.push(actorId);
    }

    sql += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    return db.prepare(sql).all(...params);
  }
};

module.exports = PermissionService;
