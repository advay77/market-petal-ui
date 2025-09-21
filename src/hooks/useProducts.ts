import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getAllProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductByIdApi,
  getProductStatsApi,
  bulkUpdateProductsApi,
  APIProduct,
  CreateProductPayload,
  UpdateProductPayload,
  ProductFilters,
  BulkUpdatePayload,
  ProductStats
} from '../api/products';
import { Product, convertAPIProductToProduct } from '../types/product';
import { useUser } from '../context/UserContext';

export const useProducts = (initialFilters?: ProductFilters) => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const fetchProducts = useCallback(async (newFilters?: ProductFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const [data, err] = await getAllProductsApi(currentFilters);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const convertedProducts = data.map(convertAPIProductToProduct);
        setProducts(convertedProducts);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createProduct = useCallback(async (productData: CreateProductPayload) => {
    setLoading(true);
    try {
      const [data, err] = await createProductApi(productData);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const newProduct = convertAPIProductToProduct(data);
        setProducts(prev => [newProduct, ...prev]);
        toast.success('Product created successfully');
        return newProduct;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
      toast.error(err.message || 'Failed to create product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (productId: string, updateData: UpdateProductPayload) => {
    setLoading(true);
    try {
      const [data, err] = await updateProductApi(productId, updateData);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const updatedProduct = convertAPIProductToProduct(data);
        setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
        toast.success('Product updated successfully');
        return updatedProduct;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
      toast.error(err.message || 'Failed to update product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    setLoading(true);
    try {
      const [message, err] = await deleteProductApi(productId);
      
      if (err) {
        throw err;
      }
      
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(message || 'Product deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
      toast.error(err.message || 'Failed to delete product');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateProducts = useCallback(async (payload: BulkUpdatePayload) => {
    setLoading(true);
    try {
      const [data, err] = await bulkUpdateProductsApi(payload);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        // Refresh products after bulk update
        await fetchProducts();
        toast.success(`Successfully updated ${data.modifiedCount} products`);
        return data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to bulk update products');
      toast.error(err.message || 'Failed to bulk update products');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts]);

  const refreshProducts = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters: ProductFilters) => {
    setFilters(newFilters);
    fetchProducts(newFilters);
  }, [fetchProducts]);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateProducts,
    refreshProducts,
    updateFilters,
    setFilters
  };
};

export const useProductStats = () => {
  const { user } = useUser();
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (user.role !== 'main-admin') {
      setError('Access denied: Admin only');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [data, err] = await getProductStatsApi();
      
      if (err) {
        throw err;
      }
      
      if (data) {
        setStats(data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product statistics');
      toast.error('Failed to fetch product statistics');
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};

export const useProduct = (productId: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const [data, err] = await getProductByIdApi(id);
      
      if (err) {
        throw err;
      }
      
      if (data) {
        const convertedProduct = convertAPIProductToProduct(data);
        setProduct(convertedProduct);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
      toast.error('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setProduct(null);
    }
  }, [productId, fetchProduct]);

  return {
    product,
    loading,
    error,
    refreshProduct: () => productId && fetchProduct(productId)
  };
};
