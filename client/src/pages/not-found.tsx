import { AlertCircle } from "lucide-react";
import { Box, Card, Flex, Text } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Box 
      minH="100vh" 
      w="full" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      bg="gray.50"
    >
      <Card.Root w="full" maxW="md" mx={4}>
        <Card.Body pt={6}>
          <Flex gap={2} mb={4}>
            <AlertCircle style={{ width: '2rem', height: '2rem', color: '#E53E3E' }} />
            <Text fontSize="2xl" fontWeight="bold" color="gray.900">
              404 Page Not Found
            </Text>
          </Flex>

          <Text mt={4} fontSize="sm" color="gray.600">
            Did you forget to add the page to the router?
          </Text>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
