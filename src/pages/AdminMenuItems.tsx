
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase, mockSupabaseOperation, uploadImage, mockImageUpload } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import { MenuItemsList } from "@/components/admin/MenuItemsList";
import { MenuCategoryForm } from "@/components/admin/MenuCategoryForm";
import { MenuCategoriesList } from "@/components/admin/MenuCategoriesList";
import { MenuItemDB, MenuCategoryDB } from "@/types/supabase";
import { useNavigate } from "react-router-dom";

const AdminMenuItems: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItemDB[]>([]);
  const [categories, setCategories] = useState<MenuCategoryDB[]>([]);
  const [loading, setLoading] = useState({ items: true, categories: true });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('name');

        if (error) throw error;
        setMenuItems(data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        // Use mock data for development
        const mockData = await mockSupabaseOperation('select_menu_items', {});
        setMenuItems(mockData.data as MenuItemDB[]);
      } finally {
        setLoading(prev => ({ ...prev, items: false }));
      }
    };

    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_categories')
          .select('*')
          .order('sort_order');

        if (error) throw error;
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Use mock data for development
        const mockData = await mockSupabaseOperation('select_categories', {});
        setCategories(mockData.data as MenuCategoryDB[]);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };

    fetchMenuItems();
    fetchCategories();
  }, []);

  const handleItemAdded = (newItem: MenuItemDB) => {
    setMenuItems(prev => [...prev, newItem]);
    toast({
      title: "Menu item added",
      description: `${newItem.name} has been added to the menu`,
    });
  };

  const handleItemUpdated = (updatedItem: MenuItemDB) => {
    setMenuItems(prev => 
      prev.map(item => item.id === updatedItem.id ? updatedItem : item)
    );
    toast({
      title: "Menu item updated",
      description: `${updatedItem.name} has been updated`,
    });
  };

  const handleItemDeleted = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Menu item deleted",
      description: "The menu item has been removed",
    });
  };

  const handleCategoryAdded = (newCategory: MenuCategoryDB) => {
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Category added",
      description: `${newCategory.name} has been added`,
    });
  };

  const handleCategoryUpdated = (updatedCategory: MenuCategoryDB) => {
    setCategories(prev => 
      prev.map(category => category.id === updatedCategory.id ? updatedCategory : category)
    );
    toast({
      title: "Category updated",
      description: `${updatedCategory.name} has been updated`,
    });
  };

  const handleCategoryDeleted = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
    toast({
      title: "Category deleted",
      description: "The category has been removed",
    });
  };

  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      // Try to upload to Supabase Storage
      const imageUrl = await uploadImage(file, 'menu-images', 'items');
      if (imageUrl) return imageUrl;
      
      // Fall back to mock image upload if Supabase fails
      return await mockImageUpload(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Image upload failed",
        description: "There was an error uploading the image. Using placeholder.",
        variant: "destructive",
      });
      return '/placeholder.svg';
    }
  };

  return (
    <Layout>
      <div className="bg-muted py-10">
        <div className="pizza-container">
          <h1 className="section-title">Menu Management</h1>
          <p className="section-subtitle">
            Manage your menu items and categories
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <Tabs defaultValue="items">
          <TabsList className="mb-8">
            <TabsTrigger value="items">Menu Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="back" onClick={() => navigate('/admin')}>
              Back to Admin
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <MenuItemForm 
                  categories={categories}
                  onItemAdded={handleItemAdded}
                  onItemUpdated={handleItemUpdated}
                  uploadImage={handleUploadImage}
                />
              </div>
              <div className="lg:col-span-2">
                <MenuItemsList 
                  items={menuItems}
                  categories={categories}
                  loading={loading.items}
                  onDelete={handleItemDeleted}
                  onEdit={handleItemUpdated}
                  uploadImage={handleUploadImage}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <MenuCategoryForm 
                  onCategoryAdded={handleCategoryAdded}
                  onCategoryUpdated={handleCategoryUpdated}
                />
              </div>
              <div className="lg:col-span-2">
                <MenuCategoriesList 
                  categories={categories}
                  loading={loading.categories}
                  onDelete={handleCategoryDeleted}
                  onEdit={handleCategoryUpdated}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminMenuItems;
