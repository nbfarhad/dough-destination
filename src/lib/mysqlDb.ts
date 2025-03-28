
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

const mockOrders = [
  {
    id: 'order1',
    order_number: 'ORD12345',
    customer_name: 'John Doe',
    order_type: 'delivery',
    total_amount: 35.99,
    status: 'completed',
    created_at: '2023-06-15T10:30:00Z'
  },
  {
    id: 'order2',
    order_number: 'ORD12346',
    customer_name: 'Jane Smith',
    order_type: 'pickup',
    total_amount: 22.50,
    status: 'pending',
    created_at: '2023-06-16T14:45:00Z'
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
  } else if (sql.includes('orders')) {
    return { data: mockOrders, error: null };
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

// Create table schema helper functions - using VARCHAR(36) for ID fields instead of UUID
export function createTablesIfNotExist() {
  // These SQL statements use VARCHAR(36) instead of UUID type for compatibility
  const createMenuCategoriesTable = `
    CREATE TABLE IF NOT EXISTS menu_categories (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createMenuItemsTable = `
    CREATE TABLE IF NOT EXISTS menu_items (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255),
      category_id VARCHAR(36),
      vegetarian BOOLEAN DEFAULT FALSE,
      spicy BOOLEAN DEFAULT FALSE,
      available BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES menu_categories(id)
    )
  `;

  const createPromotionsTable = `
    CREATE TABLE IF NOT EXISTS promotions (
      id VARCHAR(36) PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      description TEXT,
      image_url VARCHAR(255),
      start_date DATE NOT NULL,
      end_date DATE,
      discount_percentage DECIMAL(5, 2),
      discount_amount DECIMAL(10, 2),
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createFeedbackTable = `
    CREATE TABLE IF NOT EXISTS feedback (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      rating INT NOT NULL,
      feedback TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createOrdersTable = `
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(36) PRIMARY KEY,
      order_number VARCHAR(20) NOT NULL,
      customer_name VARCHAR(100) NOT NULL,
      customer_email VARCHAR(100),
      customer_phone VARCHAR(20),
      order_type ENUM('delivery', 'pickup', 'dine-in') NOT NULL,
      delivery_address TEXT,
      payment_method ENUM('cash', 'card', 'online') NOT NULL,
      notes TEXT,
      subtotal DECIMAL(10, 2) NOT NULL,
      delivery_fee DECIMAL(10, 2) DEFAULT 0,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;

  const createOrderItemsTable = `
    CREATE TABLE IF NOT EXISTS order_items (
      id VARCHAR(36) PRIMARY KEY,
      order_id VARCHAR(36) NOT NULL,
      item_id VARCHAR(36) NOT NULL,
      item_name VARCHAR(100) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    )
  `;

  console.log('Mock table creation in browser environment - would execute these queries on a real server');
  // In a real server environment, these queries would be executed
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
