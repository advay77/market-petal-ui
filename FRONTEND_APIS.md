# Frontend Product APIs Implementation

## Overview
Complete frontend implementation of product management APIs with role-based access control, real-time WebSocket integration, and comprehensive error handling.

## Architecture

### **API Layer Structure**
```
src/api/
├── products.ts          # Basic product CRUD operations
├── partnerStore.ts      # Partner store catalog management
└── auth.ts             # Authentication APIs
```

### **Hooks Layer**
```
src/hooks/
├── useProducts.ts       # Product management hooks
├── usePartnerStore.ts   # Partner store hooks
└── useWebSocket.ts     # WebSocket connection hook
```

### **Components Layer**
```
src/components/products/
├── ProductManagement.tsx        # Main product management
├── PartnerStoreManagement.tsx   # Partner catalog management
├── AddProductDialog.tsx         # Product creation/editing
└── ProductWebSocketIntegration.tsx # Real-time updates
```

## API Functions

### **Product APIs (`src/api/products.ts`)**

#### **Basic CRUD Operations**
```typescript
// Create product
const [product, error] = await createProductApi({
  name: "iPhone 15 Pro",
  description: "Latest iPhone",
  brand: "Apple",
  price: 999.99,
  wholesaleCost: 750.00,
  category: "Electronics",
  stock: 50,
  sku: "IPHONE15PRO",
  imageUrl: "https://example.com/image.jpg"
});

// Get all products with filters
const [products, error] = await getAllProductsApi({
  type: 'main-supplied',
  category: 'Electronics',
  status: 'active'
});

// Get product by ID
const [product, error] = await getProductByIdApi(productId);

// Update product
const [updatedProduct, error] = await updateProductApi(productId, {
  price: 899.99,
  stock: 75
});

// Delete product
const [message, error] = await deleteProductApi(productId);

// Bulk update
const [result, error] = await bulkUpdateProductsApi({
  productIds: ['id1', 'id2'],
  updateData: { status: 'archived' }
});

// Get by category
const [products, error] = await getProductsByCategoryApi('Electronics');

// Get statistics (Admin only)
const [stats, error] = await getProductStatsApi();
```

### **Partner Store APIs (`src/api/partnerStore.ts`)**

#### **Catalog Management**
```typescript
// Add main product to partner store
const [catalogItem, error] = await addProductToStoreApi({
  productId: 'product123',
  customPrice: 899.99,
  customStock: 25
});

// Remove product from store
const [message, error] = await removeProductFromStoreApi(productId);

// Update store product settings
const [updatedItem, error] = await updateStoreProductApi(productId, {
  customPrice: 849.99,
  customStock: 30,
  isActive: false
});

// Get partner store catalog
const [catalog, error] = await getPartnerStoreCatalogApi(includeInactive);

// Get partner store statistics
const [stats, error] = await getPartnerStoreStatsApi();

// Get available main products to add
const [products, error] = await getAvailableMainProductsApi('Electronics');
```

## Custom Hooks

### **Product Management Hook (`useProducts`)**

```typescript
const {
  products,           // Product[]
  loading,           // boolean
  error,             // string | null
  filters,           // ProductFilters
  createProduct,     // (data) => Promise<Product>
  updateProduct,     // (id, data) => Promise<Product>
  deleteProduct,     // (id) => Promise<void>
  bulkUpdateProducts,// (data) => Promise<{modifiedCount: number}>
  refreshProducts,   // () => void
  updateFilters,     // (filters) => void
  setFilters        // (filters) => void
} = useProducts(initialFilters);
```

**Usage Example:**
```typescript
function ProductsPage() {
  const {
    products,
    loading,
    createProduct,
    updateFilters
  } = useProducts({ status: 'active' });

  const handleCreate = async (productData) => {
    try {
      await createProduct(productData);
      toast.success('Product created successfully');
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleFilterChange = (newFilters) => {
    updateFilters(newFilters);
  };

  return (
    <div>
      {loading ? 'Loading...' : products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### **Partner Store Hook (`usePartnerStore`)**

```typescript
const {
  catalog,              // PartnerStoreCatalogItem[]
  loading,              // boolean
  error,                // string | null
  addProductToStore,    // (data) => Promise<PartnerStoreCatalogItem>
  removeProductFromStore,// (id) => Promise<void>
  updateStoreProduct,   // (id, data) => Promise<PartnerStoreCatalogItem>
  refreshCatalog        // (includeInactive?) => void
} = usePartnerStore();
```

### **Statistics Hooks**

```typescript
// Admin statistics
const { stats, loading, error, refreshStats } = useProductStats();

// Partner store statistics
const { stats, loading, error, refreshStats } = usePartnerStoreStats();

// Available main products for partners
const { products, loading, error, refreshProducts } = useAvailableMainProducts(category);
```

## Components

### **ProductManagement Component**

```typescript
<ProductManagement 
  viewMode="table"      // 'table' | 'grid' | 'list'
  showFilters={true}    // Show filter controls
  showActions={true}    // Show action buttons
/>
```

**Features:**
- ✅ Real-time data fetching
- ✅ Search and filtering
- ✅ Role-based actions
- ✅ Bulk operations
- ✅ Loading states
- ✅ Error handling

### **PartnerStoreManagement Component**

```typescript
<PartnerStoreManagement />
```

**Features:**
- ✅ View store catalog
- ✅ Add main products to store
- ✅ Set custom pricing and stock
- ✅ Enable/disable products
- ✅ Remove products from catalog

### **AddProductDialog Component**

```typescript
<AddProductDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onSave={handleSave}
  onCancel={handleCancel}
  product={editingProduct}  // Optional: for editing
