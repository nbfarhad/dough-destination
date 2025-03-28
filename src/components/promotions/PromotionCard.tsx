
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { Promotion } from "@/data/promotionsData";
import { Link } from "react-router-dom";

interface PromotionCardProps {
  promotion: Promotion;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img
          src={promotion.image || "/placeholder.svg"}
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
        <Badge variant="promotion" className="absolute top-2 left-2">
          Limited Time Offer
        </Badge>
      </div>
      <CardContent className="py-4 flex-grow">
        <h3 className="font-semibold text-xl mb-2">{promotion.title}</h3>
        <p className="text-muted-foreground">{promotion.description}</p>
        <div className="flex items-center gap-1 mt-3 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>
            {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Link to="/order" className="w-full">
          <Button className="w-full bg-pizza-secondary hover:bg-pizza-secondary/90">
            Order Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PromotionCard;
