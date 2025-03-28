
import { createClient } from '@supabase/supabase-js';

// Default values for local development - replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Check if credentials are properly set
if (supabaseUrl === 'https://your-project-url.supabase.co' || supabaseAnonKey === 'your-anon-key') {
  console.warn(
    'Supabase credentials not found! Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
    'in your project settings. Using mock client for now.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback function to mock Supabase operations during development
export const mockSupabaseOperation = async (operation: string, data: any) => {
  console.log(`Mock Supabase operation: ${operation}`, data);
  return { 
    data: [{ id: 'mock-id', ...data }], 
    error: null 
  };
};