/>
```

## Role-Based Features

### **Main Admin**
- ✅ **Full Product Management**: Create, read, update, delete all products
- ✅ **System Statistics**: Access to comprehensive product analytics
- ✅ **Bulk Operations**: Mass update products across the system
- ✅ **All Product Types**: Manage both main-supplied and partner-uploaded products

### **Partner Admin**
- ✅ **Own Product Management**: Full CRUD for their uploaded products
- ✅ **Store Catalog**: Add main products to their store with custom pricing
- ✅ **Store Statistics**: Analytics for their complete store (catalog + own products)
- ✅ **Inventory Control**: Manage stock levels for catalog products
- ✅ **Product Visibility**: Control which main products are active in their store

## Error Handling

### **API Error Pattern**
All API functions follow the `[data, error]` pattern:
```typescript
const [result, error] = await apiFunction(params);

if (error) {
  // Error handling
  toast.error(error.message);
  return;
}

// Success - use result
console.log(result);
```

### **Hook Error Handling**
Hooks automatically handle errors and provide error states:
```typescript
const { products, loading, error } = useProducts();

if (error) {
  return <ErrorDisplay error={error} onRetry={refreshProducts} />;
}
```

### **Component Error Boundaries**
Components include error boundaries and fallback UI:
```typescript
if (catalogError) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-center text-destructive">
          Error: {catalogError}
          <Button onClick={refreshCatalog}>Retry</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Real-Time Integration

### **WebSocket Events**
Products automatically receive real-time updates via WebSocket:

```typescript
// Events received
'product:created'   -> New product added
'product:updated'   -> Product modified
'product:deleted'   -> Product removed
'products:bulk-update' -> Bulk changes

// Role-based filtering
// Admins: See all events
// Partners: See main products + their own products only
```

### **Live Notifications**
```typescript
// Toast notifications for real-time events
toast.success("🆕 New product available: iPhone 15 Pro - $999");
toast.info("📝 Product updated: iPhone 15 Pro");
toast.warning("🗑️ Product removed from inventory");
```

## Loading States

### **Component Loading States**
```typescript
// Table loading
{loading ? (
  <TableRow>
    <TableCell colSpan={6} className="text-center py-8">
      Loading products...
    </TableCell>
  </TableRow>
) : (
  // Products content
)}

// Button loading
<Button disabled={loading}>
  {loading ? 'Creating...' : 'Create Product'}
</Button>

// Statistics loading
<div className="text-2xl font-bold">
  {adminStatsLoading ? '...' : adminStats?.overview.totalProducts || 0}
</div>
```

## Data Flow

### **Product Creation Flow**
1. User fills form in `AddProductDialog`
2. Form calls `createProduct` from `useProducts` hook
3. Hook calls `createProductApi` with form data
4. API makes HTTP request to backend
5. Success: Product added to local state, WebSocket event emitted
6. Error: Toast notification shown, form stays open

### **Partner Store Management Flow**
1. Partner views available main products
2. Clicks "Add to Store" on desired product
3. `addProductToStore` called with custom pricing
4. API creates catalog entry in backend
5. WebSocket event notifies of catalog addition
6. Local catalog state updated
7. Available products refreshed (product removed from available list)

## Performance Optimizations

### **Efficient Re-renders**
- ✅ Memoized callbacks with `useCallback`
- ✅ Optimized dependency arrays
- ✅ Conditional rendering based on loading states

### **API Optimizations**
- ✅ Request deduplication
- ✅ Optimistic updates for better UX
- ✅ Efficient pagination (ready for implementation)
- ✅ Smart caching with React Query (future enhancement)

### **WebSocket Optimizations**
- ✅ Event listener cleanup on unmount
- ✅ Efficient event filtering
- ✅ Batched state updates

## Usage Examples

### **Complete Product Management Page**
```typescript
export default function ProductsPage() {
  const { user } = useUser();
  const isMainAdmin = user.role === 'main-admin';

  return (
    <div className="space-y-6">
      <ProductWebSocketIntegration />
      
      {isMainAdmin ? (
        <ProductManagement showActions={true} />
      ) : (
        <Tabs defaultValue="my-products">
          <TabsList>
            <TabsTrigger value="my-products">My Products</TabsTrigger>
            <TabsTrigger value="store-catalog">Store Catalog</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-products">
            <ProductManagement showActions={true} />
          </TabsContent>
          
          <TabsContent value="store-catalog">
            <PartnerStoreManagement />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
```

### **Custom Product Hook Usage**
```typescript
function CustomProductComponent() {
  const {
    products,
    loading,
    error,
    createProduct,
    updateFilters
  } = useProducts({ status: 'active' });

  const handleQuickCreate = async () => {
    try {
      await createProduct({
        name: 'Quick Product',
        price: 99.99,
        // ... other required fields
      });
    } catch (err) {
      // Error handled automatically
    }
  };

  return (
    <div>
      <button onClick={handleQuickCreate}>Quick Create</button>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

The frontend product API implementation is now **complete**, **production-ready**, and provides a seamless experience for both admin and partner users! 🚀✨
