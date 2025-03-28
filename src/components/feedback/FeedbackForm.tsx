import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { mysqlQuery } from "@/lib/supabase";

interface FeedbackFormData {
  name: string;
  email: string;
  rating: string;
  orderNumber?: string;
  feedback: string;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    email: "",
    rating: "5",
    orderNumber: "",
    feedback: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRatingChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save feedback using MySQL instead of Supabase
      const { error } = await mysqlQuery('feedback', 'insert', { 
        name: formData.name,
        email: formData.email,
        rating: parseInt(formData.rating),
        order_number: formData.orderNumber || null,
        feedback: formData.feedback,
        created_at: new Date().toISOString()
      });

      if (error) throw error;
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
      setFormData({
        name: "",
        email: "",
        rating: "5",
        orderNumber: "",
        feedback: "",
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your.email@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="orderNumber">Order Number (optional)</Label>
        <Input
          id="orderNumber"
          name="orderNumber"
          value={formData.orderNumber}
          onChange={handleChange}
          placeholder="e.g. 12345"
        />
      </div>
      <div className="space-y-2">
        <Label>Your Rating</Label>
        <RadioGroup
          value={formData.rating}
          onValueChange={handleRatingChange}
          className="flex space-x-4"
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <div key={rating} className="flex items-center space-x-1">
              <RadioGroupItem value={String(rating)} id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="cursor-pointer">
                {rating}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="feedback">Your Feedback</Label>
        <Textarea
          id="feedback"
          name="feedback"
          value={formData.feedback}
          onChange={handleChange}
          placeholder="Tell us about your experience..."
          rows={4}
          required
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-pizza-primary hover:bg-pizza-primary/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  );
};

export default FeedbackForm;
