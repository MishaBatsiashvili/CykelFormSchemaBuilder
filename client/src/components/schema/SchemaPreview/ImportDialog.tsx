import { Box, Text } from "@chakra-ui/react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
} from "@/components/chakra/dialog";
import { useToast } from "@/hooks/use-toast";
import { validateSchema } from "@/lib/schema-validation";
import { useSchemaStore } from "@/store/schema";
import { ImportDialogProps } from "./types";

export function ImportDialog({ open, onOpenChange, onImport }: ImportDialogProps) {
  const { toast } = useToast();
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSchema = JSON.parse(e.target?.result as string);
        const validationResult = validateSchema(importedSchema);

        if (!validationResult.success) {
          throw new Error(
            `Invalid schema format: ${validationResult.error.errors
              .map((err) => `${err.path.join(".")}: ${err.message}`)
              .join(", ")}`,
          );
        }

        // Check for runnables with more than 20 inputs
        const invalidRunnables = validationResult.data.runnables.filter(
          runnable => runnable.inputs.length > 20
        );

        if (invalidRunnables.length > 0) {
          throw new Error(
            `Cannot import schema: The following runnables exceed 20 inputs: ${invalidRunnables
              .map(r => r.path)
              .join(", ")}`
          );
        }

        // Check for duplicate paths
        const currentRunnables = useSchemaStore.getState().history.present.runnables;
        const duplicatePaths = validationResult.data.runnables.filter(
          newRunnable => currentRunnables.some(
            existingRunnable => existingRunnable.path === newRunnable.path
          )
        );

        if (duplicatePaths.length > 0) {
          throw new Error(
            `Cannot import schema: The following paths already exist: ${duplicatePaths
              .map(r => r.path)
              .join(", ")}`
          );
        }

        onImport(validationResult.data);
        onOpenChange({ open: false });

        toast({
          title: "Schema Imported",
          description: "The schema has been successfully imported and validated.",
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: error instanceof Error
            ? error.message
            : "Failed to import schema. Please check if the file is valid.",
          type: "error"
        });
      }
    };

    reader.readAsText(file);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Import Schema</DialogTitle>
      </DialogHeader>

      <DialogBody>
        <Box>
          <Text mb={4}>Select a JSON file containing your schema:</Text>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ width: "100%" }}
          />
        </Box>
      </DialogBody>

      <DialogCloseTrigger />
    </DialogContent>
  );
} 