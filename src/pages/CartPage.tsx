
import React from "react";
import Layout from "@/components/layout/Layout";
import Cart from "@/components/cart/Cart";

const CartPage: React.FC = () => {
  return (
    <Layout>
      <div className="bg-muted py-10 w-full">
        <div className="pizza-container">
          <h1 className="section-title">Your Cart</h1>
          <p className="section-subtitle">
            Review your items before proceeding to checkout.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <Cart />
      </div>
    </Layout>
  );
};

export default CartPage;
