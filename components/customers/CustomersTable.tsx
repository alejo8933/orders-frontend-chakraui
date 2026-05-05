"use client";

import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, useDisclosure, Skeleton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { Customer } from '../../types/customer';
import { useState } from 'react';
import { createCustomer, updateCustomer } from '../../services/customersService';

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const CustomersTable = ({ customers, isLoading, onRefresh }: CustomersTableProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState<Partial<Customer>>({});

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData(customer);
    onOpen();
  };

  const handleCreateClick = () => {
    setSelectedCustomer(null);
    setFormData({ firstName: '', lastName: '', city: '', country: '', phone: '' });
    onOpen();
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer.id, formData);
        toast({ title: 'Cliente actualizado', status: 'success' });
      } else {
        await createCustomer(formData as Omit<Customer, 'id'>);
        toast({ title: 'Cliente creado', status: 'success' });
      }
      onRefresh();
      onClose();
    } catch (e) {
      toast({ title: 'Error al guardar cliente', status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Flex justify="flex-end" mb={4}>
        <Button onClick={handleCreateClick} bg="#01696f" color="white" _hover={{ bg: '#0c4e54' }}>
          + Nuevo cliente
        </Button>
      </Flex>
      <Box overflowX="auto" bg="white" borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
        <Table variant="simple">
          <Thead bg="#f9f8f5">
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>Ciudad</Th>
              <Th>País</Th>
              <Th>Teléfono</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Tr key={i}><Td colSpan={6}><Skeleton height="20px" /></Td></Tr>
              ))
            ) : customers.length === 0 ? (
              <Tr><Td colSpan={6} textAlign="center" py={8} color="#7a7974">No se encontraron clientes.</Td></Tr>
            ) : (
              customers.map((customer) => (
                <Tr key={customer.id} _hover={{ bg: '#f9f8f5' }}>
                  <Td fontFamily="var(--font-ibm)">{customer.id}</Td>
                  <Td fontWeight="bold">{customer.firstName} {customer.lastName}</Td>
                  <Td>{customer.city}</Td>
                  <Td>{customer.country}</Td>
                  <Td>{customer.phone}</Td>
                  <Td>
                    <Flex gap={2}>
                      <Button size="sm" variant="ghost" colorScheme="blue" onClick={() => handleEditClick(customer)}>Editar</Button>
                      <Button as={Link} href={`/orders?customerId=${customer.id}`} size="sm" variant="ghost" colorScheme="teal">Ver pedidos</Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedCustomer ? 'Editar Cliente' : 'Nuevo Cliente'}</ModalHeader>
          <ModalBody>
            <Flex direction="column" gap={4}>
              <Flex gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
                <FormControl isRequired>
                  <FormLabel>Nombre</FormLabel>
                  <Input value={formData.firstName || ''} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Apellido</FormLabel>
                  <Input value={formData.lastName || ''} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </FormControl>
              </Flex>
              <Flex gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
                <FormControl>
                  <FormLabel>Ciudad</FormLabel>
                  <Input value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                </FormControl>
                <FormControl>
                  <FormLabel>País</FormLabel>
                  <Input value={formData.country || ''} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                </FormControl>
              </Flex>
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isSubmitting}>Cancelar</Button>
            <Button colorScheme="teal" bg="#01696f" onClick={handleSave} isLoading={isSubmitting} isDisabled={!formData.firstName || !formData.lastName}>
              Guardar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
