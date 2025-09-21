# Frontend WebSocket Implementation

## Overview
Real-time WebSocket integration using Socket.IO client with role-based authentication and automatic reconnection.

## Features
- ✅ **Role-Based Authentication**: JWT-based WebSocket authentication
- ✅ **Automatic Reconnection**: Exponential backoff retry strategy
- ✅ **Real-Time Notifications**: Toast notifications for product events
- ✅ **Connection Status**: Visual connection indicator in TopBar
- ✅ **Event Subscription**: Modular event handling system
- ✅ **Role-Based Filtering**: Events filtered by user role (Admin/Partner)

## Architecture

```
App.tsx
├── UserProvider (Authentication)
├── WebSocketProvider (WebSocket Connection)
    ├── useWebSocket Hook (Socket.IO Client)
    ├── Event Handlers (Role-based filtering)
    └── Toast Notifications (sonner)
```

## Files Structure

### **Types**
- `src/types/websocket.ts` - WebSocket event types and interfaces

### **Hooks**
- `src/hooks/useWebSocket.ts` - Core WebSocket hook with Socket.IO

### **Context**
- `src/context/WebSocketContext.tsx` - WebSocket provider and context

### **Components**
- `src/components/layout/WebSocketStatus.tsx` - Connection status indicator
- `src/components/products/ProductWebSocketIntegration.tsx` - Real-time product updates

## Usage

### **Environment Setup**
Create `.env.local`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_BASE_URL=http://localhost:3001
```

### **WebSocket Events**

#### **Product Events**
```typescript
// Product created
'product:created' -> ProductEvent

// Product updated  
'product:updated' -> ProductEvent

// Product deleted
'product:deleted' -> { productId, type, message }

// Bulk product update
'products:bulk-update' -> BulkProductUpdateEvent
```

#### **System Events**
```typescript
// System notifications
'system:notification' -> SystemNotificationEvent

// Connection health
'ping' / 'pong'
```

### **Role-Based Event Filtering**

#### **Main Admin**
- ✅ Sees all product events (main-supplied + partner-uploaded)
- ✅ Receives partner product notifications
- ✅ Gets system notifications targeted to admins

#### **Partner Admin**  
- ✅ Sees main-supplied product events (new inventory)
- ✅ Sees only their own partner-uploaded products
- ✅ Gets system notifications targeted to partners

### **Component Integration**

#### **Using WebSocket Context**
```typescript
import { useWebSocketContext } from '@/context/WebSocketContext';

function MyComponent() {
  const { state, sendMessage, subscribe } = useWebSocketContext();
  
  // Subscribe to events
  useEffect(() => {
    const unsubscribe = subscribe('product:created', (data) => {
      console.log('New product:', data);
    });
    
    return unsubscribe;
  }, [subscribe]);
}
```

#### **Using Product WebSocket Hook**
```typescript
import { useProductWebSocket } from '@/context/WebSocketContext';

function ProductComponent() {
  const { subscribeToProductEvents } = useProductWebSocket();
  
  useEffect(() => {
    const unsubscribe = subscribeToProductEvents({
      onProductCreated: (data) => {
        // Handle product creation
      },
      onProductUpdated: (data) => {
        // Handle product update
      }
    });
    
    return unsubscribe;
  }, []);
}
```

## Authentication Flow

1. **User logs in** → JWT token stored in localStorage
2. **WebSocket connects** → Uses JWT token for authentication
3. **Server validates** → User joined to role-based rooms
4. **Events filtered** → Based on user role and permissions

## Connection Management

### **Connection States**
- `isConnecting` - Attempting to connect
- `isConnected` - Successfully connected  
- `error` - Connection error with message
- `retryCount` - Current retry attempt

### **Reconnection Strategy**
- **Exponential backoff**: 1s, 2s, 4s, 8s, 16s...
- **Max retries**: 10 attempts
- **Auto-reconnect**: On network recovery
- **Manual reconnect**: Available via context

### **Connection Status Indicator**
Located in TopBar:
- 🟢 **Live** - Connected and receiving events
- 🟡 **Connecting...** - Attempting connection
- 🔴 **Offline/Error** - Disconnected or failed

## Real-Time Notifications

### **Toast Notifications**
Using `sonner` for user-friendly notifications:

#### **For Admins**
```typescript
// Partner uploads product
toast.info("🏪 Partner uploaded new product", {
  description: "iPhone 15 - $999"
});

// Main product created
toast.success("✅ Main product created successfully", {
  description: "iPhone 15 - $999"
});
```

#### **For Partners**
```typescript
// New main inventory
toast.success("🆕 New product available", {
  description: "iPhone 15 - $999 now available"
});

// Own product uploaded
toast.success("✅ Your product uploaded successfully", {
  description: "Your product: iPhone 15"
});
```

### **Recent Activity Feed**
`ProductWebSocketIntegration` component shows:
- ⏰ Last 10 real-time activities
- 🏷️ Activity type badges (Created/Updated/Deleted)
- 🏪 Product type badges (Main/Partner)
- ⏰ Timestamps

## Error Handling

### **Connection Errors**
- Invalid JWT → "Authentication failed"
- Network issues → Auto-retry with backoff
- Server down → "Connection failed" with retry counter

### **Message Errors**
- Invalid JSON → Logged to console
- Unknown events → Logged as unhandled
- Missing data → Graceful degradation

## Security

### **Authentication**
- JWT token required for connection
- Role-based room access
- Server-side token validation

### **Data Privacy**
- Partners only see their own products
- Admins see all data
- No sensitive data in WebSocket messages

## Performance

### **Optimizations**
- Event subscription cleanup on unmount
- Limited activity history (10 items)
- Debounced reconnection attempts
- Efficient re-renders with proper dependencies

### **Memory Management**
- Automatic cleanup of event listeners
- Connection cleanup on component unmount
- Limited toast notifications

## Development & Testing

### **Debug Mode**
```typescript
// Enable WebSocket debugging
localStorage.setItem('debug', 'socket.io-client:*');
```

### **Test Events**
Backend provides test endpoint (dev only):
```bash
POST /api/websocket/test
{
  "eventType": "product:created"
}
```

### **Connection Stats**
```bash
GET /api/websocket/stats
# Returns connection counts by role
```

## Troubleshooting

### **Common Issues**

1. **Not connecting**
   - Check JWT token in localStorage
   - Verify VITE_WS_BASE_URL
   - Check network connectivity

2. **Not receiving events**
   - Verify user role permissions
   - Check WebSocket status indicator
   - Look for console errors

3. **Frequent disconnections**
   - Check network stability
   - Verify server is running
   - Check for JWT token expiry

### **Debug Commands**
```javascript
// In browser console
localStorage.getItem('jwt-token') // Check token
window.location.reload() // Force reconnect
```

## Future Enhancements

- 📱 Push notifications for offline users
- 📊 Real-time analytics dashboard
- 🔔 Custom notification preferences
- 📱 Mobile app WebSocket integration
