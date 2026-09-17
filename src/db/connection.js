const { Pool } = require('pg');
const env = require('../config/env');

// ─── PostgreSQL Pool ─────────────────────────────────────────────────────────
// This app uses PostgreSQL exclusively — SQLite fallback has been removed.
// On Render, DATABASE_URL is injected automatically. Locally, use PGHOST/PGUSER/etc.

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    }
  : {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      ssl: false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error:', err.message);
});

// ─── Startup connectivity check with retry ───────────────────────────────────
// On Render's free tier, Postgres can take a few seconds to wake up.
// We retry up to 8 times (2s apart = 16 seconds total) before failing hard.
async function waitForPostgres(retries = 8, delayMs = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('✅ PostgreSQL connection established.');
      return;
    } catch (err) {
      console.warn(`⏳ PostgreSQL not ready (attempt ${attempt}/${retries}): ${err.message}`);
      if (attempt === retries) {
        throw new Error(
          `❌ Could not connect to PostgreSQL after ${retries} attempts.\n` +
          `   Host: ${poolConfig.host || 'via DATABASE_URL'}\n` +
          `   User: ${poolConfig.user || '(from DATABASE_URL)'}\n` +
          `   DB:   ${poolConfig.database || '(from DATABASE_URL)'}`
        );
      }
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}

// ─── Convert SQLite-style "?" placeholders to Postgres "$1, $2, ..." ─────────
function toPgPlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

// ─── Convert "@name" named placeholders to positional "$1, $2, ..." ──────────
function toPgNamedPlaceholders(sql) {
  const names = [];
  const pgSql = sql.replace(/(?:^|(?<=[\s,=(]))@([a-zA-Z_][a-zA-Z0-9_]*)/g, (_, name) => {
    names.push(name);
    return `$${names.length}`;
  });
  return { pgSql, mapper: (obj) => names.map(n => (obj ? obj[n] : undefined)) };
}

function hasNamedParams(sql) {
  return /(?:^|[\s,=(])@([a-zA-Z_][a-zA-Z0-9_]*)/.test(sql);
}

// ─── Prepared-statement style API (async, mirrors old SQLite interface) ───────
function prepare(sql) {
  let hasAutoReturning = false;
  let effectiveSql = sql;
  if (/^\s*INSERT\s+INTO\s+/i.test(sql) && !/\bRETURNING\b/i.test(sql)) {
    effectiveSql = sql + ' RETURNING id';
    hasAutoReturning = true;
  }

  if (hasNamedParams(sql)) {
    const { pgSql, mapper } = toPgNamedPlaceholders(effectiveSql);
    const { pgSql: fallbackPgSql } = toPgNamedPlaceholders(sql);
    return {
      async get(obj) {
        const res = await pool.query(toPgNamedPlaceholders(sql).pgSql, toPgNamedPlaceholders(sql).mapper(obj));
        return res.rows[0];
      },
      async all(obj) {
        const res = await pool.query(toPgNamedPlaceholders(sql).pgSql, toPgNamedPlaceholders(sql).mapper(obj));
        return res.rows;
      },
      async run(obj) {
        let res;
        try {
          res = await pool.query(pgSql, mapper(obj));
        } catch (err) {
          if (hasAutoReturning && err.message && err.message.includes('column "id" does not exist')) {
            res = await pool.query(fallbackPgSql, mapper(obj));
          } else {
            throw err;
          }
        }
        const row = res.rows && res.rows[0];
        return { changes: res.rowCount, lastInsertRowid: row ? row.id : undefined };
      }
    };
  }

  const pgSql = toPgPlaceholders(effectiveSql);
  const fallbackPgSql = toPgPlaceholders(sql);

  return {
    async get(...params) {
      const res = await pool.query(fallbackPgSql, params.flat());
      return res.rows[0];
    },
    async all(...params) {
      const res = await pool.query(fallbackPgSql, params.flat());
      return res.rows;
    },
    async run(...params) {
      let res;
      try {
        res = await pool.query(pgSql, params.flat());
      } catch (err) {
        if (hasAutoReturning && err.message && err.message.includes('column "id" does not exist')) {
          res = await pool.query(fallbackPgSql, params.flat());
        } else {
          throw err;
        }
      }
      const row = res.rows && res.rows[0];
      return {
        changes: res.rowCount,
        lastInsertRowid: row ? row.id : undefined
      };
    }
  };
}

module.exports = {
  prepare,
  pragma() {},
  async exec(sql) {
    // pg natively executes multi-statement SQL strings via simple query protocol
    await pool.query(sql);
  },
  query: (sql, params) => pool.query(toPgPlaceholders(sql), params),
  pool,
  waitForPostgres,
  get activeEngine() { return 'pg'; }
};


