// Mock data for Lovable Market Admin UI

export interface Partner {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  joinedDate: string;
  revenue: number;
  storeCount: number;
  ordersCount: number;
  avatar?: string;
  commission: number;
  location: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  wholesaleCost: number;
  margin: number;
  category: string;
  status: 'active' | 'draft' | 'archived';
  stock: number;
  sku: string;
  partnerId?: string;
  partnerName?: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  type: 'main-supplied' | 'partner-uploaded';
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  partnerId: string;
  partnerName: string;
  status: 'placed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  total: number;
  subtotal: number;
  commission: number;
  items: OrderItem[];
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  review?: Review;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  partnerId: string;
  partnerName: string;
  period: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'disputed' | 'cancelled';
  transactionCount: number;
  createdAt: string;
  processedAt?: string;
  details: SettlementDetail[];
}

export interface SettlementDetail {
  orderId: string;
  orderNumber: string;
  amount: number;
  commission: number;
  date: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  schema: any;
  previewUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
}

// Mock Partners
export const mockPartners: Partner[] = [
  {
    id: 'p1',
    name: 'TechnoGear Solutions',
    email: 'admin@technogear.com',
    status: 'active',
    joinedDate: '2024-01-15',
    revenue: 125000,
    storeCount: 3,
    ordersCount: 450,
    commission: 15,
    location: 'San Francisco, CA',
    category: 'Electronics',
  },
  {
    id: 'p2',
    name: 'Fashion Forward',
    email: 'contact@fashionforward.com',
    status: 'active',
    joinedDate: '2024-02-20',
    revenue: 89000,
    storeCount: 2,
    ordersCount: 320,
    commission: 20,
    location: 'New York, NY',
    category: 'Fashion',
  },
  {
    id: 'p3',
    name: 'Home & Garden Plus',
    email: 'info@homegardenplus.com',
    status: 'pending',
    joinedDate: '2024-08-10',
    revenue: 0,
    storeCount: 1,
    ordersCount: 0,
    commission: 18,
    location: 'Austin, TX',
    category: 'Home & Garden',
  },
  {
    id: 'p4',
    name: 'Sports Central',
    email: 'team@sportscentral.com',
    status: 'active',
    joinedDate: '2024-03-05',
    revenue: 67000,
    storeCount: 1,
    ordersCount: 210,
    commission: 22,
    location: 'Denver, CO',
    category: 'Sports',
  },
  {
    id: 'p5',
    name: 'Beauty Boutique',
    email: 'hello@beautyboutique.com',
    status: 'suspended',
    joinedDate: '2024-04-12',
    revenue: 34000,
    storeCount: 1,
    ordersCount: 150,
    commission: 25,
    location: 'Miami, FL',
    category: 'Beauty',
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
    price: 199.99,
    wholesaleCost: 80.00,
    margin: 60,
    category: 'Electronics',
    status: 'active',
    stock: 150,
    sku: 'WBH-2024-001',
    partnerId: 'p1',
    partnerName: 'TechnoGear Solutions',
    imageUrl: '/api/placeholder/300/300',
    createdAt: '2024-01-20',
    updatedAt: '2024-08-15',
    type: 'partner-uploaded',
  },
  {
    id: 'prod2',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainable, comfortable cotton t-shirt in multiple colors',
    price: 29.99,
    wholesaleCost: 12.00,
    margin: 60,
    category: 'Fashion',
    status: 'active',
    stock: 500,
    sku: 'OCT-2024-002',
    partnerId: 'p2',
    partnerName: 'Fashion Forward',
    imageUrl: '/api/placeholder/300/300',
    createdAt: '2024-02-25',
    updatedAt: '2024-08-10',
    type: 'partner-uploaded',
  },
  {
    id: 'prod3',
    name: 'Smart Garden Irrigation System',
    description: 'Automated watering system with smartphone control',
    price: 149.99,
    wholesaleCost: 75.00,
    margin: 50,
    category: 'Home & Garden',
    status: 'active',
    stock: 75,
    sku: 'SGIS-2024-003',
    imageUrl: '/api/placeholder/300/300',
    createdAt: '2024-03-10',
    updatedAt: '2024-08-12',
    type: 'main-supplied',
  },
  {
    id: 'prod4',
    name: 'Professional Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat with alignment guides',
    price: 59.99,
    wholesaleCost: 24.00,
    margin: 60,
    category: 'Sports',
    status: 'active',
    stock: 200,
    sku: 'PYM-2024-004',
    partnerId: 'p4',
    partnerName: 'Sports Central',
    imageUrl: '/api/placeholder/300/300',
    createdAt: '2024-03-15',
    updatedAt: '2024-08-08',
    type: 'partner-uploaded',
  },
  {
    id: 'prod5',
    name: 'Vitamin C Serum',
    description: 'Anti-aging vitamin C serum with hyaluronic acid',
    price: 45.99,
    wholesaleCost: 15.00,
    margin: 67,
    category: 'Beauty',
    status: 'active',
    stock: 120,
    sku: 'VCS-2024-005',
    partnerId: 'p5',
    partnerName: 'Beauty Boutique',
    imageUrl: '/api/placeholder/300/300',
    createdAt: '2024-04-20',
    updatedAt: '2024-08-05',
    type: 'partner-uploaded',
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 'ord1',
    orderNumber: 'ORD-2024-001',
    customerId: 'cust1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    partnerId: 'p1',
    partnerName: 'TechnoGear Solutions',
    status: 'delivered',
    total: 199.99,
    subtotal: 199.99,
    commission: 29.99,
    items: [
      {
        id: 'item1',
        productId: 'prod1',
        productName: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 199.99,
        total: 199.99,
      },
    ],
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    createdAt: '2024-08-01',
    updatedAt: '2024-08-15',
    trackingNumber: 'TRK123456789',
    review: {
      id: 'rev1',
      rating: 5,
      comment: 'Excellent sound quality and comfortable fit!',
      createdAt: '2024-08-16',
    },
  },
  {
    id: 'ord2',
    orderNumber: 'ORD-2024-002',
    customerId: 'cust2',
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@email.com',
    partnerId: 'p2',
    partnerName: 'Fashion Forward',
    status: 'processing',
    total: 89.97,
    subtotal: 89.97,
    commission: 17.99,
    items: [
      {
        id: 'item2',
        productId: 'prod2',
        productName: 'Organic Cotton T-Shirt',
        quantity: 3,
        price: 29.99,
        total: 89.97,
      },
    ],
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA',
    },
    createdAt: '2024-08-10',
    updatedAt: '2024-08-12',
  },
];

