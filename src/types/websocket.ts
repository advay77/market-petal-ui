export type SubscriptionPayload = Record<string, any>;

// WebSocket Event Types
export interface ProductEvent {
  type: 'main-supplied' | 'partner-uploaded';
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
    imageUrl?: string;
  };
  partnerId?: string;
  message: string;
  timestamp?: Date;
}

export interface BulkProductUpdateEvent {
  type: 'inventory-sync' | 'price-update' | 'status-change';
  affectedProducts: string[];
  partnerId?: string;
  message: string;
  timestamp?: Date;
}

export interface SystemNotificationEvent {
  id: string;
  type: 'maintenance' | 'announcement' | 'alert';
  title: string;
  message: string;
  targetAudience: 'all' | 'admins' | 'partners';
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

// WebSocket Message Types
export interface WebSocketMessage {
  event: string;
  data: any;
  timestamp?: Date;
}

// Product Event Messages
export interface ProductCreatedMessage extends WebSocketMessage {
  event: 'product:created';
  data: ProductEvent;
}

export interface ProductUpdatedMessage extends WebSocketMessage {
  event: 'product:updated';
  data: ProductEvent;
}

export interface ProductDeletedMessage extends WebSocketMessage {
  event: 'product:deleted';
  data: {
    type: 'main-supplied' | 'partner-uploaded';
    productId: string;
    message: string;
    partnerId?: string;
  };
}

export interface BulkProductUpdateMessage extends WebSocketMessage {
  event: 'products:bulk-update';
  data: BulkProductUpdateEvent;
}

// System Event Messages
export interface SystemNotificationMessage extends WebSocketMessage {
  event: 'system:notification';
  data: SystemNotificationEvent;
}

export interface PingMessage extends WebSocketMessage {
  event: 'ping';
  data: {};
}

export interface PongMessage extends WebSocketMessage {
  event: 'pong';
  data: {};
}

// Union type for all possible WebSocket messages
export type WebSocketEventMessage = 
  | ProductCreatedMessage
  | ProductUpdatedMessage
  | ProductDeletedMessage
  | BulkProductUpdateMessage
  | SystemNotificationMessage
  | PingMessage
  | PongMessage;

// WebSocket Hook Options
export interface UseWebSocketOptions {
  url: string;
  token?: string; // JWT token for authentication
  payloads?: SubscriptionPayload[];
  onMessage?: (msg: WebSocketEventMessage) => void;
  onOpen?: () => void;
  onError?: (err: Event | string) => void;
  onClose?: () => void;
  reconnectInterval?: number; // initial retry interval in ms
  maxRetries?: number;
  autoConnect?: boolean; // whether to connect automatically
}

// WebSocket Connection State
export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  retryCount: number;
  lastConnected?: Date;
}

// WebSocket Context Type
export interface WebSocketContextType {
  state: WebSocketState;
  sendMessage: (payload: SubscriptionPayload) => void;
  connect: () => void;
  disconnect: () => void;
  subscribe: (event: string, callback: (data: any) => void) => () => void;
}

// Event Handlers for specific events
export interface ProductEventHandlers {
  onProductCreated?: (data: ProductEvent) => void;
  onProductUpdated?: (data: ProductEvent) => void;
  onProductDeleted?: (data: { productId: string; type: string; message: string }) => void;
  onBulkUpdate?: (data: BulkProductUpdateEvent) => void;
}

export interface SystemEventHandlers {
  onSystemNotification?: (data: SystemNotificationEvent) => void;
  onConnectionStatusChange?: (connected: boolean) => void;
}

// Combined event handlers
export interface WebSocketEventHandlers extends ProductEventHandlers, SystemEventHandlers {
  onAnyMessage?: (message: WebSocketEventMessage) => void;
}
