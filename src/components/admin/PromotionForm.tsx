
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { PromotionDB } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface PromotionFormProps {
  initialPromotion?: PromotionDB;
  onPromotionAdded: (promotion: PromotionDB) => void;
  onPromotionUpdated: (promotion: PromotionDB) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export const PromotionForm: React.FC<PromotionFormProps> = ({ 
  initialPromotion, 
  onPromotionAdded, 
  onPromotionUpdated,
  uploadImage
}) => {
  const [formData, setFormData] = useState<Partial<PromotionDB>>({
    title: "",
    description: "",
    image_url: "/placeholder.svg",
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
    discount_percentage: 0,
    discount_amount: 0,
    active: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg");
  const { toast } = useToast();
  const isEditMode = Boolean(initialPromotion);

  useEffect(() => {
    if (initialPromotion) {
      setFormData({
        ...initialPromotion,
        // Convert dates to YYYY-MM-DD format for input fields
        start_date: initialPromotion.start_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        end_date: initialPromotion.end_date?.split('T')[0] || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      });
      setImagePreview(initialPromotion.image_url || "/placeholder.svg");
    }
  }, [initialPromotion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "discount_percentage" || name === "discount_amount" 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleToggleChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      active: checked,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = formData.image_url;

      // Upload image if there's a new file
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const now = new Date().toISOString();
      const promotionData = {
        ...formData,
        image_url: imageUrl || "/placeholder.svg",
        updated_at: now,
        created_at: formData.created_at || now
      };

      // Try to use Supabase
      try {
        if (isEditMode) {
          // Update existing promotion
          const { error } = await supabase
            .from('promotions')
            .update(promotionData)
            .eq('id', initialPromotion!.id);

          if (error) throw error;
        } else {
          // Insert new promotion
          const { error, data } = await supabase
            .from('promotions')
            .insert([promotionData])
            .select();

          if (error) throw error;
          promotionData.id = data![0].id;
        }
      } catch (error) {
        console.warn('Using mock Supabase operation for promotion', error);
        // Use mock operation
        const mockOperation = isEditMode ? 'update_promotion' : 'insert_promotion';
        const mockResult = await mockSupabaseOperation(mockOperation, promotionData);
        if (!isEditMode) {
          promotionData.id = mockResult.data[0].id;
        }
      }

      // Call appropriate callback
      if (isEditMode) {
        onPromotionUpdated(promotionData as PromotionDB);
      } else {
        onPromotionAdded(promotionData as PromotionDB);
        // Reset form after adding
        setFormData({
          title: "",
          description: "",
          image_url: "/placeholder.svg",
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
          discount_percentage: 0,
          discount_amount: 0,
          active: true
        });
        setImageFile(null);
        setImagePreview("/placeholder.svg");
      }

      toast({
        title: isEditMode ? "Promotion updated" : "Promotion added",
        description: isEditMode 
          ? `${promotionData.title} has been updated` 
          : `${promotionData.title} has been added`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving the promotion",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Promotion" : "Add Promotion"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Promotion Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Buy One Get One Free"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Buy any large pizza and get a second one free..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Promotion Image</Label>
            <div className="flex items-center space-x-4">
              <div 
                className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex items-center justify-center"
              >
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
              <Input
                id="discount_percentage"
                name="discount_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.discount_percentage}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_amount">Discount Amount ($)</Label>
              <Input
                id="discount_amount"
                name="discount_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.discount_amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active" className="cursor-pointer">Active</Label>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={handleToggleChange}
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-pizza-secondary hover:bg-pizza-secondary/90"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Promotion" : "Add Promotion"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
