import { useState } from "react";
import { ShoppingCart, Search, Filter, Eye, Package, Truck, CheckCircle, XCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { mockOrders, Order } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";

export default function Orders() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isMainAdmin = user.role === 'main-admin';

  // Filter orders based on user role and filters
  const filteredOrders = mockOrders.filter(order => {
    // Partner admin only sees their own orders
    if (!isMainAdmin && order.partnerId !== user.partnerId) {
      return false;
    }

    // Apply search filter
    if (searchTerm && 
        !order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    const variants = {
      placed: 'secondary',
      processing: 'default',
      shipped: 'outline',
      delivered: 'default',
      completed: 'default',
      cancelled: 'destructive',
    } as const;

    const colors = {
      placed: 'bg-info text-info-foreground',
      processing: 'bg-warning text-warning-foreground',
      shipped: 'bg-primary text-primary-foreground',
      delivered: 'bg-success text-success-foreground',
      completed: 'bg-success text-success-foreground',
      cancelled: 'bg-destructive text-destructive-foreground',
    } as const;

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return <ShoppingCart className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isMainAdmin ? 'Orders' : 'My Orders'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Monitor and manage all marketplace orders'
              : 'Track and manage your store orders'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <ShoppingCart className="w-4 h-4 text-info" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <div className="text-xl font-bold">{filteredOrders.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Package className="w-4 h-4 text-warning" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Processing</div>
                <div className="text-xl font-bold">
                  {filteredOrders.filter(o => o.status === 'processing').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Shipped</div>
                <div className="text-xl font-bold">
                  {filteredOrders.filter(o => o.status === 'shipped').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-xl font-bold">
                  {filteredOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="placed">Placed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              {isMainAdmin && <TableHead>Partner</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{order.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
                  </div>
                </TableCell>
                {isMainAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {order.partnerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{order.partnerName}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    {getStatusBadge(order.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{formatCurrency(order.total)}</div>
                    {isMainAdmin && (
                      <div className="text-xs text-muted-foreground">
                        Commission: {formatCurrency(order.commission)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                  </div>
                </TableCell>
                <TableCell>
                  {order.review ? (
                    <div className="space-y-1">
                      {renderRating(order.review.rating)}
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {order.review.comment}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No review</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredOrders.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Orders will appear here once customers start purchasing.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}