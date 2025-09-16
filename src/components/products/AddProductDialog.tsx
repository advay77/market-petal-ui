import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProductForm } from "./ProductForm";
import { Product } from "@/lib/mock-data";

interface AddProductDialogProps {
  onProductAdded?: (product: Partial<Product>) => void;
  trigger?: React.ReactNode;
}

export function AddProductDialog({ onProductAdded, trigger }: AddProductDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSave = (product: Partial<Product>) => {
    // Generate a new ID for the product
    const newProduct = {
      ...product,
      id: `prod_${Date.now()}`,
      status: 'draft' as const,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    // Call the parent callback
    onProductAdded?.(newProduct);
    
    // Close the dialog
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Create a new product for your marketplace. Fill in all the required information below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ProductForm onSave={handleSave} onCancel={handleCancel} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
