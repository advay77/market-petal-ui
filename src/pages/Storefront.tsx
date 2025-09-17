import { useState } from "react";
import { Store, Eye, Edit, Settings, Palette, Globe, Star, Users, Package, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Mock storefront data
const mockStorefrontData = {
  storeInfo: {
    name: "TechnoGear Electronics",
    description: "Premium electronics and gadgets for tech enthusiasts. We offer the latest in consumer electronics with competitive prices and excellent customer service.",
    logo: "",
    banner: "",
    website: "https://technogear.com",
    isPublic: true,
    rating: 4.8,
    totalReviews: 247,
    followers: 1542,
    totalProducts: 24,
    establishedDate: "2022-03-15"
  },
  recentProducts: [
    {
      id: "p1",
      name: "Wireless Bluetooth Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      price: 89.99,
      rating: 4.5,
      sales: 156
    },
    {
      id: "p2", 
      name: "Smart Fitness Watch",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
      price: 199.99,
      rating: 4.7,
      sales: 89
    },
    {
      id: "p3",
      name: "Portable Phone Charger",
      image: "https://images.unsplash.com/photo-1609592062458-c7cfb4327137?w=200&h=200&fit=crop",
      price: 29.99,
      rating: 4.3,
      sales: 234
    }
  ],
  recentReviews: [
    {
      id: "r1",
      customerName: "Sarah Johnson",
      rating: 5,
      comment: "Excellent product quality and fast shipping. Highly recommended!",
      date: "2024-01-10",
      productName: "Wireless Headphones"
    },
    {
      id: "r2",
      customerName: "Mike Chen",
      rating: 4,
      comment: "Good value for money. The watch works great and battery life is impressive.",
      date: "2024-01-08",
      productName: "Smart Fitness Watch"
    }
  ]
};

export default function Storefront() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const [storeData, setStoreData] = useState(mockStorefrontData.storeInfo);

  // Only partner admin can access storefront page
  if (user.role !== 'partner-admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            This section is only available to partner administrators.
          </p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setStoreData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Storefront</h1>
          <p className="text-muted-foreground mt-1">
            Manage your store appearance and customer experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview Store
          </Button>
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Globe className="w-4 h-4 mr-2" />
            Visit Store
          </Button>
        </div>
      </div>

      {/* Store Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Store Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData.rating}</div>
            <div className="text-xs text-muted-foreground">
              {storeData.totalReviews} reviews
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Followers</CardTitle>
            <Heart className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData.followers.toLocaleString()}</div>
            <div className="text-xs text-success">
              +12% this month
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData.totalProducts}</div>
            <div className="text-xs text-muted-foreground">
              Active listings
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Store Views</CardTitle>
            <Eye className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2K</div>
            <div className="text-xs text-success">
              +25% this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Store Settings</TabsTrigger>
          <TabsTrigger value="products">Featured Products</TabsTrigger>
          <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Store Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Store Preview
                </CardTitle>
                <CardDescription>How your store appears to customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Store Header */}
                  <div className="p-4 border rounded-lg bg-gradient-subtle">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Store className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{storeData.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center">
                            {renderStars(Math.floor(storeData.rating))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            ({storeData.totalReviews} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {storeData.followers} followers
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {storeData.totalProducts} products
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Store Description */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">About Our Store</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {storeData.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Store Analytics
                </CardTitle>
                <CardDescription>Recent performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Store Visits Today</span>
                    <span className="font-bold text-primary">342</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Product Views</span>
                    <span className="font-bold text-secondary">1,247</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <span className="font-bold text-success">3.2%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Avg. Order Value</span>
                    <span className="font-bold">{formatCurrency(67.50)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Store Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Store Configuration
              </CardTitle>
              <CardDescription>Customize your store information and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={storeData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    placeholder="https://yourstore.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  value={storeData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your store and products..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Public Store</Label>
                  <div className="text-sm text-muted-foreground">
                    Allow customers to discover and visit your store
                  </div>
                </div>
                <Switch
                  checked={storeData.isPublic}
                  onCheckedChange={(checked) => handleInputChange("isPublic", checked)}
                />
              </div>

              <div className="pt-4 border-t">
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Featured Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Featured Products
              </CardTitle>
              <CardDescription>Showcase your best-selling products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockStorefrontData.recentProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <h4 className="font-medium line-clamp-1 mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{formatCurrency(product.price)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{product.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {product.sales} sold
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Customer Reviews
              </CardTitle>
              <CardDescription>Recent feedback from your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStorefrontData.recentReviews.map((review) => (
                  <div key={review.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {review.customerName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{review.customerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{review.comment}</p>
                    <Badge variant="outline" className="text-xs">
                      {review.productName}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
