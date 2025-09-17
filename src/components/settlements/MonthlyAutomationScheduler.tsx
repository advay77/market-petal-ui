import { useState, useEffect } from "react";
import { 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  Calendar, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Mail,
  DollarSign,
  Users
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  processMonthlySettlements,
  SETTLEMENT_CONFIG 
} from "@/lib/settlement-calculator";
import { mockOrders, mockProducts, mockPartners } from "@/lib/mock-data";

interface AutomationStatus {
  isEnabled: boolean;
  nextRunDate: string;
  lastRunDate: string;
  lastRunStatus: 'success' | 'failed' | 'partial';
  lastRunDetails: {
    partnersProcessed: number;
    totalAmount: number;
    emailsSent: number;
    errors: string[];
  };
  currentProgress: number;
  isRunning: boolean;
}

export function MonthlyAutomationScheduler() {
  const { toast } = useToast();
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>({
    isEnabled: true,
    nextRunDate: "2024-01-31",
    lastRunDate: "2023-12-31",
    lastRunStatus: 'success',
    lastRunDetails: {
      partnersProcessed: 12,
      totalAmount: 45230.50,
      emailsSent: 12,
      errors: []
    },
    currentProgress: 85,
    isRunning: false
  });

  const [schedulingSettings, setSchedulingSettings] = useState({
    dayOfMonth: 31, // Last day of month
    timeOfDay: "23:59", // Just before midnight
    emailEnabled: true,
    retryAttempts: 3,
    minSettlementAmount: 10.00
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'default',
      failed: 'destructive',
      partial: 'secondary',
    } as const;

    const icons = {
      success: CheckCircle,
      failed: AlertTriangle,
      partial: Clock,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant={variants[status as keyof typeof variants]} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const handleToggleAutomation = () => {
    setAutomationStatus(prev => ({
      ...prev,
      isEnabled: !prev.isEnabled
    }));

    toast({
      title: automationStatus.isEnabled ? "Automation Disabled" : "Automation Enabled",
      description: automationStatus.isEnabled 
        ? "Monthly settlement automation has been disabled"
        : "Monthly settlement automation has been enabled",
    });
  };

  const handleRunNow = async () => {
    setAutomationStatus(prev => ({ ...prev, isRunning: true, currentProgress: 0 }));

    // Simulate processing steps
    const steps = [
      { name: "Collecting sales data", progress: 20 },
      { name: "Calculating settlements", progress: 40 },
      { name: "Generating reports", progress: 60 },
      { name: "Processing payments", progress: 80 },
      { name: "Sending emails", progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAutomationStatus(prev => ({ ...prev, currentProgress: step.progress }));
    }

    // Process actual settlements
    const result = processMonthlySettlements(mockOrders, mockProducts, mockPartners);

    setAutomationStatus(prev => ({
      ...prev,
      isRunning: false,
      lastRunDate: new Date().toISOString().split('T')[0],
      lastRunStatus: 'success',
      lastRunDetails: {
        partnersProcessed: result.processedSettlements.length,
        totalAmount: result.summary.totalAmount,
        emailsSent: result.emailReports.length,
        errors: []
      },
      currentProgress: 100
    }));

    toast({
      title: "Settlement Processing Complete",
      description: `Processed ${result.processedSettlements.length} settlements totaling ${formatCurrency(result.summary.totalAmount)}`,
    });
  };

  const handleUpdateSettings = () => {
    toast({
      title: "Settings Updated",
      description: "Automation settings have been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Automation Status Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Automation Status</CardTitle>
            <Zap className={`h-4 w-4 ${automationStatus.isEnabled ? 'text-success' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automationStatus.isEnabled ? 'Active' : 'Disabled'}
            </div>
            <div className="text-xs text-muted-foreground">
              {automationStatus.isEnabled ? 'Running automatically' : 'Manual mode only'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Run</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(automationStatus.nextRunDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {Math.ceil((new Date(automationStatus.nextRunDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Run</CardTitle>
            <div>{getStatusBadge(automationStatus.lastRunStatus)}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(automationStatus.lastRunDetails.totalAmount)}
            </div>
            <div className="text-xs text-muted-foreground">
              {automationStatus.lastRunDetails.partnersProcessed} partners processed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Progress</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStatus.currentProgress}%</div>
            <div className="text-xs text-muted-foreground">
              {automationStatus.isRunning ? 'Processing...' : 'Data collection'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar (when running) */}
      {automationStatus.isRunning && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing Monthly Settlements</span>
                <span>{automationStatus.currentProgress}%</span>
              </div>
              <Progress value={automationStatus.currentProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Please wait while we process all partner settlements...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Automation Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Automation Controls
            </CardTitle>
            <CardDescription>
              Manage the automated settlement process
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Enable Automation</Label>
                <div className="text-sm text-muted-foreground">
                  Automatically process settlements monthly
                </div>
              </div>
              <Switch
                checked={automationStatus.isEnabled}
                onCheckedChange={handleToggleAutomation}
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Settlement Day</Label>
                <Select 
                  value={schedulingSettings.dayOfMonth.toString()} 
                  onValueChange={(value) => setSchedulingSettings(prev => ({ ...prev, dayOfMonth: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="31">Last day of month</SelectItem>
                    <SelectItem value="1">1st of month</SelectItem>
                    <SelectItem value="15">15th of month</SelectItem>
                    <SelectItem value="30">30th of month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Processing Time</Label>
                <Select 
                  value={schedulingSettings.timeOfDay} 
                  onValueChange={(value) => setSchedulingSettings(prev => ({ ...prev, timeOfDay: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="00:00">12:00 AM</SelectItem>
                    <SelectItem value="02:00">2:00 AM</SelectItem>
                    <SelectItem value="23:59">11:59 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Reports</Label>
                  <div className="text-sm text-muted-foreground">
                    Send reports to partners automatically
                  </div>
                </div>
                <Switch
                  checked={schedulingSettings.emailEnabled}
                  onCheckedChange={(checked) => setSchedulingSettings(prev => ({ ...prev, emailEnabled: checked }))}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleRunNow} 
                disabled={automationStatus.isRunning}
                className="flex-1"
              >
                {automationStatus.isRunning ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Now
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleUpdateSettings}>
                <Settings className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Run Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Last Run Details
            </CardTitle>
            <CardDescription>
              Details from the most recent settlement processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Partners Processed</span>
                </div>
                <span className="font-medium">{automationStatus.lastRunDetails.partnersProcessed}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Total Amount</span>
                </div>
                <span className="font-medium">{formatCurrency(automationStatus.lastRunDetails.totalAmount)}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Emails Sent</span>
                </div>
                <span className="font-medium">{automationStatus.lastRunDetails.emailsSent}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Errors</span>
                </div>
                <span className="font-medium text-success">{automationStatus.lastRunDetails.errors.length}</span>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                <strong>Processing Date:</strong> {new Date(automationStatus.lastRunDate).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                <strong>Status:</strong> {getStatusBadge(automationStatus.lastRunStatus)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Settlement Configuration</CardTitle>
          <CardDescription>Current automated settlement settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Gateway Fees</Label>
              <div className="text-lg font-bold">{SETTLEMENT_CONFIG.PAYMENT_GATEWAY_FEE_PERCENTAGE}% + ${SETTLEMENT_CONFIG.PAYMENT_GATEWAY_FIXED_FEE}</div>
              <p className="text-xs text-muted-foreground">Percentage + fixed fee per transaction</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Settlement Logic</Label>
              <div className="text-sm">
                <div>• Main Products: Margin-based</div>
                <div>• Partner Products: Revenue-based</div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Processing Schedule</Label>
              <div className="text-lg font-bold">Monthly</div>
              <p className="text-xs text-muted-foreground">Last day of each month at {schedulingSettings.timeOfDay}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
