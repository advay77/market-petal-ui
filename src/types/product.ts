// Frontend Product Types
export interface Product {
  id: string;
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
  storeInfo?: {
    id: string;
    companyName: string;
  };
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProductForm {
  type: 'main-supplied' | 'partner-uploaded';
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
}

export interface ProductFilters {
  type?: 'main-supplied' | 'partner-uploaded';
  category?: string;
  status?: 'active' | 'draft' | 'archived';
  search?: string;
}

export interface ProductStats {
  totalProducts: number;
  mainSupplied: number;
  partnerUploaded: number;
  activeProducts: number;
  draftProducts: number;
  totalValue: number;
  averagePrice: number;
  totalStock: number;
}

export interface CategoryStats {
  category: string;
  count: number;
  totalValue: number;
}

// Partner Store Types
export interface PartnerStoreCatalogItem {
  id: string;
  partnerId: string;
  product: Product;
  customPrice?: number;
  customStock?: number;
  isActive: boolean;
  addedAt: Date;
  updatedAt?: Date;
}

export interface PartnerStoreStats {
  totalProducts: number;
  catalogProducts: number;
  ownProducts: number;
  activeOwnProducts: number;
  draftOwnProducts: number;
  totalValue: number;
  totalCatalogValue: number;
  totalOwnValue: number;
  averagePrice: number;
  totalStock: number;
}

export interface AddToStoreForm {
  productId: string;
  customPrice?: number;
  customStock?: number;
}

export interface UpdateStoreProductForm {
  customPrice?: number;
  customStock?: number;
  isActive?: boolean;
}

// Product management action types
export type ProductAction = 
  | 'create'
  | 'edit'
  | 'delete'
  | 'view'
  | 'add-to-store'
  | 'remove-from-store'
  | 'update-store-settings';

// Product view modes
export type ProductViewMode = 'grid' | 'list' | 'table';

// Sorting options
export interface ProductSort {
  field: 'name' | 'price' | 'category' | 'stock' | 'createdAt';
  direction: 'asc' | 'desc';
}

// API response helpers
export const convertAPIProductToProduct = (apiProduct: any): Product => {
  return {
    id: apiProduct._id,
    name: apiProduct.name,
    description: apiProduct.description,
    brand: apiProduct.brand,
    price: apiProduct.price,
    wholesaleCost: apiProduct.wholesaleCost,
    category: apiProduct.category,
    stock: apiProduct.stock,
    sku: apiProduct.sku,
    imageUrl: apiProduct.imageUrl,
    type: apiProduct.type,
    status: apiProduct.status,
    storeInfo: apiProduct.storeId ? {
      id: apiProduct.storeId._id,
      companyName: apiProduct.storeId.companyName
    } : undefined,
    createdBy: apiProduct.createdBy,
    createdAt: apiProduct.createdAt ? new Date(apiProduct.createdAt) : undefined,
    updatedAt: apiProduct.updatedAt ? new Date(apiProduct.updatedAt) : undefined,
  };
};

export const convertAPIPartnerStoreItemToPartnerStoreItem = (apiItem: any): PartnerStoreCatalogItem => {
  return {
    id: apiItem._id,
    partnerId: apiItem.partnerId,
    product: convertAPIProductToProduct(apiItem.productId),
    customPrice: apiItem.customPrice,
    customStock: apiItem.customStock,
    isActive: apiItem.isActive,
    addedAt: new Date(apiItem.addedAt),
    updatedAt: apiItem.updatedAt ? new Date(apiItem.updatedAt) : undefined,
  };
};
