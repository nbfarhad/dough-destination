
import React from "react";
import Layout from "@/components/layout/Layout";
import PromotionCard from "@/components/promotions/PromotionCard";
import { promotions } from "@/data/promotionsData";

const Promotions: React.FC = () => {
  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Promotions & Deals</h1>
          <p className="section-subtitle">
            Check out our current promotions and special offers.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => (
            <PromotionCard key={promotion.id} promotion={promotion} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Promotions;
