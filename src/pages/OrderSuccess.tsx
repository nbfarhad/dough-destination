
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const OrderSuccess: React.FC = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber || Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  return (
    <Layout>
      <div className="pizza-container py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 text-6xl">🍕</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-pizza-primary">Thank You for Your Order!</h1>
          <p className="text-xl mb-8">
            Your order has been received and is being prepared.
          </p>
          
          <div className="bg-muted p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <p className="mb-2">
              <span className="font-medium">Order Number:</span>{" "}
              <span className="text-pizza-primary">{orderNumber}</span>
            </p>
            <p className="mb-2">
              <span className="font-medium">Estimated Time:</span>{" "}
              <span>30-45 minutes</span>
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              You will receive a confirmation via phone when your order is ready.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-pizza-primary hover:bg-pizza-primary/90">
                Back to Home
              </Button>
            </Link>
            <Link to="/menu">
              <Button variant="outline">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;
