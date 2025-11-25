
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://pvmalrxbrvvipechinor.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_cYKFrGOMpRrlwBgPaAU5mw_uMr85b51';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

console.log('Supabase client initialized');
