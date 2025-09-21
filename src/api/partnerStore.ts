import { get, post, put, del } from '../lib/http';
import { BASEURL } from '../lib/http';
import { APIProduct } from './products';

// Partner Store interfaces
export interface PartnerStoreCatalogItem {
  _id: string;
  partnerId: string;
  productId: APIProduct;
  customPrice?: number;
  customStock?: number;
  isActive: boolean;
  addedAt: string;
  updatedAt?: string;
}

export interface AddToStorePayload {
  productId: string;
  customPrice?: number;
  customStock?: number;
}

export interface UpdateStoreProductPayload {
  customPrice?: number;
  customStock?: number;
  isActive?: boolean;
}

export interface PartnerStoreStats {
  overview: {
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
  };
  categories: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
}

// Partner Store Management APIs
export const addProductToStoreApi = async (payload: AddToStorePayload) => {
  try {
    const data = await post(`${BASEURL}/products/store/add`, payload);
    return [data.data as PartnerStoreCatalogItem, null] as [PartnerStoreCatalogItem, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const removeProductFromStoreApi = async (productId: string) => {
  try {
    const data = await del(`${BASEURL}/products/store/${productId}`);
    return [data.message, null] as [string, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const updateStoreProductApi = async (productId: string, payload: UpdateStoreProductPayload) => {
  try {
    const data = await put(`${BASEURL}/products/store/${productId}`, payload);
    return [data.data as PartnerStoreCatalogItem, null] as [PartnerStoreCatalogItem, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const getPartnerStoreCatalogApi = async (includeInactive?: boolean) => {
  try {
    const queryString = includeInactive ? '?includeInactive=true' : '';
    const data = await get(`${BASEURL}/products/store/catalog${queryString}`);
    return [data.data as PartnerStoreCatalogItem[], null] as [PartnerStoreCatalogItem[], null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const getPartnerStoreStatsApi = async () => {
  try {
    const data = await get(`${BASEURL}/products/store/stats`);
    return [data.data as PartnerStoreStats, null] as [PartnerStoreStats, null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};

export const getAvailableMainProductsApi = async (category?: string) => {
  try {
    const queryString = category ? `?category=${category}` : '';
    const data = await get(`${BASEURL}/products/store/available${queryString}`);
    return [data.data as APIProduct[], null] as [APIProduct[], null];
  } catch (err) {
    return [null, err] as [null, Error];
  }
};
