import { useState } from "react";
import { Bell, Check, X, AlertCircle, Info, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'order' | 'payment' | 'system' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD-2024-003 has been placed by John Doe',
    timestamp: '2024-09-16T10:30:00Z',
    read: false,
    priority: 'high',
    actionUrl: '/orders/ORD-2024-003'
  },
  {
    id: 'notif2',
    type: 'payment',
    title: 'Payment Processed',
    message: 'Settlement payment of $1,250.00 has been processed',
    timestamp: '2024-09-16T09:15:00Z',
    read: true,
    priority: 'medium',
    actionUrl: '/settlements'
  },
  {
    id: 'notif3',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2-4 AM EST',
    timestamp: '2024-09-15T16:00:00Z',
    read: false,
    priority: 'low'
  },
  {
    id: 'notif4',
    type: 'security',
    title: 'Security Alert',
    message: 'New login detected from a different device',
    timestamp: '2024-09-15T14:30:00Z',
    read: false,
    priority: 'high'
  },
  {
    id: 'notif5',
    type: 'order',
    title: 'Order Status Update',
    message: 'Order #ORD-2024-002 has been shipped',
    timestamp: '2024-09-15T11:45:00Z',
    read: true,
    priority: 'medium',
    actionUrl: '/orders/ORD-2024-002'
  }
];

export default function Notifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    return true;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'system':
        return <Info className="w-5 h-5 text-blue-500" />;
      case 'security':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: Notification['priority']) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
    } as const;
    
    return <Badge variant={variants[priority]} className="text-xs">{priority}</Badge>;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={cn(
      "group hover:shadow-md transition-all duration-200",
      !notification.read && "bg-accent/20 border-accent/30"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={cn(
                "text-sm font-medium truncate",
                !notification.read && "font-semibold"
              )}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-2 ml-2">
                {getPriorityBadge(notification.priority)}
                {!notification.read && (
                  <div className="w-2 h-2 bg-primary rounded-full" />
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {notification.message}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(notification.timestamp)}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {!notification.read && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => markAsRead(notification.id)}
                    className="h-7 px-2"
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteNotification(notification.id)}
                  className="h-7 px-2 text-destructive hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
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
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your latest activities and alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            <Check className="w-4 h-4 mr-2" />
            Mark All Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.priority === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orders</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.type === 'order').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread')} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="unread">
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground">
                  {filter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}