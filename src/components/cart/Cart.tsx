
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

const Cart: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link to="/menu">
          <Button className="bg-pizza-primary hover:bg-pizza-primary/90">
            View Menu
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
        </div>

        <div className="divide-y">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="bg-muted p-4 rounded-lg mb-6">
        <div className="flex justify-between font-medium">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          Delivery fee and taxes will be calculated at checkout
        </div>
      </div>

      <div className="flex justify-end">
        <div className="flex gap-3">
          <Link to="/menu">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link to="/checkout">
            <Button className="bg-pizza-primary hover:bg-pizza-primary/90">
              Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
