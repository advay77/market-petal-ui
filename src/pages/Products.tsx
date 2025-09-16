import { useState } from "react";
import { Package, Plus, Search, Filter, Grid, List, Edit, Trash2, Eye } from "lucide-react";
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
import { mockProducts, Product } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { useToast } from "@/hooks/use-toast";

export default function Products() {
  const { user } = useUser();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const isMainAdmin = user.role === 'main-admin';

  const handleProductAdded = (newProduct: Partial<Product>) => {
    const productWithDefaults = {
      ...newProduct,
      id: newProduct.id || `prod_${Date.now()}`,
      partnerId: !isMainAdmin ? user.partnerId : undefined,
      partnerName: !isMainAdmin ? user.name : undefined,
      type: (newProduct as any).isMainProduct ? 'main-supplied' : 'partner-uploaded',
      status: 'draft' as const,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    } as Product;

    setProducts(prev => [productWithDefaults, ...prev]);
    
    toast({
      title: "Product added successfully",
      description: `${newProduct.name} has been added to your catalog.`,
    });
  };

  // Filter products based on user role and filters
  const filteredProducts = products.filter(product => {
    // Partner admin only sees their own products
    if (!isMainAdmin && product.partnerId !== user.partnerId) {
      return false;
    }

    // Apply search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all' && product.status !== statusFilter) {
      return false;
    }

    // Apply category filter
    if (categoryFilter !== 'all' && product.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: Product['status']) => {
    const variants = {
      active: 'default',
      draft: 'secondary',
      archived: 'outline',
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="aspect-square bg-gradient-subtle relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge(product.status)}
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant={product.type === 'main-supplied' ? 'default' : 'secondary'}>
            {product.type === 'main-supplied' ? 'Main' : 'Partner'}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-lg">{formatCurrency(product.price)}</div>
              {isMainAdmin && (
                <div className="text-xs text-muted-foreground">
                  Cost: {formatCurrency(product.wholesaleCost)} • Margin: {product.margin}%
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Stock</div>
              <div className="font-medium">{product.stock}</div>
            </div>
          </div>
          {product.partnerName && isMainAdmin && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Avatar className="w-5 h-5">
                <AvatarFallback className="text-xs">
                  {product.partnerName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{product.partnerName}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1 mt-3">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isMainAdmin ? 'Products' : 'My Products'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Manage all marketplace products and inventory'
              : 'Manage your product catalog and inventory'
            }
          </p>
        </div>
        <AddProductDialog onProductAdded={handleProductAdded} />
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                {isMainAdmin && <TableHead>Partner</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover"
                      />
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  {isMainAdmin && (
                    <TableCell>
                      {product.partnerName && (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {product.partnerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{product.partnerName}</span>
                        </div>
                      )}
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first product.'}
            </p>
            <AddProductDialog onProductAdded={handleProductAdded} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}