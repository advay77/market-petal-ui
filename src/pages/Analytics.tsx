import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { mockAnalytics } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";

const revenueData = [
  { month: 'Jan', revenue: 32000, orders: 145 },
  { month: 'Feb', revenue: 38000, orders: 167 },
  { month: 'Mar', revenue: 42000, orders: 189 },
  { month: 'Apr', revenue: 48000, orders: 223 },
  { month: 'May', revenue: 52000, orders: 256 },
  { month: 'Jun', revenue: 58000, orders: 289 },
  { month: 'Jul', revenue: 62000, orders: 312 },
  { month: 'Aug', revenue: 65000, orders: 334 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: 'hsl(213, 94%, 18%)' },
  { name: 'Fashion', value: 25, color: 'hsl(160, 84%, 39%)' },
  { name: 'Home & Garden', value: 20, color: 'hsl(38, 92%, 50%)' },
  { name: 'Sports', value: 12, color: 'hsl(142, 76%, 36%)' },
  { name: 'Beauty', value: 8, color: 'hsl(221, 83%, 53%)' },
];

const topProducts = [
  { name: 'Wireless Headphones', sales: 245, revenue: 48990 },
  { name: 'Cotton T-Shirt', sales: 189, revenue: 5667 },
  { name: 'Yoga Mat', sales: 156, revenue: 9354 },
  { name: 'Vitamin C Serum', sales: 134, revenue: 6162 },
  { name: 'Garden System', sales: 98, revenue: 14698 },
];

export default function Analytics() {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState('30d');
  
  const isMainAdmin = user.role === 'main-admin';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Track marketplace performance and partner metrics'
              : 'Monitor your store performance and sales data'
            }
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isMainAdmin ? 'Total Revenue' : 'My Revenue'}
                </p>
                <p className="text-2xl font-bold">{formatCurrency(mockAnalytics.overview.totalRevenue)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">
                    {formatPercentage(mockAnalytics.overview.revenueGrowth)}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isMainAdmin ? 'Total Orders' : 'My Orders'}
                </p>
                <p className="text-2xl font-bold">{mockAnalytics.overview.totalOrders.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">
                    {formatPercentage(mockAnalytics.overview.ordersGrowth)}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isMainAdmin && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Partners</p>
                  <p className="text-2xl font-bold">{mockAnalytics.overview.activePartners}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-500">
                      {formatPercentage(mockAnalytics.overview.partnersGrowth)}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-success-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {isMainAdmin ? 'Products Listed' : 'My Products'}
                </p>
                <p className="text-2xl font-bold">1,247</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+5.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          {isMainAdmin && <TabsTrigger value="partners">Partners</TabsTrigger>}
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over the last 8 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(213, 94%, 18%)" 
                      fill="hsl(213, 94%, 18%)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Product category performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
              <CardDescription>Number of orders processed monthly</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="orders" 
                    fill="hsl(160, 84%, 39%)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Best selling products by units and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(product.revenue)}</p>
                      <Progress 
                        value={(product.sales / topProducts[0].sales) * 100} 
                        className="w-20 h-2 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isMainAdmin && (
          <TabsContent value="partners" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Partner Performance</CardTitle>
                  <CardDescription>Revenue by partner this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockAnalytics.chartData.ordersByPartner}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="partner" />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey="orders" 
                        fill="hsl(38, 92%, 50%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partner Growth</CardTitle>
                  <CardDescription>New partners joining over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">This Month</span>
                    <Badge className="bg-green-500">+3 new partners</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Last Month</span>
                    <Badge variant="secondary">+2 new partners</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Growth Rate</span>
                    <span className="text-sm text-green-500 font-medium">+25%</span>
                  </div>
                  <Progress value={75} className="w-full" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}