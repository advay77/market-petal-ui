import { useState } from "react";
import { Download, Mail, FileText, Calendar, Send, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  generateSettlementReport,
  calculateMonthlySettlements,
  type SettlementCalculation 
} from "@/lib/settlement-calculator";
import { mockOrders, mockProducts, mockPartners } from "@/lib/mock-data";

interface SettlementReportGeneratorProps {
  settlements?: SettlementCalculation[];
}

export function SettlementReportGenerator({ settlements = [] }: SettlementReportGeneratorProps) {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedPartner, setSelectedPartner] = useState("");
  const [reportType, setReportType] = useState("individual");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const periods = [
    "January 2024", "February 2024", "March 2024", "April 2024",
    "May 2024", "June 2024", "July 2024", "August 2024",
    "September 2024", "October 2024", "November 2024", "December 2024"
  ];

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (reportType === "individual" && selectedPartner) {
      const partner = mockPartners.find(p => p.id === selectedPartner);
      if (partner) {
        toast({
          title: "Report Generated",
          description: `Settlement report generated for ${partner.name} - ${selectedPeriod}`,
        });
      }
    } else {
      toast({
        title: "Monthly Report Generated",
        description: `Comprehensive settlement report generated for ${selectedPeriod}`,
      });
    }
    
    setIsGenerating(false);
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Email Sent Successfully",
      description: "Settlement report has been emailed to the selected recipients.",
    });
    
    setIsSending(false);
  };

  const defaultEmailTemplate = `Dear [PARTNER_NAME],

Your monthly settlement has been processed for [PERIOD].

Settlement Summary:
• Total Sales: [TOTAL_SALES]
• Gross Earnings: [GROSS_EARNINGS]
• Payment Gateway Fees: [PG_FEES]
• Net Settlement Amount: [NET_AMOUNT]

Product Breakdown:
• Main Product Sales: [MAIN_SALES]
• Main Product Margins: [MAIN_MARGIN]
• Partner Product Sales: [PARTNER_SALES]
• Partner Product Revenue: [PARTNER_REVENUE]

The settlement amount will be deposited to your registered bank account within 3-5 business days.

For any queries, please contact our support team.

Best regards,
Lovable Market Team`;

  return (
    <div className="space-y-6">
      {/* Report Generation Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Individual Report
            </CardTitle>
            <CardDescription>
              Generate settlement report for a specific partner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Partner</Label>
              <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                <SelectTrigger>
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  {mockPartners.map(partner => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full" 
              onClick={handleGenerateReport}
              disabled={!selectedPartner || !selectedPeriod || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Summary
            </CardTitle>
            <CardDescription>
              Generate comprehensive monthly report for all partners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Report Format</Label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Report</SelectItem>
                  <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                  <SelectItem value="csv">CSV Export</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={handleGenerateReport}
              disabled={!selectedPeriod || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Download className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Reports
            </CardTitle>
            <CardDescription>
              Send settlement reports via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Recipients</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Partners</SelectItem>
                  <SelectItem value="pending">Pending Settlements</SelectItem>
                  <SelectItem value="completed">Completed Settlements</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Customize Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Email Template</DialogTitle>
                  <DialogDescription>
                    Customize the email template for settlement reports
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Email Template</Label>
                    <Textarea
                      value={emailTemplate || defaultEmailTemplate}
                      onChange={(e) => setEmailTemplate(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="Enter email template..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setEmailTemplate(defaultEmailTemplate)}>
                      Reset to Default
                    </Button>
                    <Button variant="outline">
                      Preview Template
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              {isSending ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reports
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Recently generated settlement reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: 1, partner: "TechnoGear Solutions", period: "December 2023", type: "Individual", status: "sent", date: "2024-01-01" },
              { id: 2, partner: "All Partners", period: "December 2023", type: "Monthly Summary", status: "generated", date: "2024-01-01" },
              { id: 3, partner: "Fashion Forward", period: "December 2023", type: "Individual", status: "sent", date: "2024-01-01" },
              { id: 4, partner: "Home & Garden Co", period: "December 2023", type: "Individual", status: "pending", date: "2024-01-01" },
            ].map(report => (
              <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{report.partner} - {report.period}</div>
                    <div className="text-sm text-muted-foreground">{report.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    report.status === 'sent' ? 'default' : 
                    report.status === 'generated' ? 'secondary' : 'outline'
                  }>
                    {report.status === 'sent' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {report.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