// Mock Settlements
export const mockSettlements: Settlement[] = [
  {
    id: 'set1',
    partnerId: 'p1',
    partnerName: 'TechnoGear Solutions',
    period: 'August 2024',
    amount: 2450.00,
    commission: 367.50,
    status: 'completed',
    transactionCount: 15,
    createdAt: '2024-09-01',
    processedAt: '2024-09-03',
    details: [
      {
        orderId: 'ord1',
        orderNumber: 'ORD-2024-001',
        amount: 199.99,
        commission: 29.99,
        date: '2024-08-01',
      },
    ],
  },
  {
    id: 'set2',
    partnerId: 'p2',
    partnerName: 'Fashion Forward',
    period: 'August 2024',
    amount: 1890.00,
    commission: 378.00,
    status: 'pending',
    transactionCount: 12,
    createdAt: '2024-09-01',
    details: [
      {
        orderId: 'ord2',
        orderNumber: 'ORD-2024-002',
        amount: 89.97,
        commission: 17.99,
        date: '2024-08-10',
      },
    ],
  },
];

// Mock Templates
export const mockTemplates: Template[] = [
  {
    id: 'tpl1',
    name: 'Modern Storefront',
    description: 'Clean, contemporary design with focus on product showcase',
    category: 'Storefront',
    schema: {
      layout: 'modern',
      colors: ['#2563eb', '#10b981'],
      typography: 'Inter',
      features: ['hero-section', 'product-grid', 'testimonials'],
    },
    isActive: true,
    createdAt: '2024-01-10',
    updatedAt: '2024-07-15',
    usageCount: 45,
  },
  {
    id: 'tpl2',
    name: 'Minimalist Layout',
    description: 'Simple, clean design with emphasis on typography',
    category: 'Storefront',
    schema: {
      layout: 'minimal',
      colors: ['#000000', '#ffffff'],
      typography: 'Helvetica',
      features: ['simple-header', 'clean-grid', 'minimal-footer'],
    },
    isActive: true,
    createdAt: '2024-02-20',
    updatedAt: '2024-08-01',
    usageCount: 32,
  },
];

// Analytics Mock Data
export const mockAnalytics = {
  overview: {
    totalRevenue: 425000,
    totalOrders: 1250,
    activePartners: 15,
    pendingSettlements: 8,
    fraudAlerts: 2,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    partnersGrowth: 25.0,
  },
  chartData: {
    revenue: [
      { month: 'Jan', amount: 32000 },
      { month: 'Feb', amount: 38000 },
      { month: 'Mar', amount: 42000 },
      { month: 'Apr', amount: 48000 },
      { month: 'May', amount: 52000 },
      { month: 'Jun', amount: 58000 },
      { month: 'Jul', amount: 62000 },
      { month: 'Aug', amount: 65000 },
    ],
    ordersByPartner: [
      { partner: 'TechnoGear', orders: 450 },
      { partner: 'Fashion Forward', orders: 320 },
      { partner: 'Sports Central', orders: 210 },
      { partner: 'Beauty Boutique', orders: 150 },
      { partner: 'Home & Garden', orders: 120 },
    ],
    topProducts: [
      { product: 'Wireless Headphones', sales: 245 },
      { product: 'Cotton T-Shirt', sales: 189 },
      { product: 'Yoga Mat', sales: 156 },
      { product: 'Vitamin C Serum', sales: 134 },
      { product: 'Garden System', sales: 98 },
    ],
  },
};