import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  type: 'order' | 'settlement' | 'partner' | 'product';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info' | 'default';
  avatar?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    description: 'Order #ORD-2024-003 from Fashion Forward - $89.97',
    timestamp: '2024-09-16T10:30:00Z',
    status: 'success',
  },
  {
    id: '2',
    type: 'settlement',
    title: 'Settlement Processed',
    description: '$2,450.00 paid to TechnoGear Solutions',
    timestamp: '2024-09-16T09:15:00Z',
    status: 'info',
  },
  {
    id: '3',
    type: 'partner',
    title: 'New Partner Application',
    description: 'Outdoor Adventure Co. submitted partnership application',
    timestamp: '2024-09-16T08:45:00Z',
    status: 'warning',
  },
  {
    id: '4',
    type: 'product',
    title: 'Product Updated',
    description: 'Wireless Headphones price updated by TechnoGear',
    timestamp: '2024-09-16T07:20:00Z',
    status: 'default',
  },
  {
    id: '5',
    type: 'order',
    title: 'Order Shipped',
    description: 'Order #ORD-2024-001 shipped to customer',
    timestamp: '2024-09-15T16:30:00Z',
    status: 'success',
  },
];

export function ActivityFeed({ activities = mockActivities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'settlement':
        return '💰';
      case 'partner':
        return '🤝';
      case 'product':
        return '📱';
      default:
        return '📋';
    }
  };

  const getStatusVariant = (status?: Activity['status']) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'info':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates from your marketplace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-card-subtle transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-sm">
                  {getActivityIcon(activity.type)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}