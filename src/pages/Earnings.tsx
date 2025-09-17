import { useState } from "react";
import { TrendingUp, DollarSign, Calendar, Download, Eye, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

// Mock earnings data
const mockEarningsData = {
  totalEarnings: 125000,
  monthlyEarnings: 12500,
  pendingPayouts: 3200,
  lastPayout: 9300,
  earningsGrowth: 15.2,
  payoutGrowth: 8.7,
  transactions: [
    {
      id: "txn_001",
      date: "2024-01-15",
      description: "Sales Commission - January 2024",
      amount: 9300,
      status: "paid",
      type: "commission"
    },
    {
      id: "txn_002", 
      date: "2024-01-10",
      description: "Product Sale - Wireless Headphones",
      amount: 45.50,
      status: "pending",
      type: "sale"
    },
    {
      id: "txn_003",
      date: "2024-01-08",
      description: "Product Sale - Smart Watch",
      amount: 89.99,
      status: "pending",
      type: "sale"
    },
    {
      id: "txn_004",
      date: "2024-01-05",
      description: "Bonus - Top Performer",
      amount: 500,
      status: "paid",
      type: "bonus"
    },
    {
      id: "txn_005",
      date: "2024-01-03",
      description: "Product Sale - Gaming Mouse",
      amount: 29.99,
      status: "processing",
      type: "sale"
    }
  ]
};

export default function Earnings() {
  const { user } = useUser();
  const [timeFilter, setTimeFilter] = useState("this-month");
  const [statusFilter, setStatusFilter] = useState("all");

  // Only partner admin can access earnings page
  if (user.role !== 'partner-admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
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

  const getStatusBadge = (status: string) => {
    const variants = {
      paid: 'default',
      pending: 'secondary',
      processing: 'outline',
      failed: 'destructive',
    } as const;

    const colors = {
      paid: 'text-success',
      pending: 'text-warning',
      processing: 'text-info',
      failed: 'text-destructive',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants]} className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'commission':
        return '💰';
      case 'sale':
        return '🛒';
      case 'bonus':
        return '🎉';
      default:
        return '💳';
    }
  };

  const filteredTransactions = mockEarningsData.transactions.filter(transaction => {
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Earnings</h1>
          <p className="text-muted-foreground mt-1">
            Track your revenue, commissions, and payouts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
            <Eye className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Earnings Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-success text-success-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockEarningsData.totalEarnings)}</div>
            <div className="text-xs text-success flex items-center gap-1">
              <span>↑</span>
              <span>{mockEarningsData.earningsGrowth}%</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-secondary text-secondary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockEarningsData.monthlyEarnings)}</div>
            <div className="text-xs text-muted-foreground">
              Current month earnings
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-warning text-warning-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockEarningsData.pendingPayouts)}</div>
            <div className="text-xs text-muted-foreground">
              Awaiting next payout
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Payout</CardTitle>
            <div className="p-2 rounded-lg bg-gradient-primary text-primary-foreground">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockEarningsData.lastPayout)}</div>
            <div className="text-xs text-success flex items-center gap-1">
              <span>↑</span>
              <span>{mockEarningsData.payoutGrowth}%</span>
              <span className="text-muted-foreground">vs previous</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings Trend</CardTitle>
          <CardDescription>Your earnings performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-subtle rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Earnings chart will be displayed here</p>
              <p className="text-sm text-muted-foreground">Integration with charting library needed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent earnings and payout transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="hover:bg-muted/50">
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                      <span>{transaction.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Information */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Next Payout
            </CardTitle>
            <CardDescription>Information about your next scheduled payout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Scheduled Date:</span>
                <span className="font-medium">January 31, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated Amount:</span>
                <span className="font-medium text-success">{formatCurrency(mockEarningsData.pendingPayouts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-medium">Bank Transfer</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Payouts are processed on the last day of each month for all earnings from the previous month.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Earnings Summary
            </CardTitle>
            <CardDescription>Breakdown of your earnings sources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Product Sales:</span>
                <span className="font-medium">{formatCurrency(98500)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Commissions:</span>
                <span className="font-medium">{formatCurrency(21500)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Bonuses:</span>
                <span className="font-medium">{formatCurrency(5000)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Earnings:</span>
                  <span className="text-success">{formatCurrency(mockEarningsData.totalEarnings)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
