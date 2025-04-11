
import { createClient } from '@supabase/supabase-js';

// Default values for local development - replace these with your actual Supabase project values
const DEFAULT_SUPABASE_URL = 'https://your-supabase-project.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'your-anon-key';

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Check if required environment variables are defined with actual values (not just defaults)
const isProduction = import.meta.env.PROD;
const usingDefaultValues = supabaseUrl === DEFAULT_SUPABASE_URL || supabaseAnonKey === DEFAULT_SUPABASE_ANON_KEY;

if (isProduction && usingDefaultValues) {
  console.error('Missing Supabase environment variables in production. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !usingDefaultValues;
};
