
import { createClient } from '@supabase/supabase-js';
import { query, checkDbConnection, mockImageUploadLocally } from './mysqlDb';

// Default values for local development - replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a Supabase client (kept for compatibility with existing code)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Variable to track if MySQL database is available
let isLocalDbAvailable = true;

// Check MYSQL database connection - just log the result, don't need to change behavior
checkDbConnection().then(available => {
  console.log('MySQL database available:', available);
  isLocalDbAvailable = available;
});

// Override Supabase operations with MySQL operations
export const mysqlQuery = async (table: string, operation: string, data?: any) => {
  console.log(`MySQL query on table ${table}, operation: ${operation}`, data);
  
  try {
    // Map operations to queries based on the requested operation
    switch (operation) {
      case 'select':
        return await query(`SELECT * FROM ${table} ORDER BY created_at DESC`);
      case 'insert':
        // Simulate an insert and return the inserted item with an ID
        console.log(`Simulating INSERT into ${table}`, data);
        return { 
          data: [{ id: `mock-${Date.now()}`, ...data, created_at: new Date().toISOString() }],
          error: null 
        };
      case 'update':
        // Simulate an update
        console.log(`Simulating UPDATE of ${table} with ID ${data?.id}`, data);
        return { 
          data: [{ ...data, updated_at: new Date().toISOString() }],
          error: null 
        };
      case 'delete':
        // Simulate a delete operation
        console.log(`Simulating DELETE from ${table} with ID ${data?.id}`);
        return { data: [{ id: data?.id }], error: null };
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
  
  // For feedback-specific operations, return mock feedback data
  if (operation.includes('feedback')) {
    return { 
      data: [
        { 
          id: 'mock-feedback-1', 
          name: 'Mock User',
          email: 'mock@example.com',
          rating: 5,
          feedback: 'This is some mock feedback!',
          created_at: new Date().toISOString() 
        },
        { 
          id: 'mock-feedback-2', 
          name: 'Another User',
          email: 'another@example.com',
          rating: 4,
          feedback: 'Pizza was great!',
          created_at: new Date(Date.now() - 86400000).toISOString() 
        }
      ], 
      error: null 
    };
  }
  
  // For order-related operations
  if (operation.includes('order')) {
    return { 
      data: [{ 
        id: 'mock-order-id', 
        order_number: data.order_number || 'MOCK123',
        ...data, 
        created_at: new Date().toISOString() 
      }], 
      error: null 
    };
  }
  
  // Default mock response
  return { 
    data: [{ id: 'mock-id', ...data, created_at: new Date().toISOString() }], 
    error: null 
  };
};

// Helper function to upload image locally
export const uploadImage = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    if (!file) return null;
    
    // Always use mock image upload in browser environment
    const directory = bucket + '/' + path;
    console.log(`Uploading image to ${directory}`);
    return await mockImageUploadLocally(file);
    
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
