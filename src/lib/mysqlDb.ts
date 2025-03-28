
import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Default MySQL user - change as needed
  password: '', // Default empty password - change as needed
  database: 'pizza_app', // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function query(sql: string, params: any[] = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return { data: results, error: null };
  } catch (error) {
    console.error('Database query error:', error);
    return { data: null, error };
  }
}

// Check database connection
export async function checkDbConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('MySQL database connection successful');
    return true;
  } catch (error) {
    console.error('MySQL database connection failed:', error);
    return false;
  }
}

// Helper function for menu items
export async function getMenuItems() {
  return query(`
    SELECT m.*, c.name as category_name 
    FROM menu_items m
    LEFT JOIN menu_categories c ON m.category_id = c.id
    WHERE m.available = true
    ORDER BY c.sort_order, m.name
  `);
}

// Helper function for menu categories
export async function getMenuCategories() {
  return query(`
    SELECT * FROM menu_categories 
    ORDER BY sort_order
  `);
}

// Helper function for promotions
export async function getPromotions() {
  return query(`
    SELECT * FROM promotions 
    WHERE active = true 
    AND (NOW() BETWEEN start_date AND end_date OR (NOW() > start_date AND end_date IS NULL))
    ORDER BY created_at DESC
  `);
}

// Helper function for feedback
export async function getFeedback() {
  return query(`
    SELECT * FROM feedback 
    ORDER BY created_at DESC
  `);
}

// Helper function to upload image locally
export async function uploadImageLocally(file: File, directory: string): Promise<string | null> {
  // In a real implementation, you would use a server-side API to handle file uploads
  // This is a simplified version for the frontend
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('directory', directory);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.filePath;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
}

// Mock function for development - simulates image upload
export function mockImageUploadLocally(file: File): string {
  console.log('Mock local image upload:', file.name);
  // Return a local path to simulate stored image
  return `/local-uploads/${file.name}`;
}
