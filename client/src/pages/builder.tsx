import React from "react";
import RunnableList from "@/components/schema/RunnableList/index";
import RunnableForm from "@/components/schema/RunnableForm/index";
import SchemaPreview from "@/components/schema/SchemaPreview/index";
import { useSchemaStore } from "@/store/schema";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect } from "react";
import { Box, Container, Flex, Text, Card } from "@chakra-ui/react";

export default function Builder() {
  const selectedRunnable = useSchemaStore((state) => state.selectedRunnable);
  const schema = useSchemaStore((state) => state.history.present);
  const setSelectedRunnable = useSchemaStore((state) => state.setSelectedRunnable);

  // Initialize with null selection on mount
  useEffect(() => {
    setSelectedRunnable(null);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Container maxW="container.xl" py={8}>
        <Flex gap={6} h="calc(100vh - 4rem)">
          <Box w="300px" h="full">
            <RunnableList />
          </Box>

          <Box flex={1} h="full">
            {selectedRunnable ? (
              <RunnableForm runnable={selectedRunnable} schema={schema} />
            ) : (
              <Card.Root p={8} textAlign="center" h="full">
                <Text color="gray.500">
                  Select or create a runnable to begin
                </Text>
              </Card.Root>
            )}
          </Box>

          <Box w="400px" h="full">
            <SchemaPreview />
          </Box>
        </Flex>
      </Container>
    </DndProvider>
  );
}