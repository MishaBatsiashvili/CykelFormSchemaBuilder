import { Button, Flex, Card } from "@chakra-ui/react";
import { Settings2, AlertTriangle } from "lucide-react";
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/chakra/dialog";
import { useState } from "react";
import { RunnableHeaderProps, OutputSettingsFormData } from "./types";
import { OutputSettingsDialog } from "./OutputSettingsDialog";

export function RunnableHeader({ 
  runnable,
  onDelete,
  onUpdateOutput 
}: RunnableHeaderProps) {
  const [outputSettingsOpen, setOutputSettingsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleOutputSettingsOpenChange = (details: { open: boolean }) => {
    setOutputSettingsOpen(details.open);
  };

  const handleDeleteDialogOpenChange = (details: { open: boolean }) => {
    setDeleteDialogOpen(details.open);
  };

  const handleOutputSettingsSubmit = (data: OutputSettingsFormData) => {
    onUpdateOutput(data);
    setOutputSettingsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setDeleteDialogOpen(false);
  };

  return (
    <Card.Header display="flex" alignItems="center" justifyContent="space-between" pb={4}>
      <Card.Title fontSize="xl" fontWeight="semibold" mb={4}>{runnable.path}</Card.Title>
      <Flex gap={2}>
        <DialogRoot 
          placement="center" 
          motionPreset="slide-in-bottom" 
          open={outputSettingsOpen} 
          onOpenChange={handleOutputSettingsOpenChange}
        >
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Flex align="center" gap={2}>
                <Settings2 style={{ width: '16px', height: '16px' }} />
                Output Settings
              </Flex>
            </Button>
          </DialogTrigger>
          <OutputSettingsDialog
            open={outputSettingsOpen}
            onOpenChange={handleOutputSettingsOpenChange}
            defaultValues={{
              dataTitle: runnable.output?.dataTitle || "",
              tip: runnable.output?.tip || "",
            }}
            onSubmit={handleOutputSettingsSubmit}
          />
        </DialogRoot>

        <DialogRoot
          placement="center"
          motionPreset="slide-in-bottom"
          open={deleteDialogOpen}
          onOpenChange={handleDeleteDialogOpenChange}
        >
          <DialogTrigger asChild>
            <Button
              colorPalette="red"
              variant="subtle"
              size="sm"
            >
              <Flex align="center" gap={2}>
                <AlertTriangle style={{ width: '16px', height: '16px' }} />
                Delete Runnable
              </Flex>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Runnable</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this runnable? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorPalette="red" variant={'subtle'} onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </Flex>
    </Card.Header>
  );
} 