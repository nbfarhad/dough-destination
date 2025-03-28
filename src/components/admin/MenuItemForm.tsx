
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MenuItemDB, MenuCategoryDB } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface MenuItemFormProps {
  categories: MenuCategoryDB[];
  initialItem?: MenuItemDB;
  onItemAdded: (item: MenuItemDB) => void;
  onItemUpdated: (item: MenuItemDB) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ 
  categories, 
  initialItem, 
  onItemAdded, 
  onItemUpdated,
  uploadImage
}) => {
  const [formData, setFormData] = useState<Partial<MenuItemDB>>({
    name: "",
    description: "",
    price: 0,
    category_id: "",
    image_url: "/placeholder.svg",
    vegetarian: false,
    spicy: false,
    available: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("/placeholder.svg");
  const { toast } = useToast();
  const isEditMode = Boolean(initialItem);

  useEffect(() => {
    if (initialItem) {
      setFormData({
        ...initialItem,
      });
      setImagePreview(initialItem.image_url || "/placeholder.svg");
    }
  }, [initialItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
      const itemData = {
        ...formData,
        image_url: imageUrl || "/placeholder.svg",
        updated_at: now,
        created_at: formData.created_at || now
      };

      // Try to use Supabase
      try {
        if (isEditMode) {
          // Update existing item
          const { error } = await supabase
            .from('menu_items')
            .update(itemData)
            .eq('id', initialItem!.id);

          if (error) throw error;
        } else {
          // Insert new item
          const { error, data } = await supabase
            .from('menu_items')
            .insert([itemData])
            .select();

          if (error) throw error;
          itemData.id = data![0].id;
        }
      } catch (error) {
        console.warn('Using mock Supabase operation for menu item', error);
        // Use mock operation
        const mockOperation = isEditMode ? 'update_menu_item' : 'insert_menu_item';
        const mockResult = await mockSupabaseOperation(mockOperation, itemData);
        if (!isEditMode) {
          itemData.id = mockResult.data[0].id;
        }
      }

      // Call appropriate callback
      if (isEditMode) {
        onItemUpdated(itemData as MenuItemDB);
      } else {
        onItemAdded(itemData as MenuItemDB);
        // Reset form after adding
        setFormData({
          name: "",
          description: "",
          price: 0,
          category_id: "",
          image_url: "/placeholder.svg",
          vegetarian: false,
          spicy: false,
          available: true
        });
        setImageFile(null);
        setImagePreview("/placeholder.svg");
      }

      toast({
        title: isEditMode ? "Item updated" : "Item added",
        description: isEditMode 
          ? `${itemData.name} has been updated` 
          : `${itemData.name} has been added to the menu`,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was an error saving the menu item",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Menu Item" : "Add Menu Item"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Pizza Margherita"
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
              placeholder="Classic tomato and mozzarella pizza..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => handleSelectChange("category_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Item Image</Label>
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

          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="vegetarian" className="cursor-pointer">Vegetarian</Label>
              <Switch
                id="vegetarian"
                checked={formData.vegetarian}
                onCheckedChange={(checked) => handleToggleChange("vegetarian", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="spicy" className="cursor-pointer">Spicy</Label>
              <Switch
                id="spicy"
                checked={formData.spicy}
                onCheckedChange={(checked) => handleToggleChange("spicy", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="available" className="cursor-pointer">Available</Label>
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => handleToggleChange("available", checked)}
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="w-full bg-pizza-primary hover:bg-pizza-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Item" : "Add Item"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
