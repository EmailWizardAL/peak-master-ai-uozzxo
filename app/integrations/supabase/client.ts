import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://pvmalrxbrvvipechinor.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2bWFscnhicnZ2aXBlY2hpbm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDExMTEsImV4cCI6MjA3OTY3NzExMX0.3sbmXP4p8rgQBylnxRe79O-5t89J4IR6rs8gvhIN98A";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
