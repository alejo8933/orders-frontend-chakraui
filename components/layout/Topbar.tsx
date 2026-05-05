"use client";

import { Flex, IconButton, Text, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TopbarProps {
  onOpenSidebar: () => void;
}

export const Topbar = ({ onOpenSidebar }: TopbarProps) => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((p) => p);
  
  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      w="full"
      px={8}
      py={4}
      bg="white"
      borderBottom="1px"
      borderColor="rgba(0,0,0,0.10)"
      h="72px"
    >
      <Flex align="center">
        <IconButton
          display={{ base: 'flex', md: 'none' }}
          aria-label="Menu"
          icon={<Text>☰</Text>}
          onClick={onOpenSidebar}
          variant="outline"
          mr={4}
        />
        <Breadcrumb fontWeight="medium" fontSize="sm" color="#7a7974">
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;
            return (
              <BreadcrumbItem key={href} isCurrentPage={isLast}>
                {isLast ? (
                  <BreadcrumbLink 
                    textTransform="capitalize"
                    color="#28251d"
                    fontWeight="bold"
                  >
                    {segment}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink 
                    as={Link} 
                    href={href} 
                    textTransform="capitalize"
                    color="inherit"
                    fontWeight="medium"
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </Flex>

      <Button
        as={Link}
        href="/orders/new"
        bg="#01696f"
        color="white"
        _hover={{ bg: '#0c4e54' }}
      >
        Nuevo pedido
      </Button>
    </Flex>
  );
};
