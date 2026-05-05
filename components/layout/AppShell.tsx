"use client";

import { Box, Drawer, DrawerContent, DrawerOverlay, useDisclosure } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export const AppShell = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="#f7f6f2">
      <Sidebar display={{ base: 'none', md: 'block' }} />
      
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
      >
        <DrawerOverlay />
        <DrawerContent bg="transparent" boxShadow="none" maxW="240px">
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Box ml={{ base: 0, md: '240px' }} transition=".3s ease">
        <Topbar onOpenSidebar={onOpen} />
        <Box p={8}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
