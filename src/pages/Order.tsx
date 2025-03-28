
import React from "react";
import Layout from "@/components/layout/Layout";
import { menuCategories } from "@/data/menuData";
import MenuCategory from "@/components/menu/MenuCategory";
import AlternativeOrdering from "@/components/order/AlternativeOrdering";

const Order: React.FC = () => {
  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Order Online</h1>
          <p className="section-subtitle">
            Browse our menu and add items to your cart.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-3">
            {menuCategories.map((category) => (
              <MenuCategory key={category.id} category={category} />
            ))}
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AlternativeOrdering />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Order;
