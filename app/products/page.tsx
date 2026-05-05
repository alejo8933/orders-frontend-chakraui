"use client";

import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getProducts } from '../../services/productsService';
import { Product } from '../../types/product';
import { ProductsTable } from '../../components/products/ProductsTable';
import { PaginationBar } from '../../components/ui/PaginationBar';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/Orders.json');
      const allOrders = await res.json();
      
      const productsMap = new Map();
      allOrders.forEach((o: any) => {
        o.items.forEach((i: any) => {
          if (!productsMap.has(i.product.id)) {
            productsMap.set(i.product.id, i.product);
          }
        });
      });
      const allProducts = Array.from(productsMap.values());

      setTotal(allProducts.length);
      const startIndex = (page - 1) * limit;
      const paginatedItems = allProducts.slice(startIndex, startIndex + limit);
      setProducts(paginatedItems as Product[]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, limit]);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="#28251d">
        Gestión de Productos
      </Text>
      
      <ProductsTable products={products} isLoading={isLoading} onRefresh={fetchProducts} />
      
      <Box bg="white" mt={4} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
        <PaginationBar page={page} limit={limit} total={total} onPageChange={setPage} itemName="productos" />
      </Box>
    </Box>
  );
}
