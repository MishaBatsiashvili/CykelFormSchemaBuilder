import React from "react";
import { Box, Card, Tabs } from "@chakra-ui/react";
import { useSchemaStore } from "@/store/schema";
import FormPreview from "../FormPreview";
import { SchemaHeader } from "./SchemaHeader";
import { getUnfulfilledConstraints } from "./utils";
import { Schema } from "@/lib/schema";
import { ClipboardButton, ClipboardRoot } from "@/components/chakra/clipboard";

export default function SchemaPreview() {
  const schema = useSchemaStore((state) => state.history.present);
  const validateSchemaStore = useSchemaStore((state) => state.validateSchema);
  const setSelectedRunnable = useSchemaStore((state) => state.setSelectedRunnable);
  const undo = useSchemaStore((state) => state.undo);
  const redo = useSchemaStore((state) => state.redo);
  const canUndo = useSchemaStore((state) => state.canUndo);
  const canRedo = useSchemaStore((state) => state.canRedo);

  // Validate schema when component mounts
  React.useEffect(() => {
    validateSchemaStore();
  }, [validateSchemaStore]);

  const constraints = getUnfulfilledConstraints(schema);

  const handleImport = (importedSchema: Schema) => {
    useSchemaStore.setState((state) => ({
      history: {
        past: [...state.history.past, state.history.present],
        present: importedSchema,
        future: [],
      },
      isValid: false, // Will be updated by validateSchema
    }));

    validateSchemaStore();

    // Automatically select the first imported runnable
    if (importedSchema.runnables.length > 0) {
      setSelectedRunnable(importedSchema.runnables[0]);
    }
  };

  return (
    <Card.Root h="full" display="flex" flexDirection="column">
      <SchemaHeader
        schema={schema}
        canUndo={canUndo()}
        canRedo={canRedo()}
        onUndo={undo}
        onRedo={redo}
        onImport={handleImport}
        constraints={constraints}
      />
      <Card.Body flex={1} p={0} display="flex" flexDirection="column" minH={0}>
        <Tabs.Root variant="enclosed" defaultValue="form" display="flex" flexDirection="column" h="full">
          <Tabs.List w="full" borderBottomWidth="1px" borderRadius="none">
            <Tabs.Trigger flex={1} value="form">
              Form
            </Tabs.Trigger>
            <Tabs.Trigger flex={1} value="json">
              JSON
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="form" flex={1} minH={0} p={0}>
            <FormPreview schema={schema} />
          </Tabs.Content>
          <Tabs.Content value="json" flex={1} minH={0} p={0}>
            <Box bg="gray.800" h="full" overflow="auto">
              <ClipboardRoot value={JSON.stringify(schema, null, 2)} textAlign="right">
                <ClipboardButton />
              </ClipboardRoot>
              <Box as="pre" p={4} fontSize="sm" fontFamily="mono" color="white">
                {JSON.stringify(schema, null, 2)}
              </Box>
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Card.Body>
    </Card.Root>
  );
}

export * from './types'; 