"use client";

import { Box, Flex, Text, Badge } from '@chakra-ui/react';
import { Order } from '../../types/order';

export const OrderDetail = ({ order }: { order: Order }) => {
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES');

  return (
    <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
      <Text fontSize="lg" fontWeight="bold" mb={4} color="#28251d">Información del pedido</Text>
      <Flex direction="column" gap={3}>
        <Flex justify="space-between">
          <Text color="#7a7974">Nº Pedido</Text>
          <Text fontFamily="var(--font-ibm)" fontWeight="bold">{order.orderNumber}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text color="#7a7974">Fecha</Text>
          <Text>{formatDate(order.orderDate)}</Text>
        </Flex>
        <Flex justify="space-between">
          <Text color="#7a7974">Estado</Text>
          <Badge colorScheme="green" variant="subtle">Activo</Badge>
        </Flex>
      </Flex>
    </Box>
  );
};
