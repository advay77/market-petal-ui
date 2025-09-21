import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/context/UserContext";
import { ProductManagement } from "@/components/products/ProductManagement";
import { PartnerStoreManagement } from "@/components/products/PartnerStoreManagement";
import { useProductStats } from "@/hooks/useProducts";
import { usePartnerStoreStats } from "@/hooks/usePartnerStore";
import { useProductEvents } from "@/hooks/useWebSocket"; // Import the WebSocket hook
import { Package, TrendingUp, ShoppingCart, AlertCircle, Store, Plus, Wifi, WifiOff, Bell } from "lucide-react";
import { toast } from "sonner";

export default function Products() {
  const { user } = useUser();
  const isMainAdmin = user.role === 'main-admin';
  
  // Get appropriate stats based on user role
  const { stats: adminStats, loading: adminStatsLoading } = useProductStats();
  const { stats: partnerStats, loading: partnerStatsLoading } = usePartnerStoreStats();

  // WebSocket integration for real-time updates
  const token = localStorage.getItem('jwt-token');
  const {
    products: realtimeProducts,
    notifications,
    isConnected,
    connectionError,
    clearNotifications,
    setProducts // To manually sync with existing products
  } = useProductEvents(token || undefined);

  const [showNotifications, setShowNotifications] = useState(false);

  // Handle real-time product updates with toast notifications
  useEffect(() => {
    if (realtimeProducts.length > 0) {
      const latestProduct = realtimeProducts[0];
      toast.success(`New product added: ${latestProduct.name}`, {
        description: `${latestProduct.type} product in ${latestProduct.category}`,
        duration: 5000,
      });
    }
  }, [realtimeProducts]);

  // Handle system notifications
  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[0];
      const toastVariant = latestNotification.priority === 'high' ? 'destructive' : 'default';
      
      toast(latestNotification.title, {
        description: latestNotification.message,
        duration: latestNotification.priority === 'high' ? 8000 : 5000,
      });
    }
  }, [notifications]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const ConnectionStatus = () => (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Real-time updates connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">
                  {connectionError || 'Disconnected from real-time updates'}
                </span>
              </>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-4 w-4 mr-2" />
                {notifications.length} notifications
              </Button>
              
              {showNotifications && (
                <Button variant="ghost" size="sm" onClick={clearNotifications}>
                  Clear All
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Notifications Panel */}
        {showNotifications && notifications.length > 0 && (
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <Alert key={notification.id} className="py-2">
                <AlertDescription>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{notification.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {notification.message}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        notification.priority === 'high' ? 'destructive' : 
                        notification.priority === 'medium' ? 'default' : 
                        'secondary'
                      }>
                        {notification.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStatsCards = () => {
    if (isMainAdmin) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStatsLoading ? '...' : adminStats?.overview.totalProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {adminStatsLoading ? '' : `${adminStats?.overview.mainSupplied || 0} main, ${adminStats?.overview.partnerUploaded || 0} partner`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStatsLoading ? '...' : adminStats?.overview.activeProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {adminStatsLoading ? '' : `${adminStats?.overview.draftProducts || 0} in draft`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStatsLoading ? '...' : formatCurrency(adminStats?.overview.totalValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {adminStatsLoading ? '' : `Avg: ${formatCurrency(adminStats?.overview.averagePrice || 0)}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {adminStatsLoading ? '...' : adminStats?.overview.totalStock || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Units in inventory
              </p>
            </CardContent>
          </Card>
        </div>
      );
    } else {
      // Partner stats
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partnerStatsLoading ? '...' : partnerStats?.totalProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {partnerStatsLoading ? '' : `${partnerStats?.catalogProducts || 0} catalog, ${partnerStats?.ownProducts || 0} own`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Own Products</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partnerStatsLoading ? '...' : partnerStats?.activeOwnProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {partnerStatsLoading ? '' : `${partnerStats?.draftOwnProducts || 0} in draft`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Store Value</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partnerStatsLoading ? '...' : formatCurrency(partnerStats?.totalValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                {partnerStatsLoading ? '' : `Avg: ${formatCurrency(partnerStats?.averagePrice || 0)}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {partnerStatsLoading ? '...' : partnerStats?.totalStock || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Units available
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Connection Status */}
      <ConnectionStatus />

      {/* Statistics Cards */}
      {renderStatsCards()}

      {/* Product Management - Different views for Admin vs Partner */}
      {isMainAdmin ? (
        <ProductManagement 
          viewMode="table"
          showFilters={true}
          showActions={true}
        />
      ) : (
        <Tabs defaultValue="my-products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Products
            </TabsTrigger>
            <TabsTrigger value="store-catalog" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Store Catalog
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-products" className="space-y-6">
            <ProductManagement 
              viewMode="table"
              showFilters={true}
              showActions={true}
              initialFilters={{ type: 'partner-uploaded' }}
            />
          </TabsContent>
          
          <TabsContent value="store-catalog" className="space-y-6">
            <PartnerStoreManagement />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}