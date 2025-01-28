import { Button, Flex, Card, Box } from "@chakra-ui/react";
import { Undo2, Redo2, FileDown, FileUp } from "lucide-react";
import { Tooltip } from "@/components/chakra/tooltip";
import { DialogRoot, DialogTrigger } from "@/components/chakra/dialog";
import { useState } from "react";
import { SchemaHeaderProps } from "./types";
import { ValidationStatus } from "./ValidationStatus";
import { ImportDialog } from "./ImportDialog";
import { useToast } from "@/hooks/use-toast";
import { downloadSchema } from "./utils";

export function SchemaHeader({ 
  schema,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onImport,
  constraints,
}: SchemaHeaderProps) {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleOpenChange = (details: { open: boolean }) => {
    setImportDialogOpen(details.open);
  };

  const handleExport = () => {
    downloadSchema(schema);
    toast({
      title: "Schema Exported",
      description: "Your schema has been downloaded as a JSON file.",
      type: "success"
    });
  };

  return (
    <Card.Header>
      <Flex alignItems="center" gap={4}>
        <Card.Title>Preview</Card.Title>
        <Flex gap={6} justifyContent="flex-end" width="full">
          <Flex gap={2}>
            <Tooltip showArrow content="Undo last change">
              <Button
                variant="outline"
                onClick={onUndo}
                disabled={!canUndo}
              >
                <Undo2 style={{ width: '1rem', height: '1rem' }} />
              </Button>
            </Tooltip>
            <Tooltip showArrow content="Redo last change">
              <Button
                variant="outline"
                onClick={onRedo}
                disabled={!canRedo}
              >
                <Redo2 style={{ width: '1rem', height: '1rem' }} />
              </Button>
            </Tooltip>
          </Flex>

          <Flex gap={2}>
            <Tooltip showArrow content="Export schema as JSON">
              <Button variant="outline" onClick={handleExport}>
                <FileDown style={{ width: '1rem', height: '1rem' }} />
              </Button>
            </Tooltip>

            <DialogRoot 
              placement="center" 
              motionPreset="slide-in-bottom"
              open={importDialogOpen}
              onOpenChange={handleOpenChange}
            >
              <Tooltip showArrow content="Import schema from JSON">
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileUp style={{ width: '1rem', height: '1rem' }} />
                  </Button>
                </DialogTrigger>
              </Tooltip>

              <ImportDialog
                open={importDialogOpen}
                onOpenChange={handleOpenChange}
                onImport={onImport}
              />
            </DialogRoot>
          </Flex>
        </Flex>
      </Flex>

      <ValidationStatus constraints={constraints} />

    </Card.Header>
  );
} 