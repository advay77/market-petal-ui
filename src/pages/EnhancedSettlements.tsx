import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  Eye, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  AlertCircle,
  Download,
  Mail,
  Settings,
  Calculator,
  Clock,
  CheckCircle,
  FileText,
  Zap
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { 
  calculatePartnerSettlement, 
  calculateMonthlySettlements,
  processMonthlySettlements,
  generateSettlementReport,
  SETTLEMENT_CONFIG,
  type SettlementCalculation
} from "@/lib/settlement-calculator";
import { mockSettlements, mockOrders, mockProducts, mockPartners } from "@/lib/mock-data";

export default function EnhancedSettlements() {
  const { user } = useUser();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState("settlements");
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementCalculation | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const isMainAdmin = user.role === 'main-admin';

  // Calculate current month settlement preview
  const [currentMonthSettlement, setCurrentMonthSettlement] = useState<SettlementCalculation | null>(null);

  useEffect(() => {
    if (!isMainAdmin && user.partnerId) {
      // Calculate current month settlement for partner
      const now = new Date();
      const currentPeriod = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
      const settlement = calculatePartnerSettlement(
        user.partnerId,
        user.name,
        mockOrders,
        mockProducts,
        currentPeriod
      );
      setCurrentMonthSettlement(settlement);
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'default',
      pending: 'secondary',
      disputed: 'destructive',
      cancelled: 'outline',
    } as const;

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const handleProcessMonthlySettlements = async () => {
    setIsProcessing(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = processMonthlySettlements(mockOrders, mockProducts, mockPartners);
    
    toast({
      title: "Monthly Settlements Processed",
      description: `${result.processedSettlements.length} settlements processed. Total amount: ${formatCurrency(result.summary.totalAmount)}`,
    });
    
    setIsProcessing(false);
  };

  const handleSendSettlementReport = async (partnerId: string) => {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Settlement Report Sent",
      description: "Settlement report has been emailed to the partner.",
    });
  };

  const SettlementBreakdownDialog = ({ settlement }: { settlement: SettlementCalculation }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="w-3 h-3 mr-1" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settlement Breakdown - {settlement.partnerName}</DialogTitle>
          <DialogDescription>
            Detailed breakdown for {settlement.period}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatCurrency(settlement.totalSales)}</div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatCurrency(settlement.grossEarnings)}</div>
                <div className="text-sm text-muted-foreground">Gross Earnings</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{formatCurrency(settlement.paymentGatewayFees)}</div>
                <div className="text-sm text-muted-foreground">PG Fees</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-success">{formatCurrency(settlement.netSettlementAmount)}</div>
                <div className="text-sm text-muted-foreground">Net Amount</div>
              </CardContent>
            </Card>
          </div>

          {/* Product Type Breakdown */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Main Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sales:</span>
                    <span>{formatCurrency(settlement.mainProductSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partner Margin:</span>
                    <span className="font-medium">{formatCurrency(settlement.mainProductMargin)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Selling Price - Wholesale Cost = Partner Margin
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Partner Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sales:</span>
                    <span>{formatCurrency(settlement.partnerProductSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Partner Revenue:</span>
                    <span className="font-medium">{formatCurrency(settlement.partnerProductRevenue)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    100% of sales revenue belongs to partner
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Partner Earning</TableHead>
                    <TableHead>PG Fees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settlement.breakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{item.orderNumber}</TableCell>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>
                        <Badge variant={item.productType === 'main-supplied' ? 'default' : 'secondary'}>
                          {item.productType === 'main-supplied' ? 'Main' : 'Partner'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.sellingPrice)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(item.partnerEarning)}</TableCell>
                      <TableCell>{formatCurrency(item.pgFees)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isMainAdmin ? 'Automated Settlements' : 'My Settlements'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Manage automated settlement processing and partner payouts'
              : 'View your settlement history and earnings breakdown'
            }
          </p>
        </div>
        {isMainAdmin && (
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settlement Config
            </Button>
            <Button 
              className="bg-gradient-primary hover:bg-gradient-primary/90"
              onClick={handleProcessMonthlySettlements}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Process Monthly Settlements
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Settlement Configuration Info */}
      {isMainAdmin && (
        <Card className="bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Automated Settlement Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{SETTLEMENT_CONFIG.PAYMENT_GATEWAY_FEE_PERCENTAGE}%</div>
                <div className="text-sm text-muted-foreground">PG Fee Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">${SETTLEMENT_CONFIG.PAYMENT_GATEWAY_FIXED_FEE}</div>
                <div className="text-sm text-muted-foreground">Fixed Fee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{SETTLEMENT_CONFIG.SETTLEMENT_DAY}</div>
                <div className="text-sm text-muted-foreground">Settlement Day</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {SETTLEMENT_CONFIG.AUTO_EMAIL_ENABLED ? <CheckCircle className="w-8 h-8 text-success mx-auto" /> : '❌'}
                </div>
                <div className="text-sm text-muted-foreground">Auto Email</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Settlement Logic:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• <strong>Main Products:</strong> Partner receives (Selling Price - Wholesale Cost) as margin</li>
                <li>• <strong>Partner Products:</strong> Partner receives 100% of sales revenue</li>
                <li>• <strong>Monthly Processing:</strong> Automatically processes on the last day of each month</li>
                <li>• <strong>PG Fees:</strong> Deducted from gross earnings before settlement</li>
                <li>• <strong>Reports:</strong> Auto-generated and emailed to partners</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partner Current Month Preview */}
      {!isMainAdmin && currentMonthSettlement && (
        <Card className="bg-gradient-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Current Month Preview - {currentMonthSettlement.period}
            </CardTitle>
            <CardDescription>
              Your earnings preview for the current month (will be settled on the last day)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(currentMonthSettlement.totalSales)}</div>
                <div className="text-sm text-muted-foreground">Total Sales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(currentMonthSettlement.grossEarnings)}</div>
                <div className="text-sm text-muted-foreground">Gross Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatCurrency(currentMonthSettlement.paymentGatewayFees)}</div>
                <div className="text-sm text-muted-foreground">PG Fees</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{formatCurrency(currentMonthSettlement.netSettlementAmount)}</div>
                <div className="text-sm text-muted-foreground">Expected Settlement</div>
              </div>
            </div>
            <div className="mt-4">
              <SettlementBreakdownDialog settlement={currentMonthSettlement} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different views */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settlements">Settlement History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="automation">Automation Status</TabsTrigger>
        </TabsList>

        {/* Settlement History Tab */}
        <TabsContent value="settlements" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search settlements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="disputed">Disputed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Settlements Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partner</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Sales</TableHead>
                  <TableHead>Gross Earnings</TableHead>
                  <TableHead>PG Fees</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSettlements.map((settlement) => (
                  <TableRow key={settlement.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {settlement.partnerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{settlement.partnerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{settlement.period}</TableCell>
                    <TableCell>{formatCurrency(settlement.totalSales || settlement.amount * 1.5)}</TableCell>
                    <TableCell>{formatCurrency(settlement.grossEarnings || settlement.amount * 1.15)}</TableCell>
                    <TableCell>{formatCurrency(settlement.paymentGatewayFees || settlement.amount * 0.03)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(settlement.amount)}</TableCell>
                    <TableCell>{getStatusBadge(settlement.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-3 h-3" />
                        </Button>
                        {isMainAdmin && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSendSettlementReport(settlement.partnerId)}
                          >
                            <Mail className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Monthly Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate comprehensive monthly settlement reports for all partners.
                </p>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Automatically email settlement reports to all partners.
                </p>
                <Button variant="outline" className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send All Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Settlement Calculator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Calculate settlement amounts for specific periods or partners.
                </p>
                <Button variant="outline" className="w-full">
                  <Calculator className="w-4 h-4 mr-2" />
                  Open Calculator
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Status Tab */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Settlement Automation Status
              </CardTitle>
              <CardDescription>
                Monitor the automated settlement process and system health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Next Settlement Run</span>
                      <Badge variant="secondary">Jan 31, 2024</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Automation Status</span>
                      <Badge variant="default" className="text-success">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email Notifications</span>
                      <Badge variant="default" className="text-success">Enabled</Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Last Processing</span>
                      <Badge variant="outline">Dec 31, 2023</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Partners Processed</span>
                      <Badge variant="outline">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Amount</span>
                      <Badge variant="outline">$45,230</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Settlement Progress</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    Current month data collection and validation in progress
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
