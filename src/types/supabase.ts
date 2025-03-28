
export interface MenuItemDB {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  vegetarian: boolean;
  spicy: boolean;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface MenuCategoryDB {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface PromotionDB {
  id: string;
  title: string;
  description: string;
  image_url: string;
  start_date: string;
  end_date: string;
  discount_percentage?: number;
  discount_amount?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}
