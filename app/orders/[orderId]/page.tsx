"use client";

import { Box, Flex, Text, Button, SimpleGrid, useDisclosure, useToast, Skeleton } from '@chakra-ui/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getOrderById, deleteOrder } from '../../../services/ordersService';
import { Order } from '../../../types/order';
import { OrderDetail } from '../../../components/orders/OrderDetail';
import { OrderItemsTable } from '../../../components/orders/OrderItemsTable';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(Number(orderId));
        setOrder(data);
      } catch (error) {
        toast({ title: 'Error', description: 'No se pudo cargar el pedido', status: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteOrder(Number(orderId));
      toast({ title: 'Pedido eliminado', status: 'success' });
      router.push('/orders');
    } catch (error) {
      toast({ title: 'Error', status: 'error' });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  if (isLoading) return <Skeleton height="400px" />;
  if (!order) return <Text>Pedido no encontrado.</Text>;

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="#28251d">Detalle del Pedido #{order.orderNumber}</Text>
        <Flex gap={3}>
          <Button as={Link} href={`/orders/${order.id}/edit`} variant="outline" colorScheme="blue">
            Editar pedido
          </Button>
          <Button variant="ghost" colorScheme="red" onClick={onOpen}>
            Eliminar pedido
          </Button>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Box gridColumn={{ md: 'span 2' }}>
          <OrderDetail order={order} />
          <OrderItemsTable order={order} />
        </Box>
        <Box>
          <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
            <Text fontSize="lg" fontWeight="bold" mb={4} color="#28251d">Cliente</Text>
            <Flex direction="column" gap={3}>
              <Text fontWeight="bold">{order.customer.firstName} {order.customer.lastName}</Text>
              <Text color="gray.600">{order.customer.city}, {order.customer.country}</Text>
              <Text color="gray.600">📞 {order.customer.phone}</Text>
            </Flex>
          </Box>
        </Box>
      </SimpleGrid>

      <ConfirmDialog isOpen={isOpen} onClose={onClose} onConfirm={handleDelete} isLoading={isDeleting} />
    </Box>
  );
}
