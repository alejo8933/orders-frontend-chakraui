"use client";

import { Box, Text, Skeleton } from '@chakra-ui/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById } from '../../../../services/ordersService';
import { Order } from '../../../../types/order';
import { OrderForm } from '../../../../components/orders/OrderForm';

export default function EditOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch('/Orders.json');
        const allOrders = await res.json();
        const data = allOrders.find((o: any) => o.id === Number(orderId));
        setOrder(data || null);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (isLoading) return <Skeleton height="600px" maxW="640px" mx="auto" />;
  if (!order) return <Text textAlign="center">Pedido no encontrado.</Text>;

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="#28251d" textAlign="center">
        Editar pedido #{order.orderNumber}
      </Text>
      <OrderForm initialData={order} isEdit={true} />
    </Box>
  );
}
