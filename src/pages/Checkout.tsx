
import React from "react";
import Layout from "@/components/layout/Layout";
import OrderForm from "@/components/order/OrderForm";
import Cart from "@/components/cart/Cart";
import AlternativeOrdering from "@/components/order/AlternativeOrdering";
import { useCart } from "@/hooks/useCart";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const Checkout: React.FC = () => {
  const { items } = useCart();

  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Checkout</h1>
          <p className="section-subtitle">
            Complete your order information below.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some delicious items to your cart before proceeding to checkout.
            </p>
            <Link to="/menu">
              <Button className="bg-pizza-primary hover:bg-pizza-primary/90">
                View Menu
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
              <OrderForm />
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <Cart />
              </div>
              
              <AlternativeOrdering />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Checkout;
