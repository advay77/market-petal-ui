import React, { useState, useEffect } from 'react';
import { Plus, Search, Store, Package, Settings, Trash2, RefreshCw, Zap, DollarSign, Box } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { usePartnerStore, useAvailableMainProducts } from "@/hooks/usePartnerStore";
import { useUser } from "@/context/UserContext";
import { Product } from "@/types/product";

export function PartnerStoreManagement() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Custom price and stock for adding products
  const [customPrice, setCustomPrice] = useState<string>('');
  const [customStock, setCustomStock] = useState<string>('');

  const {
    catalog,
    loading: catalogLoading,
    error: catalogError,
    addProductToStore,
    removeProductFromStore,
    updateStoreProduct,
    refreshCatalog
  } = usePartnerStore();

  const {
    products: availableProducts,
    loading: availableLoading,
    refreshProducts: refreshAvailable
  } = useAvailableMainProducts(selectedCategory);

  // Load data on component mount
  useEffect(() => {
    refreshCatalog();
    refreshAvailable();
  }, [refreshCatalog, refreshAvailable]);

  // Filter catalog based on search term
  const filteredCatalog = catalog.filter(item =>
    item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique categories from available products
  const categories = Array.from(new Set(availableProducts.map(p => p.category)));

  const handleAddToStore = async (product: Product) => {
    try {
      const priceValue = customPrice ? parseFloat(customPrice) : product.price;
      const stockValue = customStock ? parseInt(customStock) : 0;
      
      await addProductToStore({
        productId: product.id,
        customPrice: priceValue,
        customStock: stockValue
      });
      
      setShowAddDialog(false);
      setCustomPrice('');
      setCustomStock('');
      refreshAvailable();
      
      toast.success('Product added to store!', {
        description: `${product.name} is now available in your store`,
      });
    } catch (error) {
      toast.error('Failed to add product', {
        description: 'Please try again later',
      });
    }
  };

  const handleRemoveFromStore = async (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to remove "${productName}" from your store?`)) {
      try {
        await removeProductFromStore(productId);
        refreshAvailable();
        
        toast.success('Product removed', {
          description: `${productName} has been removed from your store`,
        });
      } catch (error) {
        toast.error('Failed to remove product', {
          description: 'Please try again later',
        });
      }
    }
  };

  const handleUpdateSettings = async (productId: string, settings: any) => {
    try {
      await updateStoreProduct(productId, settings);
      setShowSettingsDialog(false);
      setSelectedProduct(null);
      
      toast.success('Settings updated', {
        description: 'Product settings have been saved',
      });
    } catch (error) {
      toast.error('Failed to update settings', {
        description: 'Please try again later',
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const AddProductDialog = () => (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Main Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Main Product to Your Store</DialogTitle>
          <DialogDescription>
            Choose from available main products to add to your store catalog.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('')}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Global Price and Stock Settings */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="globalPrice">Default Custom Price (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="globalPrice"
                  type="number"
                  step="0.01"
                  value={customPrice}
                  onChange={(e) => setCustomPrice(e.target.value)}
                  placeholder="Use original price"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="globalStock">Default Stock Quantity</Label>
              <div className="relative">
                <Box className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="globalStock"
                  type="number"
                  value={customStock}
                  onChange={(e) => setCustomStock(e.target.value)}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Products List */}
          {availableLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading available products...
            </div>
          ) : availableProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              {selectedCategory ? `No products available in "${selectedCategory}"` : 'No products available to add'}
              <div className="text-sm mt-2">
                {selectedCategory ? 'Try selecting a different category' : 'There are no main products available to add'}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {availableProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={product.imageUrl} alt={product.name} />
                      <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.brand} • {formatCurrency(product.price)}
                      </div>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Your Price:</div>
                      <div className="font-medium">
                        {customPrice ? formatCurrency(parseFloat(customPrice)) : formatCurrency(product.price)}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToStore(product)}
                    >
                      Add to Store
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  const ProductSettingsDialog = () => (
    <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Product Settings</DialogTitle>
          <DialogDescription>
            Update settings for {selectedProduct?.product.name}
          </DialogDescription>
        </DialogHeader>
        {selectedProduct && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customPrice">Custom Price</Label>
              <Input
                id="customPrice"
                type="number"
                step="0.01"
                defaultValue={selectedProduct.customPrice}
                placeholder="Enter custom price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customStock">Stock Quantity</Label>
              <Input
                id="customStock"
                type="number"
                defaultValue={selectedProduct.customStock || 0}
                placeholder="Enter stock quantity"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                defaultChecked={selectedProduct.isActive}
              />
              <Label htmlFor="isActive">Active in store</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={() => {
                  const customPrice = parseFloat((document.getElementById('customPrice') as HTMLInputElement)?.value || '0');
                  const customStock = parseInt((document.getElementById('customStock') as HTMLInputElement)?.value || '0');
                  const isActive = (document.getElementById('isActive') as HTMLInputElement)?.checked;
                  
                  handleUpdateSettings(selectedProduct.product.id, {
                    customPrice: customPrice || undefined,
                    customStock: customStock || undefined,
                    isActive
                  });
                }}
                className="bg-gradient-primary hover:bg-gradient-primary/90"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSettingsDialog(false);
                  setSelectedProduct(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  if (catalogError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Error: {catalogError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={()=>{refreshCatalog}}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                My Store Catalog
              </CardTitle>
              <CardDescription>
                Manage main products in your store catalog
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <AddProductDialog />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  refreshCatalog();
                  refreshAvailable();
                }}
                disabled={catalogLoading || availableLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${(catalogLoading || availableLoading) ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search catalog products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Catalog Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Your Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catalogLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading catalog...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCatalog.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? 'No products match your search' : 'No products in your catalog'}
                      </div>
                      {!searchTerm && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => setShowAddDialog(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Products
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCatalog.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={item.product.imageUrl} alt={item.product.name} />
                            <AvatarFallback>{item.product.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{item.product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.product.brand || 'No Brand'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(item.product.price)}</TableCell>
                      <TableCell>
                        <span className={item.customPrice && item.customPrice !== item.product.price ? 'font-medium text-blue-600' : ''}>
                          {item.customPrice ? formatCurrency(item.customPrice) : formatCurrency(item.product.price)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={(item.customStock || 0) <= 5 ? 'text-red-600 font-medium' : ''}>
                          {item.customStock || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? 'default' : 'secondary'}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedProduct(item);
                                setShowSettingsDialog(true);
                              }}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveFromStore(item.product.id, item.product.name)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProductSettingsDialog />
    </div>
  );
}