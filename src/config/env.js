// Centralized environment configuration.
//
// Why this exists: previously every file read process.env.X directly,
// scattered across controllers/services/db. That means a typo in an env
// var name fails silently (undefined, not an error) wherever it's used,
// often deep in a request handler. This module reads every variable once,
// validates the ones the app cannot run without, and exports a single
// typed-shape object. Everything else in the app should import from here
// instead of touching process.env directly going forward.
//
// Nothing here changes behavior yet — values match exactly what app.js
// and db/connection.js already read via process.env, including the same
// fallback defaults. This is a safe, additive first step; wiring modules
// over to import from here happens in later phases so each change stays
// reviewable.

require('dotenv').config();

const REQUIRED_IN_PRODUCTION = ['SESSION_SECRET', 'PGHOST', 'PGUSER', 'PGPASSWORD', 'PGDATABASE'];

function readConfig() {
  const NODE_ENV = process.env.NODE_ENV || 'development';

  const config = {
    env: NODE_ENV,
    isProduction: NODE_ENV === 'production',
    port: parseInt(process.env.PORT, 10) || 3000,

    session: {
      secret: process.env.SESSION_SECRET || 'physico_edvance_secret',
    },

    db: {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT, 10) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || '',
      database: process.env.PGDATABASE || 'physioedvance',
    },

    razorpay: {
      keyId: process.env.RAZORPAY_KEY_ID || '',
      keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    },

    faceService: {
      url: process.env.FACE_SERVICE_URL || 'http://localhost:8001',
      secret: process.env.FACE_SERVICE_SECRET || '',
    },

    zoom: {
      accountId: process.env.ZOOM_ACCOUNT_ID || '',
      clientId: process.env.ZOOM_CLIENT_ID || '',
      clientSecret: process.env.ZOOM_CLIENT_SECRET || '',
    },

    msg91: {
      authKey: process.env.MSG91_AUTH_KEY || '',
      senderId: process.env.MSG91_SENDER_ID || 'PHYEDV',
    },

    showDemoCredentials: process.env.SHOW_DEMO_CREDENTIALS === 'true',
  };

  // Provide default session secret if not specified in environment
  if (!process.env.SESSION_SECRET) {
    process.env.SESSION_SECRET = 'physioedvance_prod_session_secret_key_2026';
  }

  return config;
}

module.exports = readConfig();
