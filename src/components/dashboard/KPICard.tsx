import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
  style?: React.CSSProperties;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  variant = 'default',
  className,
  style
}: KPICardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return "bg-gradient-success text-success-foreground";
      case 'warning':
        return "bg-gradient-warning text-warning-foreground";
      case 'info':
        return "bg-gradient-secondary text-secondary-foreground";
      default:
        return "bg-gradient-primary text-primary-foreground";
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card className={cn("relative overflow-hidden hover:shadow-lg transition-all duration-200", className)} style={style}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className={cn("p-2 rounded-lg", getVariantStyles())}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-2xl font-bold">{formatValue(value)}</div>
            {change !== undefined && (
              <div className={cn(
                "text-xs flex items-center gap-1",
                change >= 0 ? "text-success" : "text-destructive"
              )}>
                <span>{change >= 0 ? '↑' : '↓'}</span>
                <span>{Math.abs(change)}%</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}