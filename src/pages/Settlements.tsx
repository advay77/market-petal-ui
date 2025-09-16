import { useState } from "react";
import { CreditCard, Search, Eye, DollarSign, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { mockSettlements, Settlement } from "@/lib/mock-data";
import { useUser } from "@/context/UserContext";
import { formatDistanceToNow } from "date-fns";

export default function Settlements() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const isMainAdmin = user.role === 'main-admin';

  // Filter settlements based on user role and filters
  const filteredSettlements = mockSettlements.filter(settlement => {
    // Partner admin only sees their own settlements
    if (!isMainAdmin && settlement.partnerId !== user.partnerId) {
      return false;
    }

    // Apply search filter
    if (searchTerm && 
        !settlement.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !settlement.period.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Apply status filter
    if (statusFilter !== 'all' && settlement.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const getStatusBadge = (status: Settlement['status']) => {
    const variants = {
      pending: 'secondary',
      completed: 'default',
      disputed: 'destructive',
      cancelled: 'outline',
    } as const;

    const colors = {
      pending: 'bg-warning text-warning-foreground',
      completed: 'bg-success text-success-foreground',
      disputed: 'bg-destructive text-destructive-foreground',
      cancelled: 'bg-muted text-muted-foreground',
    } as const;

    return (
      <Badge variant={variants[status]} className={colors[status]}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: Settlement['status']) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <TrendingUp className="w-4 h-4" />;
      case 'disputed':
        return <AlertCircle className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate totals for stats
  const totalAmount = filteredSettlements.reduce((sum, s) => sum + s.amount, 0);
  const totalCommission = filteredSettlements.reduce((sum, s) => sum + s.commission, 0);
  const pendingCount = filteredSettlements.filter(s => s.status === 'pending').length;
  const completedCount = filteredSettlements.filter(s => s.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isMainAdmin ? 'Settlements' : 'My Settlements'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Manage partner payouts and settlement records'
              : 'Track your earnings and payout history'
            }
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  {isMainAdmin ? 'Total Paid' : 'Total Earned'}
                </div>
                <div className="text-xl font-bold">{formatCurrency(totalAmount)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-info/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-info" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Commission</div>
                <div className="text-xl font-bold">{formatCurrency(totalCommission)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-warning" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-xl font-bold">{pendingCount}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-xl font-bold">{completedCount}</div>
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
                  placeholder="Search settlements or partners..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settlements Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Settlement</TableHead>
              {isMainAdmin && <TableHead>Partner</TableHead>}
              <TableHead>Period</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSettlements.map((settlement) => (
              <TableRow key={settlement.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">#{settlement.id.slice(-6).toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">
                      Settlement Record
                    </div>
                  </div>
                </TableCell>
                {isMainAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-xs">
                          {settlement.partnerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{settlement.partnerName}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">{settlement.period}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(settlement.status)}
                    {getStatusBadge(settlement.status)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{formatCurrency(settlement.amount)}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-success">
                    {formatCurrency(settlement.commission)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{settlement.transactionCount} orders</div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">
                      {formatDistanceToNow(new Date(settlement.createdAt), { addSuffix: true })}
                    </div>
                    {settlement.processedAt && (
                      <div className="text-xs text-muted-foreground">
                        Processed {formatDistanceToNow(new Date(settlement.processedAt), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-3 h-3 mr-1" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredSettlements.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No settlements found</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : isMainAdmin
                ? 'Settlements will appear here once partners complete transactions.'
                : 'Your settlement history will appear here once you complete transactions.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}