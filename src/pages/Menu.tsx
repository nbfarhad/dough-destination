
import React from "react";
import Layout from "@/components/layout/Layout";
import MenuCategory from "@/components/menu/MenuCategory";
import { menuCategories } from "@/data/menuData";

const Menu: React.FC = () => {
  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Our Menu</h1>
          <p className="section-subtitle">
            Browse our delicious selection of handcrafted pizzas and more.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        {menuCategories.map((category) => (
          <MenuCategory key={category.id} category={category} />
        ))}
      </div>
    </Layout>
  );
};

export default Menu;
