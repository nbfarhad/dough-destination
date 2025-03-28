
export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const promotions: Promotion[] = [
  {
    id: "promo1",
    title: "2 Medium Pizzas for $20",
    description: "Get two medium 1-topping pizzas for just $20. Valid for takeaway or delivery.",
    image: "/promotion-2-pizzas.jpg",
    startDate: "2023-05-01",
    endDate: "2023-06-30",
    active: true,
  },
  {
    id: "promo2",
    title: "Free Garlic Knots",
    description: "Spend $25 or more and get a free order of garlic knots. Limited time offer!",
    image: "/promotion-garlic-knots.jpg",
    startDate: "2023-05-15",
    endDate: "2023-06-15",
    active: true,
  },
  {
    id: "promo3",
    title: "Lunch Special: Pizza + Drink $9.99",
    description: "Valid Monday-Friday from 11am to 3pm. Choose any small pizza and a fountain drink.",
    image: "/promotion-lunch.jpg",
    startDate: "2023-05-01",
    endDate: "2023-12-31",
    active: true,
  },
];

export const getActivePromotions = (): Promotion[] => {
  const today = new Date();
  return promotions.filter((promo) => {
    const startDate = new Date(promo.startDate);
    const endDate = new Date(promo.endDate);
    return promo.active && today >= startDate && today <= endDate;
  });
};
