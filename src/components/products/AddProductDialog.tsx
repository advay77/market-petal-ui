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
import { Product, CreateProductForm } from "@/types/product";
import { CreateProductPayload } from "@/api/products";

interface AddProductDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (product: CreateProductPayload) => Promise<void>;
  onCancel?: () => void;
  product?: Product; // For editing
  trigger?: React.ReactNode;
}

export function AddProductDialog({ 
  open, 
  onOpenChange, 
  onSave, 
  onCancel, 
  product,
  trigger 
}: AddProductDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const handleSave = async (productData: CreateProductForm) => {
    if (!onSave) return;
    
    setLoading(true);
    try {
      await onSave(productData);
      setDialogOpen?.(false);
    } catch (error) {
      // Error handled in parent component
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel?.();
    setDialogOpen?.(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {product 
              ? 'Update the product information below.'
              : 'Create a new product for your marketplace. Fill in all the required information below.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ProductForm 
            onSave={handleSave} 
            onCancel={handleCancel}
            product={product}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
