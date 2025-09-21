import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface ProductEventData {
  id: string;
  name: string;
  type: 'main-supplied' | 'partner-uploaded';
  partnerId?: string;
  price: number;
  category: string;
  stock: number;
  createdBy?: string;
  updatedBy?: string;
  deletedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface BulkUpdateEventData {
  type: 'inventory-sync' | 'price-update' | 'status-change';
  affectedProducts: string[];
  partnerId?: string;
  message: string;
}

interface SystemNotificationData {
  id: string;
  type: 'maintenance' | 'announcement' | 'alert';
  title: string;
  message: string;
  targetAudience: 'all' | 'admins' | 'partners';
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface ProductEventPayload {
  type: 'main-supplied' | 'partner-uploaded';
  product: ProductEventData;
  partnerId?: string;
  message: string;
  source?: 'partner';
}

interface UseSocketIOOptions {
  url: string;
  token?: string; // JWT token for authentication
  onProductCreated?: (data: ProductEventPayload) => void;
  onProductUpdated?: (data: ProductEventPayload) => void;
  onProductDeleted?: (data: { type: string; productId: string; message: string }) => void;
  onBulkUpdate?: (data: BulkUpdateEventData) => void;
  onSystemNotification?: (data: SystemNotificationData) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: string) => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  autoConnect?: boolean;
}

export const useSocketIO = ({
  url,
  token,
  onProductCreated,
  onProductUpdated,
  onProductDeleted,
  onBulkUpdate,
  onSystemNotification,
  onConnect,
  onDisconnect,
  onError,
  reconnectAttempts = 5,
  reconnectDelay = 1000,
  autoConnect = true,
}: UseSocketIOOptions) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectCount, setReconnectCount] = useState(0);

  // Store callbacks in refs to prevent dependency issues
  const onProductCreatedRef = useRef(onProductCreated);
  const onProductUpdatedRef = useRef(onProductUpdated);
  const onProductDeletedRef = useRef(onProductDeleted);
  const onBulkUpdateRef = useRef(onBulkUpdate);
  const onSystemNotificationRef = useRef(onSystemNotification);
  const onConnectRef = useRef(onConnect);
  const onDisconnectRef = useRef(onDisconnect);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onProductCreatedRef.current = onProductCreated;
    onProductUpdatedRef.current = onProductUpdated;
    onProductDeletedRef.current = onProductDeleted;
    onBulkUpdateRef.current = onBulkUpdate;
    onSystemNotificationRef.current = onSystemNotification;
    onConnectRef.current = onConnect;
    onDisconnectRef.current = onDisconnect;
    onErrorRef.current = onError;
  }, [onProductCreated, onProductUpdated, onProductDeleted, onBulkUpdate, onSystemNotification, onConnect, onDisconnect, onError]);

  // Connect to Socket.IO server
  const connect = useCallback(() => {
    if (!token) {
      setConnectionError('Authentication token is required');
      return;
    }

    // Clean up existing connection
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(url, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: reconnectAttempts,
      reconnectionDelay: reconnectDelay,
      timeout: 20000,
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected');
      setIsConnected(true);
      setConnectionError(null);
      setReconnectCount(0);
      onConnectRef.current?.();
    });

    socket.on('disconnect', (reason: string) => {
      console.log('❌ Socket.IO disconnected:', reason);
      setIsConnected(false);
      onDisconnectRef.current?.();
    });

    socket.on('connect_error', (error: Error) => {
      console.error('🔴 Socket.IO connection error:', error.message);
      setConnectionError(error.message);
      onErrorRef.current?.(error.message);
    });

    socket.on('reconnect', (attemptNumber: number) => {
      console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts`);
      setReconnectCount(attemptNumber);
    });

    socket.on('reconnect_attempt', (attemptNumber: number) => {
      console.log(`🔄 Socket.IO reconnection attempt ${attemptNumber}`);
      setReconnectCount(attemptNumber);
    });

    socket.on('reconnect_failed', () => {
      console.error('💥 Socket.IO failed to reconnect');
      setConnectionError('Failed to reconnect to server');
    });

    // Product event handlers
    socket.on('product:created', (data: ProductEventPayload) => {
      console.log('📦 Product created:', data);
      onProductCreatedRef.current?.(data);
    });

    socket.on('product:updated', (data: ProductEventPayload) => {
      console.log('🔄 Product updated:', data);
      onProductUpdatedRef.current?.(data);
    });

    socket.on('product:deleted', (data: { type: string; productId: string; message: string }) => {
      console.log('🗑️ Product deleted:', data);
      onProductDeletedRef.current?.(data);
    });

    socket.on('products:bulk-update', (data: BulkUpdateEventData) => {
      console.log('📊 Bulk product update:', data);
      onBulkUpdateRef.current?.(data);
    });

    // System event handlers
    socket.on('system:notification', (data: SystemNotificationData) => {
      console.log('🔔 System notification:', data);
      onSystemNotificationRef.current?.(data);
    });

    // Ping/Pong for connection health
    socket.on('pong', () => {
      console.log('🏓 Pong received');
    });

  }, [
    url,
    token,
    reconnectAttempts,
    reconnectDelay,
  ]); // Removed callback functions to prevent infinite loops

  // Disconnect from server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setConnectionError(null);
    }
  }, []);

  // Send ping to test connection
  const ping = useCallback(() => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('ping');
    }
  }, [isConnected]);

  // Join specific room (for admin/partner specific events)
  const joinRoom = useCallback((room: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join-room', room);
    }
  }, [isConnected]);

  // Leave specific room
  const leaveRoom = useCallback((room: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave-room', room);
    }
  }, [isConnected]);

  // Send custom event
  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Socket not connected. Event not sent:', event);
    }
  }, [isConnected]);

  // Listen to custom events
  const on = useCallback((event: string, handler: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      
      // Return cleanup function
      return () => {
        socketRef.current?.off(event, handler);
      };
    }
  }, []);

  // Remove event listener
  const off = useCallback((event: string, handler?: (data: any) => void) => {
    if (socketRef.current) {
      if (handler) {
        socketRef.current.off(event, handler);
      } else {
        socketRef.current.off(event);
      }
    }
  }, []);

  // Auto-connect on mount and token change
  useEffect(() => {
    if (autoConnect && token) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [connect, autoConnect, token]);

  return {
    // Connection state
    isConnected,
    connectionError,
    reconnectCount,
    
    // Connection methods
    connect,
    disconnect,
    
    // Communication methods
    ping,
    emit,
    on,
    off,
    joinRoom,
    leaveRoom,
    
    // Direct socket access (use with caution)
    socket: socketRef.current,
  };
};

// Helper hook for product-specific events
export const useProductEvents = (token?: string, serverUrl: string = 'http://localhost:3001') => {
  const [products, setProducts] = useState<ProductEventData[]>([]);
  const [notifications, setNotifications] = useState<SystemNotificationData[]>([]);

  const handleProductCreated = useCallback((data: ProductEventPayload) => {
    setProducts(prev => [data.product, ...prev]);
    
    // You can also show toast notifications here
    console.log(`New ${data.type} product: ${data.product.name}`);
  }, []);

  const handleProductUpdated = useCallback((data: ProductEventPayload) => {
    setProducts(prev => prev.map(p => 
      p.id === data.product.id ? { ...p, ...data.product } : p
    ));
    
    console.log(`Updated ${data.type} product: ${data.product.name}`);
  }, []);

  const handleProductDeleted = useCallback((data: { productId: string; type: string; message: string }) => {
    setProducts(prev => prev.filter(p => p.id !== data.productId));
    
    console.log(`Deleted ${data.type} product: ${data.productId}`);
  }, []);

  const handleSystemNotification = useCallback((data: SystemNotificationData) => {
    setNotifications(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 notifications
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const { isConnected, connectionError, connect, disconnect, ping } = useSocketIO({
    url: serverUrl.replace('http', 'ws'),
    token,
    onProductCreated: handleProductCreated,
    onProductUpdated: handleProductUpdated,
    onProductDeleted: handleProductDeleted,
    onSystemNotification: handleSystemNotification,
    onConnect: () => console.log('🎉 Connected to product events'),
    onDisconnect: () => console.log('👋 Disconnected from product events'),
    onError: (error) => console.error('❌ Product events error:', error),
  });

  return {
    // State
    products,
    notifications,
    isConnected,
    connectionError,
    
    // Methods
    connect,
    disconnect,
    ping,
    clearNotifications,
    
    // Manual state setters (if needed)
    setProducts,
    setNotifications,
  };
};