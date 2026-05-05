import { Customer } from './customer';
import { OrderItem } from './orderItem';

export interface Order {
  id: number;
  orderDate: string;
  orderNumber: string;
  customerId: number;
  totalAmount: number;
  customer: Customer;
  items: OrderItem[];
}

export interface OrderCreate {
  customerId: number;
  items: { productId: number; quantity: number }[];
}
