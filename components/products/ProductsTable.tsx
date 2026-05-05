"use client";

import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Switch, useDisclosure, Skeleton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, FormControl, FormLabel, Input, useToast, Flex } from '@chakra-ui/react';
import { Product } from '../../types/product';
import { useState } from 'react';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import api from '../../services/api';

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ProductsTable = ({ products, isLoading, onRefresh }: ProductsTableProps) => {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const [formData, setFormData] = useState<Partial<Product>>({});

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setFormData(product);
    onEditOpen();
  };

  const handleCreateClick = () => {
    setSelectedProduct(null);
    setFormData({ productName: '', unitPrice: 0, package: '', isDiscontinued: false });
    onEditOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      if (selectedProduct) {
        await api.patch(`/products/${selectedProduct.id}`, formData);
        toast({ title: 'Producto actualizado', status: 'success' });
      } else {
        await api.post('/products', formData);
        toast({ title: 'Producto creado', status: 'success' });
      }
      onRefresh();
      onEditClose();
    } catch (e) {
      toast({ title: 'Aviso', description: 'La API de productos es de solo lectura en este entorno', status: 'warning', duration: 4000 });
      onEditClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      setIsSubmitting(true);
      await api.delete(`/products/${selectedProduct.id}`);
      toast({ title: 'Producto eliminado', status: 'success' });
      onRefresh();
      onDeleteClose();
    } catch (e) {
      toast({ title: 'Aviso', description: 'La API de productos es de solo lectura en este entorno', status: 'warning', duration: 4000 });
      onDeleteClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleDiscontinued = async (product: Product) => {
    try {
      await api.patch(`/products/${product.id}`, { isDiscontinued: !product.isDiscontinued });
      onRefresh();
    } catch (e) {
      toast({ title: 'Aviso', description: 'La API de productos es de solo lectura', status: 'warning' });
    }
  };

  return (
    <Box>
      <Flex justify="flex-end" mb={4}>
        <Button onClick={handleCreateClick} bg="#01696f" color="white" _hover={{ bg: '#0c4e54' }}>
          + Nuevo producto
        </Button>
      </Flex>
      <Box overflowX="auto" bg="white" borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
        <Table variant="simple">
          <Thead bg="#f9f8f5">
            <Tr>
              <Th>ID</Th>
              <Th>Producto</Th>
              <Th>Proveedor</Th>
              <Th isNumeric>Precio</Th>
              <Th>Presentación</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Tr key={i}><Td colSpan={7}><Skeleton height="20px" /></Td></Tr>
              ))
            ) : products.length === 0 ? (
              <Tr><Td colSpan={7} textAlign="center" py={8} color="#7a7974">No se encontraron productos.</Td></Tr>
            ) : (
              products.map((product) => (
                <Tr key={product.id} _hover={{ bg: '#f9f8f5' }}>
                  <Td fontFamily="var(--font-ibm)">{product.id}</Td>
                  <Td fontWeight="bold">{product.productName}</Td>
                  <Td>{product.supplier?.companyName || `ID: ${product.supplierId}`}</Td>
                  <Td isNumeric fontFamily="var(--font-ibm)">{formatCurrency(product.unitPrice)}</Td>
                  <Td>{product.package}</Td>
                  <Td>
                    <Switch 
                      colorScheme="teal" 
                      isChecked={!product.isDiscontinued} 
                      onChange={() => handleToggleDiscontinued(product)}
                    />
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button size="sm" variant="ghost" colorScheme="blue" onClick={() => handleEditClick(product)}>Editar</Button>
                      <Button size="sm" variant="ghost" colorScheme="red" onClick={() => handleDeleteClick(product)}>Eliminar</Button>
                    </Flex>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</ModalHeader>
          <ModalBody>
            <Flex direction="column" gap={4}>
              <FormControl isRequired>
                <FormLabel>Nombre del producto</FormLabel>
                <Input 
                  value={formData.productName || ''} 
                  onChange={(e) => setFormData({...formData, productName: e.target.value})} 
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Proveedor (ID)</FormLabel>
                <Input 
                  type="number"
                  value={formData.supplierId || ''} 
                  onChange={(e) => setFormData({...formData, supplierId: Number(e.target.value)})} 
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Precio Unitario</FormLabel>
                <Input 
                  type="number" step="0.01"
                  value={formData.unitPrice || ''} 
                  onChange={(e) => setFormData({...formData, unitPrice: Number(e.target.value)})} 
                />
              </FormControl>
              <FormControl>
                <FormLabel>Presentación</FormLabel>
                <Input 
                  value={formData.package || ''} 
                  onChange={(e) => setFormData({...formData, package: e.target.value})} 
                />
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Descontinuado</FormLabel>
                <Switch 
                  colorScheme="teal" 
                  isChecked={formData.isDiscontinued} 
                  onChange={(e) => setFormData({...formData, isDiscontinued: e.target.checked})} 
                />
              </FormControl>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose} isDisabled={isSubmitting}>Cancelar</Button>
            <Button colorScheme="teal" bg="#01696f" onClick={handleSave} isLoading={isSubmitting}>Guardar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog 
        isOpen={isDeleteOpen} 
        onClose={onDeleteClose} 
        onConfirm={handleDelete} 
        isLoading={isSubmitting} 
        title="Eliminar producto"
        body={`¿Está seguro de eliminar el producto ${selectedProduct?.productName}?`}
      />
    </Box>
  );
};
