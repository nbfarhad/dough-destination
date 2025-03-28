
import React from "react";
import Layout from "@/components/layout/Layout";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const Feedback: React.FC = () => {
  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Share Your Feedback</h1>
          <p className="section-subtitle">
            We value your opinions and want to hear about your experience.
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <div className="max-w-2xl mx-auto">
          <FeedbackForm />
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
