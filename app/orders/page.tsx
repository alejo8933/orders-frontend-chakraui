"use client";

import { Box, Flex, Text, Button, Input, Select } from '@chakra-ui/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getOrders } from '../../services/ordersService';
import { getCustomers } from '../../services/customersService';
import { Order } from '../../types/order';
import { Customer } from '../../types/customer';
import { OrdersTable } from '../../components/orders/OrdersTable';
import { PaginationBar } from '../../components/ui/PaginationBar';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OrdersContent() {
  const searchParams = useSearchParams();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [customerId, setCustomerId] = useState(searchParams.get('customerId') || '');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit };
      if (customerId) params.customerId = Number(customerId);
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      
      const res = await getOrders(params);
      
      let filteredItems = res.items;
      if (search) {
        filteredItems = filteredItems.filter(o => o.orderNumber.toLowerCase().includes(search.toLowerCase()));
      }

      setOrders(filteredItems);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, customerId, dateFrom, dateTo]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    getCustomers({ limit: 100 }).then(res => setCustomers(res.items)).catch(console.error);
  }, []);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color="#28251d">Pedidos</Text>
        <Button as={Link} href="/orders/new" bg="#01696f" color="white" _hover={{ bg: '#0c4e54' }}>
          Nuevo pedido
        </Button>
      </Flex>

      <Box bg="white" p={4} borderRadius="md" mb={6} border="1px" borderColor="rgba(0,0,0,0.10)">
        <Flex gap={4} wrap="wrap">
          <Input 
            placeholder="Buscar Nº Pedido..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            w={{ base: 'full', md: '200px' }}
          />
          <Select 
            placeholder="Todos los clientes" 
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            w={{ base: 'full', md: '200px' }}
          >
            {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
          </Select>
          <Input 
            type="date" 
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            w={{ base: 'full', md: '180px' }}
          />
          <Input 
            type="date" 
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            w={{ base: 'full', md: '180px' }}
          />
        </Flex>
      </Box>

      <Box bg="white" borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)" overflow="hidden">
        <OrdersTable orders={orders} isLoading={isLoading} onRefresh={fetchOrders} />
        <PaginationBar page={page} limit={limit} total={total} onPageChange={setPage} itemName="pedidos" />
      </Box>
    </Box>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Box p={8}><Text>Cargando pedidos...</Text></Box>}>
      <OrdersContent />
    </Suspense>
  );
}
