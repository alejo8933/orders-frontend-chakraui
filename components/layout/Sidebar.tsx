"use client";

import { Box, Text, VStack, Link as ChakraLink, CloseButton, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Pedidos', href: '/orders' },
  { label: 'Productos', href: '/products' },
  { label: 'Clientes', href: '/customers' },
  { label: 'Estado', href: '/health' },
];

interface SidebarProps {
  onClose?: () => void;
  display?: object;
}

export const Sidebar = ({ onClose, display }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <Box
      w="240px"
      h="100vh"
      bg="white"
      borderRight="1px"
      borderColor="rgba(0,0,0,0.10)"
      py={6}
      px={4}
      display={display}
      position="fixed"
      left={0}
      top={0}
      zIndex={20}
    >
      <Flex justify="space-between" align="center" mb={8} px={2}>
        <Text fontSize="xl" fontWeight="bold" color="#01696f" fontFamily="IBM Plex Mono, monospace">
          ORDERS APP
        </Text>
        {onClose && <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />}
      </Flex>
      <VStack spacing={2} align="stretch">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <ChakraLink
              as={Link}
              key={item.href}
              href={item.href}
              p={3}
              borderRadius="md"
              bg={isActive ? '#cedcd8' : 'transparent'}
              color={isActive ? '#01696f' : '#28251d'}
              fontWeight={isActive ? 'bold' : 'normal'}
              _hover={{ bg: isActive ? '#cedcd8' : '#f3f0ec' }}
              style={{ textDecoration: 'none' }}
              onClick={onClose}
            >
              {item.label}
            </ChakraLink>
          );
        })}
      </VStack>
    </Box>
  );
};
