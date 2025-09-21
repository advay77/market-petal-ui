import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  addProductToStoreApi,
  removeProductFromStoreApi,
  updateStoreProductApi,
  getPartnerStoreCatalogApi,
  getPartnerStoreStatsApi,
  getAvailableMainProductsApi,
  AddToStorePayload,
  UpdateStoreProductPayload,
  PartnerStoreCatalogItem as APIPartnerStoreCatalogItem,
  PartnerStoreStats as APIPartnerStoreStats
} from '../api/partnerStore';
import { APIProduct } from '../api/products';
import { Product, convertAPIProductToProduct, convertAPIPartnerStoreItemToPartnerStoreItem, PartnerStoreCatalogItem, PartnerStoreStats } from '../types/product';
import { useUser } from '../context/UserContext';

export const usePartnerStore = () => {
  const { user } = useUser();
  const [catalog, setCatalog] = useState<PartnerStoreCatalogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async (includeInactive: boolean = false) => {
    if (user.role !== 'partner-admin') {
      setError('Access denied: Partners only');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [data, err] = await getPartnerStoreCatalogApi(includeInactive);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const convertedCatalog = data.map(convertAPIPartnerStoreItemToPartnerStoreItem);
        setCatalog(convertedCatalog);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch store catalog');
      toast.error('Failed to fetch store catalog');
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  const addProductToStore = useCallback(async (payload: AddToStorePayload) => {
    setLoading(true);
    try {
      const [data, err] = await addProductToStoreApi(payload);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const newCatalogItem = convertAPIPartnerStoreItemToPartnerStoreItem(data);
        setCatalog(prev => [newCatalogItem, ...prev]);
        toast.success('Product added to your store successfully');
        return newCatalogItem;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add product to store');
      toast.error(err.message || 'Failed to add product to store');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProductFromStore = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      const [message, err] = await removeProductFromStoreApi(productId);
      
      if (err) {
        throw err;
      }
      
      setCatalog(prev => prev.filter(item => item.product.id !== productId));
      toast.success(message || 'Product removed from store successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to remove product from store');
      toast.error(err.message || 'Failed to remove product from store');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStoreProduct = useCallback(async (productId: string, payload: UpdateStoreProductPayload) => {
    setLoading(true);
    try {
      const [data, err] = await updateStoreProductApi(productId, payload);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const updatedItem = convertAPIPartnerStoreItemToPartnerStoreItem(data);
        setCatalog(prev => prev.map(item => 
          item.product.id === productId ? updatedItem : item
        ));
        toast.success('Store product updated successfully');
        return updatedItem;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update store product');
      toast.error(err.message || 'Failed to update store product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCatalog = useCallback((includeInactive: boolean = false) => {
    fetchCatalog(includeInactive);
  }, [fetchCatalog]);

  // Initial load
  useEffect(() => {
    if (user.role === 'partner-admin') {
      fetchCatalog();
    }
  }, [fetchCatalog, user.role]);

  return {
    catalog,
    loading,
    error,
    addProductToStore,
    removeProductFromStore,
    updateStoreProduct,
    refreshCatalog
  };
};

export const usePartnerStoreStats = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<PartnerStoreStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (user.role !== 'partner-admin') {
      setError('Access denied: Partners only');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [data, err] = await getPartnerStoreStatsApi();
      
      if (err) {
        throw err;
      }
      
      if (data && data.overview) {
        // Convert API response to component type
        const convertedStats: PartnerStoreStats = {
          totalProducts: data.overview.totalProducts,
          catalogProducts: data.overview.catalogProducts,
          ownProducts: data.overview.ownProducts,
          activeOwnProducts: data.overview.activeOwnProducts,
          draftOwnProducts: data.overview.draftOwnProducts,
          totalValue: data.overview.totalValue,
          totalCatalogValue: data.overview.totalCatalogValue,
          totalOwnValue: data.overview.totalOwnValue,
          averagePrice: data.overview.averagePrice,
          totalStock: data.overview.totalStock
        };
        setStats(convertedStats);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch store statistics');
      toast.error('Failed to fetch store statistics');
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    if (user.role === 'partner-admin') {
      fetchStats();
    }
  }, [fetchStats, user.role]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};

export const useAvailableMainProducts = (category?: string) => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableProducts = useCallback(async (categoryFilter?: string) => {
    if (user.role !== 'partner-admin') {
      setError('Access denied: Partners only');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [data, err] = await getAvailableMainProductsApi(categoryFilter);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const convertedProducts = data.map(convertAPIProductToProduct);
        setProducts(convertedProducts);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch available products');
      toast.error('Failed to fetch available products');
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  const refreshProducts = useCallback((categoryFilter?: string) => {
    fetchAvailableProducts(categoryFilter);
  }, [fetchAvailableProducts]);

  useEffect(() => {
    if (user.role === 'partner-admin') {
      fetchAvailableProducts(category);
    }
  }, [fetchAvailableProducts, user.role, category]);

  return {
    products,
    loading,
    error,
    refreshProducts
  };
};
