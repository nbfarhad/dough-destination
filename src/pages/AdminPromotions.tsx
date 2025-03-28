
import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { supabase, mockSupabaseOperation, uploadImage, mockImageUpload } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { PromotionForm } from "@/components/admin/PromotionForm";
import { PromotionsList } from "@/components/admin/PromotionsList";
import { PromotionDB } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminPromotions: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const { data, error } = await supabase
          .from('promotions')
          .select('*')
          .order('start_date', { ascending: false });

        if (error) throw error;
        setPromotions(data || []);
      } catch (error) {
        console.error('Error fetching promotions:', error);
        // Use mock data for development
        const mockData = await mockSupabaseOperation('select_promotions', {});
        setPromotions(mockData.data as PromotionDB[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handlePromotionAdded = (newPromotion: PromotionDB) => {
    setPromotions(prev => [...prev, newPromotion]);
    toast({
      title: "Promotion added",
      description: `${newPromotion.title} has been added`,
    });
  };

  const handlePromotionUpdated = (updatedPromotion: PromotionDB) => {
    setPromotions(prev => 
      prev.map(promo => promo.id === updatedPromotion.id ? updatedPromotion : promo)
    );
    toast({
      title: "Promotion updated",
      description: `${updatedPromotion.title} has been updated`,
    });
  };

  const handlePromotionDeleted = (id: string) => {
    setPromotions(prev => prev.filter(promo => promo.id !== id));
    toast({
      title: "Promotion deleted",
      description: "The promotion has been removed",
    });
  };

  const handleUploadImage = async (file: File): Promise<string | null> => {
    try {
      // Try to upload to Supabase Storage
      const imageUrl = await uploadImage(file, 'promotion-images', 'promotions');
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
          <h1 className="section-title">Promotions Management</h1>
          <p className="section-subtitle">
            Manage your promotional offers and deals
          </p>
        </div>
      </div>

      <div className="pizza-container py-10">
        <div className="flex justify-end mb-6">
          <Button 
            onClick={() => navigate('/admin')}
            variant="outline"
          >
            Back to Admin
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PromotionForm 
              onPromotionAdded={handlePromotionAdded}
              onPromotionUpdated={handlePromotionUpdated}
              uploadImage={handleUploadImage}
            />
          </div>
          <div className="lg:col-span-2">
            <PromotionsList 
              promotions={promotions}
              loading={loading}
              onDelete={handlePromotionDeleted}
              onEdit={handlePromotionUpdated}
              uploadImage={handleUploadImage}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPromotions;
