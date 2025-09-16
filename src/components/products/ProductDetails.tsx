import { useState } from "react";
import { Package, Edit, Trash2, Eye, Star, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";

interface ProductDetailsProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProductDetails({ product, onEdit, onDelete }: ProductDetailsProps) {
  const { user } = useUser();
  const isMainAdmin = user.role === 'main-admin';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: Product['status']) => {
    const variants = {
      active: 'default',
      draft: 'secondary',
      archived: 'outline',
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const mockAnalytics = {
    totalSold: 245,
    revenue: 48990,
    views: 1234,
    conversionRate: 19.8,
    rating: 4.8,
    reviews: 67,
    salesTrend: 12.5,
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="flex-1">
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            Complete information about {product.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 h-64 bg-gradient-subtle rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <p className="text-muted-foreground mt-1">{product.description}</p>
                </div>
                <div className="flex gap-2">
                  {getStatusBadge(product.status)}
                  <Badge variant={product.type === 'main-supplied' ? 'default' : 'secondary'}>
                    {product.type === 'main-supplied' ? 'Main Product' : 'Partner Product'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-xl font-bold">{formatCurrency(product.price)}</p>
                </div>
                
                {isMainAdmin && (
                  <div>
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="text-lg font-semibold">{formatCurrency(product.wholesaleCost)}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <p className="text-lg font-semibold text-green-600">{product.margin}%</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="text-lg font-semibold">{product.stock}</p>
                </div>
              </div>

              {product.partnerName && isMainAdmin && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{product.partnerName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{product.partnerName}</p>
                    <p className="text-sm text-muted-foreground">Partner</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={onEdit} className="bg-gradient-primary hover:bg-gradient-primary/90">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Product
                </Button>
                <Button variant="destructive" onClick={onDelete}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="font-medium">{formatDate(product.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="font-medium">{formatDate(product.updatedAt)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Selling Price:</span>
                      <span className="font-medium">{formatCurrency(product.price)}</span>
                    </div>
                    {isMainAdmin && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Wholesale Cost:</span>
                        <span className="font-medium">{formatCurrency(product.wholesaleCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit Margin:</span>
                      <span className="font-medium text-green-600">{product.margin}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit per Unit:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(product.price - product.wholesaleCost)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Units Sold</p>
                        <p className="text-2xl font-bold">{mockAnalytics.totalSold}</p>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-500">+{mockAnalytics.salesTrend}%</span>
                        </div>
                      </div>
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">{formatCurrency(mockAnalytics.revenue)}</p>
                        <div className="flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          <span className="text-xs text-green-500">+{mockAnalytics.salesTrend}%</span>
                        </div>
                      </div>
                      <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                        <p className="text-2xl font-bold">{mockAnalytics.conversionRate}%</p>
                        <p className="text-xs text-muted-foreground">{mockAnalytics.views} views</p>
                      </div>
                      <Eye className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold">{mockAnalytics.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {mockAnalytics.reviews} reviews
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-sm w-2">{rating}</span>
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <Progress value={rating === 5 ? 70 : rating === 4 ? 20 : 5} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground w-8">
                          {rating === 5 ? '70%' : rating === 4 ? '20%' : '5%'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Stock updated</p>
                        <p className="text-sm text-muted-foreground">Stock increased to {product.stock} units</p>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Price updated</p>
                        <p className="text-sm text-muted-foreground">Price changed to {formatCurrency(product.price)}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">1 day ago</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">Product created</p>
                        <p className="text-sm text-muted-foreground">Product was added to catalog</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(product.createdAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}