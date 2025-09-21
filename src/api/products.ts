import { get, post, put, del } from '../lib/http';
import { BASEURL } from '../lib/http';

// Product interfaces for API
export interface APIProduct {
  _id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  wholesaleCost?: number;
  category: string;
  stock: number;
  sku: string;
  imageUrl: string;
  type: 'main-supplied' | 'partner-uploaded';
  status: 'active' | 'draft' | 'archived';
  storeId?: {
    _id: string;
    companyName: string;
  };
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  brand: string;
  price: number;
  wholesaleCost: number;
  category: string;
  stock: number;
  sku: string;
  margin: number;
  imageUrl: string;
  status?: 'active' | 'draft' | 'archived';
  type?: 'main-supplied' | 'partner-uploaded';
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  brand?: string;
  price?: number;
  wholesaleCost?: number;
  category?: string;
  stock?: number;
  sku?: string;
  margin?: number;
  imageUrl?: string;
  status?: 'active' | 'draft' | 'archived';
}

export interface ProductFilters {
  type?: 'main-supplied' | 'partner-uploaded';
  category?: string;
  status?: 'active' | 'draft' | 'archived';
}

export interface BulkUpdatePayload {
  productIds: string[];
  updateData: {
    price?: number;
    stock?: number;
    status?: 'active' | 'draft' | 'archived';
  };
}

export interface ProductStats {
  overview: {
    totalProducts: number;
    mainSupplied: number;
    partnerUploaded: number;
    activeProducts: number;
    draftProducts: number;
    totalValue: number;
    averagePrice: number;
    totalStock: number;
  };
  categories: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
}

// Basic CRUD operations
export const createProductApi = async (payload: CreateProductPayload) => {
  try {
    const data = await post(`${BASEURL}/products`, payload);
    return [data.data as APIProduct, null] as [APIProduct, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const getAllProductsApi = async (filters?: ProductFilters) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.type) queryParams.append('type', filters.type);
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.status) queryParams.append('status', filters.status);
    
    const queryString = queryParams.toString();
    const url = queryString ? `${BASEURL}/products?${queryString}` : `${BASEURL}/products`;
    
    const data = await get(url);
    return [data.data as APIProduct[], null] as [APIProduct[], null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const getProductByIdApi = async (productId: string) => {
  try {
    const data = await get(`${BASEURL}/products/${productId}`);
    return [data.data as APIProduct, null] as [APIProduct, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const updateProductApi = async (productId: string, payload: UpdateProductPayload) => {
  try {
    const data = await put(`${BASEURL}/products/${productId}`, payload);
    return [data.data as APIProduct, null] as [APIProduct, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const deleteProductApi = async (productId: string) => {
  try {
    const data = await del(`${BASEURL}/products/${productId}`);
    return [data.message, null] as [string, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const bulkUpdateProductsApi = async (payload: BulkUpdatePayload) => {
  try {
    const data = await post(`${BASEURL}/products/bulk`, payload);
    return [data.data, null] as [{ modifiedCount: number }, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const getProductsByCategoryApi = async (category: string) => {
  try {
    const data = await get(`${BASEURL}/products/category/${category}`);
    return [data.data as APIProduct[], null] as [APIProduct[], null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

// Admin only
export const getProductStatsApi = async () => {
  try {
    const data = await get(`${BASEURL}/products/store/stats`);
    return [data.data as ProductStats, null] as [ProductStats, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};
