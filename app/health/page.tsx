"use client";

import { Box, Text, Flex, Badge, Button, SimpleGrid } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Link from 'next/link';

export default function HealthPage() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  const checkHealth = async () => {
    try {
      setStatus('checking');
      const res = await api.get('/health');
      if (res.data?.status === 'ok' || res.status === 200) {
        setStatus('ok');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="#28251d">
        Estado del Sistema
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Text fontSize="lg" fontWeight="bold" mb={4} color="#28251d">Estado del servicio (API)</Text>
          <Flex direction="column" gap={4} align="flex-start">
            {status === 'checking' && (
              <Badge colorScheme="gray" p={2} borderRadius="md" fontSize="md">
                ↻ Verificando...
              </Badge>
            )}
            {status === 'ok' && (
              <Badge colorScheme="green" p={2} borderRadius="md" fontSize="md" display="flex" alignItems="center" gap={2}>
                <Box as="span" w={2} h={2} borderRadius="full" bg="green.500" />
                Servicio operativo
              </Badge>
            )}
            {status === 'error' && (
              <Badge colorScheme="red" p={2} borderRadius="md" fontSize="md" display="flex" alignItems="center" gap={2}>
                <Box as="span" w={2} h={2} borderRadius="full" bg="red.500" />
                No disponible
              </Badge>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              colorScheme="teal" 
              onClick={checkHealth}
              isLoading={status === 'checking'}
            >
              ↻ Verificar ahora
            </Button>
          </Flex>
        </Box>

        <Box bg="white" p={6} borderRadius="md" border="1px" borderColor="rgba(0,0,0,0.10)">
          <Text fontSize="lg" fontWeight="bold" mb={4} color="#28251d">Documentación API</Text>
          <Text color="gray.600" mb={4}>
            Explora los endpoints disponibles y prueba las peticiones directamente desde la interfaz de Swagger.
          </Text>
          <Button 
            as={Link} 
            href="https://orders-rest-api-python.onrender.com/api/v1/docs" 
            target="_blank" 
            rel="noopener noreferrer"
            bg="#01696f" 
            color="white" 
            _hover={{ bg: '#0c4e54' }}
          >
            Abrir Swagger →
          </Button>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
