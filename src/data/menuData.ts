
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
  promotion?: {
    active: boolean;
    discountPercentage?: number;
    discountAmount?: number;
    newPrice?: number;
  };
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

export const pizzas: MenuItem[] = [
  {
    id: "p1",
    name: "Margherita",
    description: "Classic tomato sauce, mozzarella, and fresh basil",
    price: 10.99,
    image: "/pizza-margherita.jpg",
    category: "pizza",
    vegetarian: true,
    popular: true,
  },
  {
    id: "p2",
    name: "Pepperoni",
    description: "Tomato sauce, mozzarella, and spicy pepperoni",
    price: 12.99,
    image: "/pizza-pepperoni.jpg",
    category: "pizza",
    popular: true,
    promotion: {
      active: true,
      discountPercentage: 15,
      newPrice: 11.04
    }
  },
  {
    id: "p3",
    name: "Supreme",
    description: "Tomato sauce, mozzarella, pepperoni, sausage, bell peppers, onions, and olives",
    price: 14.99,
    image: "/pizza-supreme.jpg",
    category: "pizza",
  },
  {
    id: "p4",
    name: "Vegetarian",
    description: "Tomato sauce, mozzarella, bell peppers, mushrooms, onions, and olives",
    price: 13.99,
    image: "/pizza-vegetarian.jpg",
    category: "pizza",
    vegetarian: true,
  },
  {
    id: "p5",
    name: "Hawaiian",
    description: "Tomato sauce, mozzarella, ham, and pineapple",
    price: 13.99,
    image: "/pizza-hawaiian.jpg",
    category: "pizza",
  },
  {
    id: "p6",
    name: "Buffalo Chicken",
    description: "Buffalo sauce, mozzarella, grilled chicken, and ranch drizzle",
    price: 15.99,
    image: "/pizza-buffalo.jpg",
    category: "pizza",
    spicy: true,
  },
];

export const sides: MenuItem[] = [
  {
    id: "s1",
    name: "Garlic Knots",
    description: "Freshly baked, twisted dough with garlic butter and herbs",
    price: 5.99,
    image: "/garlic-knots.jpg",
    category: "sides",
    vegetarian: true,
    promotion: {
      active: true,
      discountAmount: 1,
      newPrice: 4.99
    }
  },
  {
    id: "s2",
    name: "Cheese Sticks",
    description: "Breadsticks topped with mozzarella, served with marinara sauce",
    price: 6.99,
    image: "/cheese-sticks.jpg",
    category: "sides",
    vegetarian: true,
  },
  {
    id: "s3",
    name: "Chicken Wings",
    description: "8 pieces of crispy chicken wings with your choice of sauce",
    price: 9.99,
    image: "/chicken-wings.jpg",
    category: "sides",
  },
];

export const drinks: MenuItem[] = [
  {
    id: "d1",
    name: "Soda",
    description: "20oz bottle of your choice of soda",
    price: 2.49,
    image: "/soda.jpg",
    category: "drinks",
    vegetarian: true,
  },
  {
    id: "d2",
    name: "Bottled Water",
    description: "16oz bottle of purified water",
    price: 1.99,
    image: "/water.jpg",
    category: "drinks",
    vegetarian: true,
  },
  {
    id: "d3",
    name: "Iced Tea",
    description: "20oz bottle of unsweetened iced tea",
    price: 2.49,
    image: "/iced-tea.jpg",
    category: "drinks",
    vegetarian: true,
  },
];

export const desserts: MenuItem[] = [
  {
    id: "de1",
    name: "Chocolate Chip Cookies",
    description: "3 freshly baked chocolate chip cookies",
    price: 3.99,
    image: "/cookies.jpg",
    category: "desserts",
    vegetarian: true,
  },
  {
    id: "de2",
    name: "Cinnamon Sticks",
    description: "Sweet dough sticks with cinnamon sugar and icing",
    price: 5.99,
    image: "/cinnamon-sticks.jpg",
    category: "desserts",
    vegetarian: true,
    promotion: {
      active: true,
      discountPercentage: 20,
      newPrice: 4.79
    }
  },
];

export const menuCategories: MenuCategory[] = [
  {
    id: "cat-pizza",
    name: "Pizzas",
    items: pizzas,
  },
  {
    id: "cat-sides",
    name: "Sides",
    items: sides,
  },
  {
    id: "cat-drinks",
    name: "Drinks",
    items: drinks,
  },
  {
    id: "cat-desserts",
    name: "Desserts",
    items: desserts,
  },
];

export const allMenuItems: MenuItem[] = [
  ...pizzas,
  ...sides,
  ...drinks,
  ...desserts,
];

export const getItemById = (id: string): MenuItem | undefined => {
  return allMenuItems.find(item => item.id === id);
};

export const getPromotions = (): MenuItem[] => {
  return allMenuItems.filter(item => item.promotion && item.promotion.active);
};

export const getPopularItems = (): MenuItem[] => {
  return allMenuItems.filter(item => item.popular);
};
