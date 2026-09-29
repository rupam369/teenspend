const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isSupabaseConfigured = false;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http') && !supabaseUrl.includes('your-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    isSupabaseConfigured = true;
    console.log(`✅ [Database] Initialized Supabase client: ${supabaseUrl}`);
  } catch (error) {
    console.error('❌ [Database] Failed to initialize Supabase client:', error.message);
  }
} else {
  console.log('ℹ️  [Database] Supabase credentials not set in .env. Using resilient local store. To connect live Supabase PostgreSQL, add SUPABASE_URL and SUPABASE_ANON_KEY to backend/.env');
}

module.exports = {
  supabase,
  isSupabaseConfigured,
};
