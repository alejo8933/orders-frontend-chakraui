import api from './api';
import { Customer } from '../types/customer';
import { PaginatedResponse } from '../types/pagination';

export interface GetCustomersParams {
  page?: number;
  limit?: number;
}

export const getCustomers = async (params?: GetCustomersParams): Promise<PaginatedResponse<Customer>> => {
  const response = await api.get('/customers', { params });
  return response.data;
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const response = await api.get(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (data: Omit<Customer, 'id'>): Promise<Customer> => {
  const response = await api.post('/customers', data);
  return response.data;
};

export const updateCustomer = async (id: number, data: Partial<Omit<Customer, 'id'>>): Promise<Customer> => {
  const response = await api.patch(`/customers/${id}`, data);
  return response.data;
};
