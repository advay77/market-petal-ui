import { useState } from "react";
import { Users, Plus, Search, Filter, MapPin, DollarSign, Package, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPartners, Partner } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export default function Partners() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Only main admin can access partners page
  if (user.role !== 'main-admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
          <p className="text-muted-foreground">
            This section is only available to main administrators.
          </p>
        </div>
      </div>
    );
  }

  // Filter partners based on search and filters
  const filteredPartners = mockPartners.filter(partner => {
    // Apply search filter
    if (searchTerm && !partner.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all' && partner.status !== statusFilter) {
      return false;
    }

    // Apply category filter
    if (categoryFilter !== 'all' && partner.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: Partner['status']) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      suspended: 'destructive',
      inactive: 'outline',
    } as const;

    const colors = {
      active: 'bg-success text-success-foreground',
      pending: 'bg-warning text-warning-foreground',
      suspended: 'bg-destructive text-destructive-foreground',
      inactive: 'bg-muted text-muted-foreground',
    } as const;

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const PartnerCard = ({ partner }: { partner: Partner }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={partner.avatar} alt={partner.name} />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {partner.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{partner.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {partner.location}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge(partner.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Category</span>
          <Badge variant="outline">{partner.category}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-success">
              <DollarSign className="w-3 h-3" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="font-semibold">{formatCurrency(partner.revenue)}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-info">
              <ShoppingCart className="w-3 h-3" />
              <span className="text-xs text-muted-foreground">Orders</span>
            </div>
            <div className="font-semibold">{partner.ordersCount}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-primary">
              <Package className="w-3 h-3" />
              <span className="text-xs text-muted-foreground">Stores</span>
            </div>
            <div className="font-semibold">{partner.storeCount}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Commission</div>
            <div className="font-semibold">{partner.commission}%</div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-2">
            Joined {new Date(partner.joinedDate).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              View Details
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Partners</h1>
          <p className="text-muted-foreground mt-1">
            Manage marketplace partners and their performance
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Invite Partner
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Partners</div>
                <div className="text-xl font-bold">{mockPartners.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Active</div>
                <div className="text-xl font-bold">
                  {mockPartners.filter(p => p.status === 'active').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Users className="w-4 h-4 text-warning" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-xl font-bold">
                  {mockPartners.filter(p => p.status === 'pending').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-info" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-xl font-bold">
                  {formatCurrency(mockPartners.reduce((sum, p) => sum + p.revenue, 0))}
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
                  placeholder="Search partners..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPartners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No partners found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Invite your first partner to get started.'}
            </p>
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Invite Partner
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}