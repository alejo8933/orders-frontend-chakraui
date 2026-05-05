import api from './api';
import { Order, OrderCreate } from '../types/order';
import { OrderItem } from '../types/orderItem';
import { PaginatedResponse } from '../types/pagination';

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  customerId?: number;
  dateFrom?: string;
  dateTo?: string;
  sort?: string;
}

export const getOrders = async (params?: GetOrdersParams): Promise<PaginatedResponse<Order>> => {
  const response = await api.get('/orders', { params });
  return response.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (data: OrderCreate): Promise<Order> => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const updateOrder = async (id: number, data: Partial<OrderCreate>): Promise<Order> => {
  const response = await api.patch(`/orders/${id}`, data);
  return response.data;
};

export const replaceOrder = async (id: number, data: OrderCreate): Promise<Order> => {
  const response = await api.put(`/orders/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await api.delete(`/orders/${id}`);
};

export const getOrderItems = async (orderId: number): Promise<OrderItem[]> => {
  const response = await api.get(`/orders/${orderId}/items`);
  return response.data;
};

export const addOrderItem = async (orderId: number, data: { productId: number; quantity: number }): Promise<OrderItem> => {
  const response = await api.post(`/orders/${orderId}/items`, data);
  return response.data;
};

export const updateOrderItem = async (orderId: number, itemId: number, data: { quantity: number }): Promise<OrderItem> => {
  const response = await api.patch(`/orders/${orderId}/items/${itemId}`, data);
  return response.data;
};

export const deleteOrderItem = async (orderId: number, itemId: number): Promise<void> => {
  await api.delete(`/orders/${orderId}/items/${itemId}`);
};
