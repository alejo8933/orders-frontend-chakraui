"use client";

import { Box, Text } from '@chakra-ui/react';
import { OrderForm } from '../../../components/orders/OrderForm';

export default function NewOrderPage() {
  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="#28251d" textAlign="center">
        Crear nuevo pedido
      </Text>
      <OrderForm />
    </Box>
  );
}
