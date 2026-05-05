"use client";

import { Badge } from '@chakra-ui/react';

interface StatusBadgeProps {
  status?: string;
  isDiscontinued?: boolean;
}

export const StatusBadge = ({ status, isDiscontinued }: StatusBadgeProps) => {
  if (isDiscontinued !== undefined) {
    return isDiscontinued ? (
      <Badge colorScheme="red" variant="subtle" px={2} py={1} borderRadius="md">
        Discontinuado
      </Badge>
    ) : (
      <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="md">
        Activo
      </Badge>
    );
  }

  const isActive = status?.toLowerCase() === 'activo';
  return (
    <Badge colorScheme={isActive ? 'green' : 'gray'} variant="subtle" px={2} py={1} borderRadius="md">
      {status || 'Desconocido'}
    </Badge>
  );
};
