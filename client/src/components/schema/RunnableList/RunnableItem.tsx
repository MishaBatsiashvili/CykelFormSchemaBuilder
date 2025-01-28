import React from "react";
import { Box, Flex, Text, Badge } from "@chakra-ui/react";
import { Workflow, ArrowRight } from "lucide-react";
import { RunnableItemProps } from "./types";

export function RunnableItem({ runnable, isSelected, onSelect }: RunnableItemProps) {
  return (
    <Box
      p={3}
      borderRadius="md"
      cursor="pointer"
      bg={isSelected ? "gray.100" : "gray.50"}
      _hover={{ bg: "gray.100" }}
      _dark={{
        bg: isSelected ? "whiteAlpha.200" : "whiteAlpha.100",
        _hover: { bg: "whiteAlpha.200" }
      }}
      onClick={() => onSelect(runnable)}
      width="full"
      transition="background 0.2s"
      border="1px solid"
      borderColor={isSelected ? "white" : "transparent"}
    >
      <Flex justifyContent="space-between" alignItems="center" mb={2}>
        <Text fontWeight="medium">{runnable.path}</Text>
        <Badge
          colorScheme={runnable.type === "initial" ? "blue" : "gray"}
          display="flex"
          alignItems="center"
          gap={1}
          px={2}
          py={1}
        >
          {runnable.type === "initial" ? (
            <Workflow style={{ height: "12px", width: "12px" }} />
          ) : (
            <ArrowRight style={{ height: "12px", width: "12px" }} />
          )}
          <Text fontSize="xs">{runnable.type}</Text>
        </Badge>
      </Flex>
      <Text fontSize="sm" color="gray.500">
        {runnable.inputs.length} input
        {runnable.inputs.length !== 1 ? "s" : ""}
      </Text>
    </Box>
  );
} 