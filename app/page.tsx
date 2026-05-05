"use client";

import { Box, SimpleGrid, Stat, StatLabel, StatNumber, Table, Thead, Tbody, Tr, Th, Td, Button, Skeleton, Text, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getOrders } from '../services/ordersService';
import { getProducts } from '../services/productsService';
import { getCustomers } from '../services/customersService';
import { Order } from '../types/order';
import Link from 'next/link';
import { StatusBadge } from '../components/ui/StatusBadge';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [ordersRes, allOrdersRes, productsRes, customersRes] = await Promise.all([
          getOrders({ page: 1, limit: 5 }),
          getOrders({ page: 1, limit: 100 }), // To get sum of totalAmount
          getProducts({ page: 1, limit: 100 }),
          getCustomers({ page: 1, limit: 100 })
        ]);

        setOrders(ordersRes.items);
        setTotalOrders(ordersRes.total);
        
        const sumSales = allOrdersRes.items.reduce((acc, order) => acc + order.totalAmount, 0);
        setTotalSales(sumSales);

        setTotalProducts(productsRes.total);
        setTotalCustomers(customersRes.total);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="#28251d">
        Dashboard
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Total Pedidos</StatLabel>
            <Skeleton isLoaded={!isLoading}>
              <StatNumber fontSize="3xl" color="#28251d">{totalOrders}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Total Vendido</StatLabel>
            <Skeleton isLoaded={!isLoading}>
              <StatNumber fontSize="3xl" color="#437a22" fontFamily="var(--font-ibm)">
                {formatCurrency(totalSales)}
              </StatNumber>
            </Skeleton>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Productos Activos</StatLabel>
            <Skeleton isLoaded={!isLoading}>
              <StatNumber fontSize="3xl" color="#28251d">{totalProducts}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Clientes Registrados</StatLabel>
            <Skeleton isLoaded={!isLoading}>
              <StatNumber fontSize="3xl" color="#28251d">{totalCustomers}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
      </SimpleGrid>

      <Box bg="white" borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)" overflow="hidden">
        <Flex justify="space-between" align="center" p={6} borderBottom="1px" borderColor="rgba(0,0,0,0.10)">
          <Text fontSize="lg" fontWeight="bold" color="#28251d">
            Últimos 5 pedidos
          </Text>
          <Button as={Link} href="/orders" variant="ghost" colorScheme="teal" size="sm">
            Ver todos →
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead bg="#f3f0ec">
              <Tr>
                <Th>Nº Pedido</Th>
                <Th>Cliente</Th>
                <Th>Ciudad</Th>
                <Th>Fecha</Th>
                <Th>Total</Th>
                <Th>Estado</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Tr key={i}>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                    <Td><Skeleton height="20px" /></Td>
                  </Tr>
                ))
              ) : orders.length === 0 ? (
                <Tr>
                  <Td colSpan={7} textAlign="center" py={8} color="#7a7974">
                    No hay pedidos recientes.
                  </Td>
                </Tr>
              ) : (
                orders.map((order) => (
                  <Tr key={order.id} _hover={{ bg: '#f9f8f5' }}>
                    <Td fontFamily="var(--font-ibm)" fontWeight="medium">{order.orderNumber}</Td>
                    <Td>{order.customer?.firstName} {order.customer?.lastName}</Td>
                    <Td>{order.customer?.city}</Td>
                    <Td>{formatDate(order.orderDate)}</Td>
                    <Td fontFamily="var(--font-ibm)">{formatCurrency(order.totalAmount)}</Td>
                    <Td><StatusBadge status="Activo" /></Td>
                    <Td>
                      <Button as={Link} href={`/orders/${order.id}`} size="sm" variant="outline" colorScheme="teal">
                        Ver detalle
                      </Button>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
