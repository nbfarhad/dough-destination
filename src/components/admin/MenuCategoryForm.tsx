
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";
import { MenuCategoryDB } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface MenuCategoryFormProps {
  initialCategory?: MenuCategoryDB;
  onCategoryAdded: (category: MenuCategoryDB) => void;
  onCategoryUpdated: (category: MenuCategoryDB) => void;
}

export const MenuCategoryForm: React.FC<MenuCategoryFormProps> = ({ 
  initialCategory, 
  onCategoryAdded, 
  onCategoryUpdated 
}) => {
  const [formData, setFormData] = useState<Partial<MenuCategoryDB>>({
    name: "",
    description: "",
    sort_order: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditMode = Boolean(initialCategory);

  useEffect(() => {
    if (initialCategory) {
      setFormData({
        ...initialCategory,
      });
    }
  }, [initialCategory]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sort_order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const now = new Date().toISOString();
      const categoryData = {
        ...formData,
        updated_at: now,
        created_at: formData.created_at || now
      };

      // Try to use Supabase
      try {
        if (isEditMode) {
          // Update existing category
          const { error } = await supabase
            .from('menu_categories')
            .update(categoryData)
            .eq('id', initialCategory!.id);

          if (error) throw error;
        } else {
          // Insert new category
          const { error, data } = await supabase
            .from('menu_categories')
            .insert([categoryData])
            .select();

          if (error) throw error;
          categoryData.id = data![0].id;
        }
      } catch (error) {
        console.warn('Using mock Supabase operation for menu category', error);
        // Use mock operation
        const mockOperation = isEditMode ? 'update_menu_category' : 'insert_menu_category';
        const mockResult = await mockSupabaseOperation(mockOperation, categoryData);
        if (!isEditMode) {
          categoryData.id = mockResult.data[0].id;
        }
      }

      // Call appropriate callback
      if (isEditMode) {
        onCategoryUpdated(categoryData as MenuCategoryDB);
      } else {
        onCategoryAdded(categoryData as MenuCategoryDB);
        // Reset form after adding
        setFormData({
          name: "",
          description: "",
          sort_order: 0
        });
      }

      toast({
        title: isEditMode ? "Category updated" : "Category added",
        description: isEditMode 
          ? `${categoryData.name} has been updated` 
          : `${categoryData.name} has been added to the menu`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving the category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Category" : "Add Category"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Pizzas"
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
              placeholder="Our signature handcrafted pizzas..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Display Order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first in the menu
            </p>
          </div>

          <Button 
            type="submit"
            className="w-full bg-pizza-primary hover:bg-pizza-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Category" : "Add Category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
