"use client";

import { Table, Thead, Tbody, Tr, Th, Td, Button, Skeleton, useDisclosure, useToast, Box, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { Order } from '../../types/order';
import { deleteOrder } from '../../services/ordersService';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useState } from 'react';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const OrdersTable = ({ orders, isLoading, onRefresh }: OrdersTableProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES');

  const handleDeleteClick = (id: number) => {
    setSelectedOrderId(id);
    onOpen();
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrderId) return;
    try {
      setIsDeleting(true);
      await deleteOrder(selectedOrderId);
      toast({ title: 'Pedido eliminado', status: 'success', duration: 3000, position: 'top-right' });
      onRefresh();
    } catch (error) {
      toast({ title: 'Error al eliminar', status: 'error', duration: 4000, position: 'top-right' });
    } finally {
      setIsDeleting(false);
      onClose();
    }
  };

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead bg="#f9f8f5">
          <Tr>
            <Th>#</Th>
            <Th>Nº Pedido</Th>
            <Th>Cliente</Th>
            <Th>Ciudad</Th>
            <Th>País</Th>
            <Th>Fecha</Th>
            <Th>Total</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Tr key={i}><Td colSpan={8}><Skeleton height="20px" /></Td></Tr>
            ))
          ) : orders.length === 0 ? (
            <Tr><Td colSpan={8} textAlign="center" py={8} color="#7a7974">No se encontraron pedidos.</Td></Tr>
          ) : (
            orders.map((order, index) => (
              <Tr key={order.id} _hover={{ bg: '#f9f8f5' }}>
                <Td>{index + 1}</Td>
                <Td fontFamily="var(--font-ibm)">{order.orderNumber}</Td>
                <Td>{order.customer?.firstName} {order.customer?.lastName}</Td>
                <Td>{order.customer?.city}</Td>
                <Td>{order.customer?.country}</Td>
                <Td>{formatDate(order.orderDate)}</Td>
                <Td fontFamily="var(--font-ibm)">{formatCurrency(order.totalAmount)}</Td>
                <Td>
                  <Flex gap={2}>
                    <Button as={Link} href={`/orders/${order.id}`} size="sm" variant="ghost" title="Ver">👁️</Button>
                    <Button as={Link} href={`/orders/${order.id}/edit`} size="sm" variant="ghost" colorScheme="blue" title="Editar">✏️</Button>
                    <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteClick(order.id)} title="Eliminar">🗑️</Button>
                  </Flex>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      <ConfirmDialog isOpen={isOpen} onClose={onClose} onConfirm={handleConfirmDelete} isLoading={isDeleting} />
    </Box>
  );
};
