import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { initSchema } from './schema.js';
import { initSeed } from './seed.js';

dotenv.config();

let rawConnectionString = process.env.DATABASE_URL || '';

// Auto-convert direct IPv6 Supabase domain (db.<ref>.supabase.co) to IPv4 Pooler host (Mumbai ap-south-1)
if (rawConnectionString.includes('db.') && rawConnectionString.includes('.supabase.co')) {
  const match = rawConnectionString.match(/db\.([a-z0-9]+)\.supabase\.co/i);
  if (match && match[1]) {
    const projectRef = match[1];
    rawConnectionString = rawConnectionString
      .replace(new RegExp(`db\\.${projectRef}\\.supabase\\.co(:5432)?`), `aws-0-ap-south-1.pooler.supabase.com:6543`)
      .replace('postgres:', `postgres.${projectRef}:`);
  }
}

const connectionString = rawConnectionString;

export const pool = new Pool({
  connectionString,
  ssl: (connectionString.includes('supabase') || connectionString.includes('pooler')) ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export const query = async (text: string, params?: any[]) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('[DB Query Error]', err);
    return { rows: [], rowCount: 0 };
  }
};

// Supabase client configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

let initPromise: Promise<void> | null = null;

// Auto-initialize PostgreSQL tables, migrations, indexes and baseline seed data on connection
export const initDb = async () => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      await initSchema(pool);
      await initSeed(pool);
      console.log('[DB] PostgreSQL schema, indexes, and baseline seed verified.');
    } catch (err: any) {
      if (!err?.message?.includes('after calling end')) {
        console.error('[DB] Database init execution error:', err);
      }
    }
  })();
  return initPromise;
};

// Initialize DB schema asynchronously
initDb();
