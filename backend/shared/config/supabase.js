const { createClient } = require('@supabase/supabase-js');
const config = require('./environment');

// Polyfill fetch for Node.js if needed
if (!globalThis.fetch) {
  globalThis.fetch = require('node-fetch');
}

// Validate required environment variables
if (!config.SUPABASE_URL) {
  console.error('❌ Missing SUPABASE_URL in environment variables');
  process.exit(1);
}

if (!config.SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_KEY in environment variables');
  console.error('⚠️  Backend requires SERVICE_ROLE key, not ANON key');
  process.exit(1);
}

// Create Supabase client with SERVICE_ROLE key
const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_SERVICE_KEY, // ← MUST be SERVICE key
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

// Test connection function
const testSupabaseConnection = async () => {
  try {
    console.log('🔗 Testing Supabase connection...');
    console.log('   URL:', config.SUPABASE_URL);
    console.log('   Using SERVICE_ROLE key:', config.SUPABASE_SERVICE_KEY.substring(0, 20) + '...');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️  Supabase connected but "profiles" table doesn\'t exist');
        console.log('   Run the SQL setup in Supabase SQL Editor\n');
      } else {
        console.error('❌ Supabase error:', error);
        throw error;
      }
    } else {
      console.log('✅ Supabase Connected\n');
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('   Check SUPABASE_URL and SUPABASE_SERVICE_KEY in .env\n');
    throw error;
  }
};

module.exports = {
  supabase,
  testSupabaseConnection,
};