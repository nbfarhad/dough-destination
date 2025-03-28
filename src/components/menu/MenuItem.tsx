
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { MenuItem as MenuItemType } from "@/data/menuData";
import { useCart } from "@/hooks/useCart";

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="h-40 overflow-hidden relative">
        <img 
          src={item.image || "/placeholder.svg"} 
          alt={item.name}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
        />
        <div className="absolute top-2 left-2 flex gap-1">
          {item.vegetarian && (
            <Badge variant="vegetarian">Vegetarian</Badge>
          )}
          {item.spicy && (
            <Badge variant="spicy">Spicy</Badge>
          )}
          {item.promotion?.active && (
            <Badge variant="promotion">
              {item.promotion.discountPercentage 
                ? `-${item.promotion.discountPercentage}%` 
                : item.promotion.discountAmount 
                  ? `-$${item.promotion.discountAmount}` 
                  : 'Sale'}
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="py-4 flex-grow">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center border-t pt-4">
        <div className="flex items-end gap-1">
          {item.promotion?.active && item.promotion.newPrice ? (
            <>
              <span className="text-lg font-bold text-pizza-primary">${formatPrice(item.promotion.newPrice)}</span>
              <span className="text-sm text-muted-foreground line-through">${formatPrice(item.price)}</span>
            </>
          ) : (
            <span className="text-lg font-bold text-pizza-primary">${formatPrice(item.price)}</span>
          )}
        </div>
        <Button 
          onClick={handleAddToCart} 
          className="bg-pizza-primary hover:bg-pizza-primary/90"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MenuItem;
