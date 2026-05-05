"use client";

import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getCustomers } from '../../services/customersService';
import { Customer } from '../../types/customer';
import { CustomersTable } from '../../components/customers/CustomersTable';
import { PaginationBar } from '../../components/ui/PaginationBar';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const res = await getCustomers({ page, limit });
      setCustomers(res.items);
      setTotal(res.total);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="#28251d">
        Gestión de Clientes
      </Text>
      
      <CustomersTable customers={customers} isLoading={isLoading} onRefresh={fetchCustomers} />
      
      <Box bg="white" mt={4} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
        <PaginationBar page={page} limit={limit} total={total} onPageChange={setPage} itemName="clientes" />
      </Box>
    </Box>
  );
}
