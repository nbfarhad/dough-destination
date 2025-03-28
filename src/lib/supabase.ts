
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

// Helper function to upload image to Supabase Storage
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error } = await supabase.storage.from(bucket).upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadImage function:', error);
    return null;
  }
};

// Mock image upload for development
export const mockImageUpload = async (file: File): Promise<string> => {
  console.log('Mock image upload:', file.name);
  // Return a placeholder URL
  return `/placeholder.svg`;
};
