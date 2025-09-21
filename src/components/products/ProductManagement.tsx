import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Grid, List, MoreHorizontal, Edit, Trash2, Eye, Package } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { useUser } from "@/context/UserContext";
import { useProducts } from "@/hooks/useProducts";
import { Product, ProductFilters, ProductViewMode } from "@/types/product";
import { AddProductDialog } from "./AddProductDialog";

interface ProductManagementProps {
  viewMode?: ProductViewMode;
  showFilters?: boolean;
  showActions?: boolean;
  initialFilters?: ProductFilters;
}

export function ProductManagement({ 
  viewMode = 'table',
  showFilters = true,
  showActions = true,
  initialFilters = {}
}: ProductManagementProps) {
  const { user } = useUser();
  const [currentViewMode, setCurrentViewMode] = useState<ProductViewMode>(viewMode);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const {
    products,
    loading,
    error,
    filters,
    createProduct,
    updateProduct,
    deleteProduct,
    updateFilters,
    refreshProducts
  } = useProducts(initialFilters);

  const isMainAdmin = user.role === 'main-admin';

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterChange = (key: keyof ProductFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value === 'all' ? undefined : value
    };
    updateFilters(newFilters);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: Product['status']) => {
    const variants = {
      active: 'default',
      draft: 'secondary',
      archived: 'outline',
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeBadge = (type: Product['type']) => {
    return (
      <Badge variant={type === 'main-supplied' ? 'default' : 'outline'}>
        {type === 'main-supplied' ? 'Main' : 'Partner'}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderTableView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {isMainAdmin ? 'All Products' : 'My Products'}
            </CardTitle>
            <CardDescription>
              {isMainAdmin 
                ? 'Manage all products in the system'
                : 'Manage your products and store catalog'
              }
            </CardDescription>
          </div>
          {showActions && (
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                {showActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 7 : 6} className="text-center py-8">
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={showActions ? 7 : 6} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={product.imageUrl} alt={product.name} />
                          <AvatarFallback>{product.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.brand} • {product.sku}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(product.type)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    {showActions && (
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditProduct(product)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProduct(product)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            Error: {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={refreshProducts}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Type Filter */}
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Product Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="main-supplied">Main Supplied</SelectItem>
                  <SelectItem value="partner-uploaded">Partner Uploaded</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg">
                <Button
                  variant={currentViewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentViewMode('table')}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentViewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentViewMode('grid')}
                  className="rounded-l-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      {currentViewMode === 'table' ? renderTableView() : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Grid view implementation would go here */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                Grid view coming soon...
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Product Dialog */}
      <AddProductDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={async (productData) => {
          try {
            await createProduct(productData);
            setShowAddDialog(false);
          } catch (error) {
            // Error handled in hook
          }
        }}
        onCancel={() => setShowAddDialog(false)}
      />

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <AddProductDialog 
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          product={selectedProduct}
          onSave={async (productData) => {
            try {
              await updateProduct(selectedProduct.id, productData);
              setShowEditDialog(false);
              setSelectedProduct(null);
            } catch (error) {
              // Error handled in hook
            }
          }}
          onCancel={() => {
            setShowEditDialog(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
