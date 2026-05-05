"use client"

import { useEffect, useState } from 'react'
import { Box, SimpleGrid, Text, Stat, StatLabel, StatNumber, Table, Thead, Tbody, Tr, Th, Td, Button, Skeleton, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import axios from 'axios'
import { StatusBadge } from '../components/ui/StatusBadge'

const API = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1` 
  : 'https://orders-rest-api-python.onrender.com/api/v1';

export default function Dashboard() {
  console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

  const [orders, setOrders] = useState<any[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalSold, setTotalSold] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [ordersRes, productsRes, customersRes] = await Promise.allSettled([
          axios.get(`${API}/orders?page=1&limit=5`),
          axios.get(`${API}/products?limit=100`),
          axios.get(`${API}/customers?limit=100`),
        ])
        
        if (ordersRes.status === 'fulfilled') {
          const data = ordersRes.value.data
          setOrders(data.items || [])
          setTotalOrders(data.total || 0)
          const total = (data.items || []).reduce(
            (sum: number, o: any) => sum + (o.totalAmount || o.total_amount || 0), 0)
          setTotalSold(total)
        }
        
        if (productsRes.status === 'fulfilled') {
          setTotalProducts(productsRes.value.data.total || 0)
        }
        
        if (customersRes.status === 'fulfilled') {
          setTotalCustomers(customersRes.value.data.total || 0)
        }
      } catch (err) {
        console.error('Error in dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
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
            <Skeleton isLoaded={!loading}>
              <StatNumber fontSize="3xl" color="#28251d">{totalOrders}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Total Vendido</StatLabel>
            <Skeleton isLoaded={!loading}>
              <StatNumber fontSize="3xl" color="#437a22" fontFamily="var(--font-ibm)">
                {formatCurrency(totalSold)}
              </StatNumber>
            </Skeleton>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Productos Activos</StatLabel>
            <Skeleton isLoaded={!loading}>
              <StatNumber fontSize="3xl" color="#28251d">{totalProducts}</StatNumber>
            </Skeleton>
          </Stat>
        </Box>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Stat>
            <StatLabel color="#7a7974" mb={2}>Clientes Registrados</StatLabel>
            <Skeleton isLoaded={!loading}>
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
              {loading ? (
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
                orders.map((order: any) => (
                  <Tr key={order.id} _hover={{ bg: '#f9f8f5' }}>
                    <Td fontFamily="var(--font-ibm)" fontWeight="medium">{order.orderNumber || order.order_number}</Td>
                    <Td>{order.customer?.firstName || order.customer?.first_name} {order.customer?.lastName || order.customer?.last_name}</Td>
                    <Td>{order.customer?.city}</Td>
                    <Td>{formatDate(order.orderDate || order.order_date)}</Td>
                    <Td fontFamily="var(--font-ibm)">{formatCurrency(order.totalAmount || order.total_amount || 0)}</Td>
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
  )
}
