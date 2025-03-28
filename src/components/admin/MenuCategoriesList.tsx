
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { MenuCategoryDB } from "@/types/supabase";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { MenuCategoryForm } from "./MenuCategoryForm";

interface MenuCategoriesListProps {
  categories: MenuCategoryDB[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (category: MenuCategoryDB) => void;
}

export const MenuCategoriesList: React.FC<MenuCategoriesListProps> = ({ 
  categories, 
  loading, 
  onDelete, 
  onEdit 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MenuCategoryDB | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      // Try to use Supabase
      try {
        const { error } = await supabase
          .from('menu_categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('Using mock Supabase operation for delete category', error);
        await mockSupabaseOperation('delete_menu_category', { id });
      }
      
      onDelete(id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the category",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading categories...</div>;
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Menu Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {category.description}
                  </TableCell>
                  <TableCell>{category.sort_order}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedCategory(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Category</DialogTitle>
                          </DialogHeader>
                          <MenuCategoryForm
                            initialCategory={selectedCategory!}
                            onCategoryAdded={() => {}}
                            onCategoryUpdated={(updatedCategory) => {
                              onEdit(updatedCategory);
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => openDeleteDialog(category.id)}
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
            <p>Are you sure you want to delete this category? This might affect menu items assigned to this category.</p>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
