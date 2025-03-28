
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { CartItem as CartItemType } from "@/hooks/useCart";
import { useCart } from "@/hooks/useCart";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center py-4 border-b">
      <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden mr-4">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h4 className="font-medium">{item.name}</h4>
        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-20">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="text-center"
          />
        </div>
        <div className="w-20 text-right font-medium">
          ${(item.price * item.quantity).toFixed(2)}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="text-muted-foreground h-8 w-8"
          onClick={handleRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
