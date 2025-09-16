import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  AlertTriangle,
  TrendingUp,
  Package,
  Wallet,
  Star
} from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useUser } from "@/context/UserContext";
import { mockAnalytics } from "@/lib/mock-data";

export default function Dashboard() {
  const { user } = useUser();
  const isMainAdmin = user.role === 'main-admin';

  // Main Admin KPIs
  const mainAdminKPIs = [
    {
      title: "Total Revenue",
      value: mockAnalytics.overview.totalRevenue,
      change: mockAnalytics.overview.revenueGrowth,
      icon: DollarSign,
      variant: 'success' as const,
    },
    {
      title: "Total Orders",
      value: mockAnalytics.overview.totalOrders,
      change: mockAnalytics.overview.ordersGrowth,
      icon: ShoppingCart,
      variant: 'info' as const,
    },
    {
      title: "Active Partners",
      value: mockAnalytics.overview.activePartners,
      change: mockAnalytics.overview.partnersGrowth,
      icon: Users,
      variant: 'default' as const,
    },
    {
      title: "Pending Settlements",
      value: mockAnalytics.overview.pendingSettlements,
      icon: Wallet,
      variant: 'warning' as const,
    },
  ];

  // Partner Admin KPIs
  const partnerAdminKPIs = [
    {
      title: "My Revenue",
      value: 125000,
      change: 15.2,
      icon: DollarSign,
      variant: 'success' as const,
    },
    {
      title: "My Orders",
      value: 450,
      change: 8.7,
      icon: ShoppingCart,
      variant: 'info' as const,
    },
    {
      title: "Active Products",
      value: 24,
      change: 12.5,
      icon: Package,
      variant: 'default' as const,
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: 2.1,
      icon: Star,
      variant: 'warning' as const,
    },
  ];

  const kpis = isMainAdmin ? mainAdminKPIs : partnerAdminKPIs;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isMainAdmin ? 'Admin Dashboard' : 'Partner Dashboard'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isMainAdmin 
              ? 'Monitor marketplace performance and manage operations'
              : 'Track your store performance and manage your products'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            icon={kpi.icon}
            variant={kpi.variant}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <RevenueChart data={mockAnalytics.chartData.revenue} />
        <ActivityFeed activities={[]} />
      </div>

      {/* Alert Section for Main Admin */}
      {isMainAdmin && mockAnalytics.overview.fraudAlerts > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <h3 className="font-semibold text-destructive">Fraud Alerts</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {mockAnalytics.overview.fraudAlerts} potential fraud cases require immediate attention.
          </p>
        </div>
      )}
    </div>
  );
}