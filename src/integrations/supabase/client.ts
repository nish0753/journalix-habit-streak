// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hynltrocukhcsmvpbmhc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bmx0cm9jdWtoY3NtdnBibWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNTA3ODMsImV4cCI6MjA1OTkyNjc4M30.s68OuA1q0TpAOClz9QH1sx7O5KBcTyRLG30qlRUBETg";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);