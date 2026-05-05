"use client";

import { Box, Table, Thead, Tbody, Tr, Th, Td, Text, Flex } from '@chakra-ui/react';
import { Order } from '../../types/order';
import { Product } from '../../types/product';
import { useEffect, useState } from 'react';
import { getProductById } from '../../services/productsService';

export const OrderItemsTable = ({ order }: { order: Order }) => {
  const [products, setProducts] = useState<Record<number, Product>>({});

  useEffect(() => {
    const fetchProducts = async () => {
      const productData: Record<number, Product> = {};
      await Promise.all(
        order.items.map(async (item) => {
          if (!productData[item.productId]) {
            try {
              const prod = await getProductById(item.productId);
              productData[prod.id] = prod;
            } catch (e) {
              console.error(e);
            }
          }
        })
      );
      setProducts(productData);
    };
    fetchProducts();
  }, [order.items]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)" mt={6}>
      <Text fontSize="lg" fontWeight="bold" mb={4} color="#28251d">Productos</Text>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead bg="#f9f8f5">
            <Tr>
              <Th>Producto</Th>
              <Th isNumeric>Cantidad</Th>
              <Th isNumeric>Precio Unit.</Th>
              <Th isNumeric>Subtotal</Th>
            </Tr>
          </Thead>
          <Tbody>
            {order.items.map(item => (
              <Tr key={item.id}>
                <Td>{products[item.productId]?.productName || 'Cargando...'}</Td>
                <Td isNumeric>{item.quantity}</Td>
                <Td isNumeric fontFamily="var(--font-ibm)">{formatCurrency(item.unitPrice)}</Td>
                <Td isNumeric fontFamily="var(--font-ibm)">{formatCurrency(item.quantity * item.unitPrice)}</Td>
              </Tr>
            ))}
            <Tr bg="#f3f0ec">
              <Td colSpan={3} textAlign="right" fontWeight="bold">Total del Pedido:</Td>
              <Td isNumeric fontFamily="var(--font-ibm)" fontSize="18px" color="#01696f" fontWeight="bold">
                {formatCurrency(order.totalAmount)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
