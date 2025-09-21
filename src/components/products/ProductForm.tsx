import { useState } from "react";
import { Save, X, Upload, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Product, CreateProductForm } from "@/types/product";
import { useUser } from "@/context/UserContext";

interface ProductFormProps {
  product?: Product;
  onSave: (product: CreateProductForm) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ProductForm({ product, onSave, onCancel, loading: externalLoading }: ProductFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const {user} = useUser();
  
  const isLoading = externalLoading || loading;
  
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    brand: product?.brand || "",
    price: product?.price || 0,
    wholesaleCost: product?.wholesaleCost || 0,
    category: product?.category || "",
    stock: product?.stock || 0,
    sku: product?.sku || "",
    imageUrl: product?.imageUrl || "",
    status: product?.status || "draft",
    isMainProduct: product?.type === 'main-supplied' || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Create the form data in the correct format
    const productData: CreateProductForm = {
      name: formData.name,
      description: formData.description,
      brand: formData.brand,
      type: user.role === 'main-admin' ? 'main-supplied' : 'partner-uploaded',
      price: formData.price,
      wholesaleCost: formData.wholesaleCost,
      category: formData.category,
      stock: formData.stock,
      sku: formData.sku,
      margin: margin,
      imageUrl: formData.imageUrl,
      status: formData.status as 'active' | 'draft' | 'archived'
    };
    
    onSave(productData);
    
    setLoading(false);
    toast({
      title: product ? "Product updated" : "Product created",
      description: `Product has been ${product ? 'updated' : 'created'} successfully.`,
    });
  };

  const margin = formData.price > 0 && formData.wholesaleCost > 0 
    ? ((formData.price - formData.wholesaleCost) / formData.price) * 100 
    : 0;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image */}
          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex items-center gap-4">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              )}
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Image URL"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
                <Button type="button" variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Enter brand name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              className="min-h-[100px]"
            />
          </div>

          {/* Category, SKU, and Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="Product SKU"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'draft' | 'archived' }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Draft</Badge>
                      <span className="text-sm text-muted-foreground">- Not visible to customers</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Active</Badge>
                      <span className="text-sm text-muted-foreground">- Live and available</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="archived">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Archived</Badge>
                      <span className="text-sm text-muted-foreground">- Hidden from catalog</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wholesaleCost">Wholesale Cost *</Label>
                <Input
                  id="wholesaleCost"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.wholesaleCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, wholesaleCost: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Margin</Label>
                <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                  <Badge variant={margin > 50 ? "default" : margin > 30 ? "secondary" : "destructive"}>
                    {margin.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                className="max-w-xs"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-primary hover:bg-gradient-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </Button>
            
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
    </div>
  );
}