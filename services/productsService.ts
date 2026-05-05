import api from './api';
import { Product } from '../types/product';
import { PaginatedResponse } from '../types/pagination';

export interface GetProductsParams {
  page?: number;
  limit?: number;
}

export const getProducts = async (params?: GetProductsParams): Promise<PaginatedResponse<Product>> => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
