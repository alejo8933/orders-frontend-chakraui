"use client";

import { Box, Flex, Text, Button, Select, Input, useToast, FormControl, FormLabel, FormErrorMessage, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, replaceOrder } from '../../services/ordersService';
import { getCustomers } from '../../services/customersService';
import { getProducts } from '../../services/productsService';
import { Customer } from '../../types/customer';
import { Product } from '../../types/product';
import { Order, OrderCreate } from '../../types/order';

interface OrderFormProps {
  initialData?: Order;
  isEdit?: boolean;
}

export const OrderForm = ({ initialData, isEdit }: OrderFormProps) => {
  const router = useRouter();
  const toast = useToast();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [customerId, setCustomerId] = useState<number | ''>(initialData?.customerId || '');
  const [orderDate, setOrderDate] = useState(initialData?.orderDate ? initialData.orderDate.split('T')[0] : '');

  useEffect(() => {
    if (!initialData?.orderDate) {
      setOrderDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData]);
  
  const [items, setItems] = useState<{ productId: number | ''; quantity: number; unitPrice: number; uid: number }[]>(
    initialData?.items.map((i, idx) => ({
      productId: i.productId,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      uid: idx
    })) || [{ productId: '', quantity: 1, unitPrice: 0, uid: Date.now() }]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/Orders.json');
        const allOrders = await res.json();

        const customersMap = new Map();
        const productsMap = new Map();

        allOrders.forEach((o: any) => {
          if (!customersMap.has(o.customer.id)) customersMap.set(o.customer.id, o.customer);
          o.items.forEach((i: any) => {
            if (!productsMap.has(i.product.id)) productsMap.set(i.product.id, i.product);
          });
        });

        setCustomers(Array.from(customersMap.values()));
        setProducts(Array.from(productsMap.values()));
      } catch (e) {
        console.error(e);
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleProductChange = (uid: number, prodIdStr: string) => {
    const pId = parseInt(prodIdStr);
    const prod = products.find(p => p.id === pId);
    setItems(items.map(it => 
      it.uid === uid ? { ...it, productId: pId || '', unitPrice: prod?.unitPrice || 0 } : it
    ));
  };

  const handleQuantityChange = (uid: number, qty: number) => {
    setItems(items.map(it => 
      it.uid === uid ? { ...it, quantity: isNaN(qty) ? 0 : qty } : it
    ));
  };

  const addItem = () => setItems([...items, { productId: '', quantity: 1, unitPrice: 0, uid: Date.now() }]);
  
  const removeItem = (uid: number) => {
    if (items.length > 1) {
      setItems(items.filter(it => it.uid !== uid));
    }
  };

  const totalAmount = items.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const isValid = customerId !== '' && items.every(it => it.productId !== '' && it.quantity > 0) && items.length > 0;

  const handleSubmit = async () => {
    if (!isValid) return;
    try {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 500)); // Simulate API delay

      const formData = {
        customerId,
        orderDate,
        items,
        totalAmount
      };

      const orderId = isEdit && initialData ? initialData.id : Date.now();
      const saved = JSON.parse(localStorage.getItem('editedOrders') || '{}');
      saved[orderId] = { ...formData, id: orderId };
      localStorage.setItem('editedOrders', JSON.stringify(saved));
      
      router.push('/orders');
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo guardar el pedido', status: 'error', duration: 4000, position: 'top-right' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isDataLoading) return <Text>Cargando datos del formulario...</Text>;

  return (
    <Box maxW="640px" mx="auto" bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
      <Flex direction="column" gap={6}>
        <FormControl isInvalid={customerId === ''}>
          <FormLabel>Cliente</FormLabel>
          <Select 
            placeholder="Seleccionar cliente" 
            value={customerId} 
            onChange={(e) => setCustomerId(parseInt(e.target.value) || '')}
          >
            {customers.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>)}
          </Select>
          {customerId === '' && <FormErrorMessage>El cliente es requerido</FormErrorMessage>}
        </FormControl>

        <FormControl>
          <FormLabel>Fecha del pedido</FormLabel>
          <Input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} disabled={isEdit} />
        </FormControl>

        <Box>
          <Text fontWeight="bold" mb={4}>Productos</Text>
          {items.map((item, index) => (
            <Flex key={item.uid} gap={3} mb={3} align="flex-end">
              <FormControl flex={2} isInvalid={item.productId === ''}>
                {index === 0 && <FormLabel fontSize="sm" color="gray.500">Producto</FormLabel>}
                <Select 
                  placeholder="Seleccionar" 
                  value={item.productId}
                  onChange={(e) => handleProductChange(item.uid, e.target.value)}
                >
                  {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
                </Select>
              </FormControl>
              <FormControl flex={1} isInvalid={item.quantity < 1}>
                {index === 0 && <FormLabel fontSize="sm" color="gray.500">Cant.</FormLabel>}
                <NumberInput 
                  min={1} 
                  value={item.quantity} 
                  onChange={(_, valAsNum) => handleQuantityChange(item.uid, valAsNum)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Box flex={1} pb={2}>
                <Text fontSize="sm" color="gray.500" mb={1}>{index === 0 ? 'Precio' : ''}</Text>
                <Text fontFamily="var(--font-ibm)">{formatCurrency(item.unitPrice)}</Text>
              </Box>
              <Box flex={1} pb={2}>
                <Text fontSize="sm" color="gray.500" mb={1}>{index === 0 ? 'Subtotal' : ''}</Text>
                <Text fontFamily="var(--font-ibm)">{formatCurrency(item.quantity * item.unitPrice)}</Text>
              </Box>
              <Box pb={1}>
                {items.length > 1 && (
                  <Button size="sm" variant="ghost" colorScheme="red" onClick={() => removeItem(item.uid)}>✕</Button>
                )}
              </Box>
            </Flex>
          ))}
          <Button mt={2} size="sm" variant="outline" colorScheme="teal" onClick={addItem}>
            + Agregar producto
          </Button>
        </Box>

        <Box bg="#f3f0ec" p={4} borderRadius="md" textAlign="right">
          <Text color="gray.600" mb={1}>Total del pedido:</Text>
          <Text fontFamily="var(--font-ibm)" fontSize="28px" color="#01696f" fontWeight="bold">
            {formatCurrency(totalAmount)}
          </Text>
        </Box>

        <Button 
          w="full" 
          size="lg" 
          bg="#01696f" 
          color="white" 
          _hover={{ bg: '#0c4e54' }}
          onClick={handleSubmit}
          isLoading={isLoading}
          isDisabled={!isValid}
        >
          {isEdit ? 'Guardar cambios' : 'Crear Pedido'}
        </Button>
      </Flex>
    </Box>
  );
};
