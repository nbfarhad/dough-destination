
// This file provides an interface for MySQL operations
// In a browser environment, it uses mock data

// Mock data
const mockMenuItems = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, mozzarella, and basil',
    price: 12.99,
    image: '/pizza1.jpg',
    category_id: 'cat1',
    category_name: 'Pizzas'
  },
  {
    id: 'item2',
    name: 'Pepperoni Pizza',
    description: 'Tomato sauce, mozzarella, and pepperoni',
    price: 14.99,
    image: '/pizza2.jpg',
    category_id: 'cat1',
    category_name: 'Pizzas'
  },
  {
    id: 'item3',
    name: 'Garlic Bread',
    description: 'Freshly baked with garlic butter',
    price: 5.99,
    image: '/sides1.jpg',
    category_id: 'cat2',
    category_name: 'Sides'
  }
];

const mockCategories = [
  { id: 'cat1', name: 'Pizzas', sort_order: 1 },
  { id: 'cat2', name: 'Sides', sort_order: 2 },
  { id: 'cat3', name: 'Drinks', sort_order: 3 }
];

const mockPromotions = [
  {
    id: 'promo1',
    title: 'Buy One Get One Free',
    description: 'Order any large pizza and get a second one free!',
    image_url: '/promo1.jpg',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    active: true,
    created_at: '2023-01-01'
  }
];

const mockFeedback = [
  {
    id: 'feedback1',
    name: 'John Doe',
    email: 'john@example.com',
    rating: 5,
    feedback: 'Great pizza, fast delivery!',
    created_at: '2023-06-15T10:30:00Z'
  },
  {
    id: 'feedback2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    rating: 4,
    feedback: 'The pizza was good but arrived a bit cold.',
    created_at: '2023-06-10T18:45:00Z'
  }
];

// Simulated MySQL query function for browser environment
export async function query(sql: string, params: any[] = []) {
  console.log('Mock MySQL query:', sql, params);
  
  // Simulate different query responses based on the SQL
  if (sql.includes('menu_items')) {
    return { data: mockMenuItems, error: null };
  } else if (sql.includes('menu_categories')) {
    return { data: mockCategories, error: null };
  } else if (sql.includes('promotions')) {
    return { data: mockPromotions, error: null };
  } else if (sql.includes('feedback')) {
    return { data: mockFeedback, error: null };
  } else {
    // Default response for other queries
    return { data: [], error: null };
  }
}

// Check database connection - always returns true in browser context
export async function checkDbConnection() {
  console.log('Mock MySQL connection check - always returns true in browser');
  return true;
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

// Mock function for image upload
export async function uploadImageLocally(file: File, directory: string): Promise<string | null> {
  try {
    console.log('Mock local image upload:', file.name, 'to directory:', directory);
    // Return a path that simulates the uploaded image
    return `/local-uploads/${directory}/${file.name}`;
  } catch (error) {
    console.error('Error in mock image upload:', error);
    return null;
  }
}

// Mock function for development - simulates image upload
export function mockImageUploadLocally(file: File): string {
  console.log('Mock local image upload:', file.name);
  // Return a local path to simulate stored image
  return `/local-uploads/${file.name}`;
}
