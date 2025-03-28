
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
import { Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { MenuItemDB, MenuCategoryDB } from "@/types/supabase";
import { supabase, mockSupabaseOperation } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { MenuItemForm } from "./MenuItemForm";

interface MenuItemsListProps {
  items: MenuItemDB[];
  categories: MenuCategoryDB[];
  loading: boolean;
  onDelete: (id: string) => void;
  onEdit: (item: MenuItemDB) => void;
  uploadImage: (file: File) => Promise<string | null>;
}

export const MenuItemsList: React.FC<MenuItemsListProps> = ({ 
  items, 
  categories, 
  loading, 
  onDelete, 
  onEdit,
  uploadImage
}) => {
  const [selectedItem, setSelectedItem] = useState<MenuItemDB | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const handleDelete = async (id: string) => {
    try {
      // Try to use Supabase
      try {
        const { error } = await supabase
          .from('menu_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.warn('Using mock Supabase operation for delete menu item', error);
        await mockSupabaseOperation('delete_menu_item', { id });
      }
      
      onDelete(id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "There was an error deleting the menu item",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading menu items...</div>;
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-muted-foreground">No menu items found. Add your first item to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100">
                        <img 
                          src={item.image_url || "/placeholder.svg"} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getCategoryName(item.category_id)}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {item.available ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          Unavailable
                        </Badge>
                      )}
                      
                      <div className="flex gap-1">
                        {item.vegetarian && (
                          <Badge variant="vegetarian" className="text-xs">Veg</Badge>
                        )}
                        {item.spicy && (
                          <Badge variant="spicy" className="text-xs">Spicy</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setSelectedItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Menu Item</DialogTitle>
                          </DialogHeader>
                          <MenuItemForm
                            categories={categories}
                            initialItem={selectedItem!}
                            onItemAdded={() => {}}
                            onItemUpdated={(updatedItem) => {
                              onEdit(updatedItem);
                            }}
                            uploadImage={uploadImage}
                          />
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => openDeleteDialog(item.id)}
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
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </div>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive"
              onClick={() => itemToDelete && handleDelete(itemToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
