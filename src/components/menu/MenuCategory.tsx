
import React from "react";
import MenuItem from "./MenuItem";
import { MenuCategory as MenuCategoryType } from "@/data/menuData";

interface MenuCategoryProps {
  category: MenuCategoryType;
}

const MenuCategory: React.FC<MenuCategoryProps> = ({ category }) => {
  return (
    <section id={`category-${category.id}`} className="py-8">
      <h2 className="menu-category-title">{category.name}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

export default MenuCategory;
