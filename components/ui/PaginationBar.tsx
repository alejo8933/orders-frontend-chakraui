"use client";

import { Flex, Text, Button, Stack } from '@chakra-ui/react';

interface PaginationBarProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
  itemName?: string;
}

export const PaginationBar = ({
  page,
  limit,
  total,
  onPageChange,
  itemName = 'resultados',
}: PaginationBarProps) => {
  const totalPages = Math.ceil(total / limit) || 1;
  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <Flex
      justify="space-between"
      align="center"
      w="full"
      py={4}
      px={6}
      borderTop="1px solid"
      borderColor="gray.200"
    >
      <Text color="gray.600" fontSize="sm">
        Mostrando {startItem}-{endItem} de {total} {itemName}
      </Text>
      <Stack direction="row" spacing={2}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page - 1)}
          isDisabled={page <= 1}
        >
          Anterior
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(page + 1)}
          isDisabled={page >= totalPages}
        >
          Siguiente
        </Button>
      </Stack>
    </Flex>
  );
};
