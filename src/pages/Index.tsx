
import React from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import MenuItem from "@/components/menu/MenuItem";
import PromotionCard from "@/components/promotions/PromotionCard";
import { getPopularItems } from "@/data/menuData";
import { getActivePromotions } from "@/data/promotionsData";

const Index: React.FC = () => {
  const popularItems = getPopularItems().slice(0, 3);
  const activePromotions = getActivePromotions().slice(0, 2);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-pizza-dark text-white">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/pizza-hero.jpg')", 
            backgroundPosition: "center 30%",
          }}
        ></div>
        <div className="pizza-container relative z-10 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Delicious Pizza, Delivered to Your Door
            </h1>
            <p className="text-xl mb-8 text-gray-100">
              Handcrafted pizzas made with fresh ingredients and baked to perfection. Available for delivery or takeaway.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/menu">
                <Button size="lg" className="bg-pizza-primary hover:bg-pizza-primary/90 text-white">
                  View Our Menu
                </Button>
              </Link>
              <Link to="/order">
                <Button size="lg" className="bg-pizza-secondary hover:bg-pizza-secondary/90 text-white">
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Menu Items */}
      <section className="py-16 bg-white">
        <div className="pizza-container">
          <h2 className="section-title">Our Most Popular Pizzas</h2>
          <p className="section-subtitle">
            Check out our customer favorites, made with the freshest ingredients and crafted to perfection.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/menu">
              <Button className="bg-pizza-primary hover:bg-pizza-primary/90">
                View Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Current Promotions */}
      <section className="py-16 bg-muted">
        <div className="pizza-container">
          <h2 className="section-title">Current Promotions</h2>
          <p className="section-subtitle">
            Take advantage of our limited-time offers and save on your favorite pizzas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activePromotions.map((promo) => (
              <PromotionCard key={promo.id} promotion={promo} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/promotions">
              <Button className="bg-pizza-secondary hover:bg-pizza-secondary/90">
                View All Promotions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ordering Options */}
      <section className="py-16 bg-white">
        <div className="pizza-container">
          <h2 className="section-title">Easy Ordering Options</h2>
          <p className="section-subtitle">
            Choose the ordering method that works best for you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-pizza-light border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="h-16 w-16 bg-pizza-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pizza-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Order Online</h3>
                  <p className="text-muted-foreground mb-4">
                    Quick and easy ordering through our website.
                  </p>
                  <Link to="/order">
                    <Button className="w-full bg-pizza-primary hover:bg-pizza-primary/90">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-pizza-light border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="h-16 w-16 bg-pizza-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pizza-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                  <p className="text-muted-foreground mb-4">
                    Give us a call to place your order directly.
                  </p>
                  <a href="tel:+1234567890">
                    <Button className="w-full bg-pizza-primary hover:bg-pizza-primary/90">
                      (123) 456-7890
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-pizza-light border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="h-16 w-16 bg-pizza-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pizza-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">WhatsApp / Social</h3>
                  <p className="text-muted-foreground mb-4">
                    Message us on WhatsApp or social media.
                  </p>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-pizza-primary hover:bg-pizza-primary/90">
                      Message Us
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-pizza-dark text-white">
        <div className="pizza-container">
          <h2 className="section-title text-white">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-transparent border border-white/20">
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="italic mb-4">
                      "The best pizza in town! I order from them at least once a week. Always fresh and delicious."
                    </p>
                  </div>
                  <div className="font-semibold">- Sarah J.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border border-white/20">
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="italic mb-4">
                      "I love the variety of options and the quality of ingredients. The delivery is always prompt and the food arrives hot!"
                    </p>
                  </div>
                  <div className="font-semibold">- Michael R.</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-transparent border border-white/20">
              <CardContent className="pt-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <p className="italic mb-4">
                      "Their customer service is exceptional. I had a special request and they went above and beyond to accommodate it."
                    </p>
                  </div>
                  <div className="font-semibold">- Emily T.</div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-10">
            <Link to="/feedback">
              <Button className="bg-white text-pizza-dark hover:bg-white/90">
                Leave Your Feedback
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
