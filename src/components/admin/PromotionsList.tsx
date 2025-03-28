
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";
import { PromotionDB } from "@/types/supabase";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { PromotionForm } from "./PromotionForm";
import { format } from "date-fns";

interface PromotionsListProps {
  promotions: PromotionDB[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (promotion: PromotionDB) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export const PromotionsList: React.FC<PromotionsListProps> = ({ 
  promotions, 
  loading, 
  onDelete, 
  onEdit,
  uploadImage
}) => {
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionDB | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      // Try to use Supabase
      try {
        const { error } = await supabase
          .from('promotions')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('Using mock Supabase operation for delete promotion', error);
        await mockSupabaseOperation('delete_promotion', { id });
      }
      
      onDelete(id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the promotion",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setPromotionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (promo: PromotionDB) => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    
    if (!promo.active) {
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Inactive</Badge>;
    } else if (now < startDate) {
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Upcoming</Badge>;
    } else if (now > endDate) {
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Expired</Badge>;
    } else {
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Active</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading promotions...</div>;
  }

  if (promotions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No promotions found. Add your first promotion to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Promotions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={promo.image_url || "/placeholder.svg"} 
                          alt={promo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div>{promo.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {promo.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>Start: {formatDate(promo.start_date)}</div>
                      <div>End: {formatDate(promo.end_date)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {promo.discount_percentage > 0 && (
                      <div>{promo.discount_percentage}% off</div>
                    )}
                    {promo.discount_amount > 0 && (
                      <div>${promo.discount_amount.toFixed(2)} off</div>
                    )}
                    {promo.discount_percentage === 0 && promo.discount_amount === 0 && (
                      <div>Special offer</div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(promo)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedPromotion(promo)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Promotion</DialogTitle>
                          </DialogHeader>
                          <PromotionForm
                            initialPromotion={selectedPromotion!}
                            onPromotionAdded={() => {}}
                            onPromotionUpdated={(updatedPromotion) => {
                              onEdit(updatedPromotion);
                            }}
                            uploadImage={uploadImage}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => openDeleteDialog(promo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this promotion? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => promotionToDelete && handleDelete(promotionToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
