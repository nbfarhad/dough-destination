
import { createClient } from '@supabase/supabase-js';
import { checkDbConnection, query, mockImageUploadLocally } from './mysqlDb';

// Default values for local development - replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client (kept for compatibility with existing code)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if MySQL database is available (used in local mode)
let isLocalDbAvailable = false;
checkDbConnection().then(available => {
  isLocalDbAvailable = available;
  if (available) {
    console.log('Using local MySQL database instead of Supabase');
  } else {
    console.warn(
      'Local MySQL database connection failed. Make sure MySQL is running and the database is created. ' +
      'Falling back to mock operations.'
    );
  }
});

// Override Supabase operations with MySQL operations
export const mysqlQuery = async (table: string, operation: string, data?: any) => {
  if (!isLocalDbAvailable) {
    return mockSupabaseOperation(operation, data || {});
  }

  try {
    // Map operations to MySQL queries based on the requested operation
    switch (operation) {
      case 'select':
        return await query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
      case 'insert':
        const keys = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        return await query(`INSERT INTO ${table} (${keys}) VALUES (${placeholders})`, values);
      case 'update':
        if (!data.id) throw new Error('ID is required for update operation');
        const id = data.id;
        delete data.id; // Remove id from data to be updated
        const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
        return await query(`UPDATE ${table} SET ${setClause} WHERE id = ?`, [...Object.values(data), id]);
      case 'delete':
        if (!data.id) throw new Error('ID is required for delete operation');
        return await query(`DELETE FROM ${table} WHERE id = ?`, [data.id]);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  } catch (error) {
    console.error(`Error in mysqlQuery (${operation} on ${table}):`, error);
    return { data: null, error };
  }
};

// Fallback function to mock Supabase operations during development
export const mockSupabaseOperation = async (operation: string, data: any) => {
  console.log(`Mock Database operation: ${operation}`, data);
  return { 
    data: [{ id: 'mock-id', ...data, created_at: new Date().toISOString() }], 
    error: null 
  };
};

// Helper function to upload image locally
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    if (!file) return null;
    
    if (isLocalDbAvailable) {
      // Use local file storage
      const directory = bucket + '/' + path;
      return await mockImageUploadLocally(file);
    } else {
      // Fallback to Supabase Storage when running in development without MySQL
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
    }
  } catch (error) {
    console.error('Error in uploadImage function:', error);
    return null;
  }
};

// Mock image upload for development
export const mockImageUpload = async (file: File): Promise<string> => {
  console.log('Mock image upload:', file.name);
  // Return a placeholder URL
  return mockImageUploadLocally(file);
};
