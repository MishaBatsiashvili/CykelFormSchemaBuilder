import { Button, Stack, Box, Flex, Card } from "@chakra-ui/react";
import { useSchemaStore } from "@/store/schema";
import { Plus } from "lucide-react";
import { useState } from "react";
import { DialogRoot, DialogTrigger } from "@/components/chakra/dialog";
import { RunnableFormData } from "./types";
import { AddRunnableDialog } from "./AddRunnableDialog";
import { RunnableItem } from "./RunnableItem";
import { validateUniquePath } from "./utils";

export default function RunnableList() {
  const [open, setOpen] = useState(false);
  const runnables = useSchemaStore((state) => state.history.present.runnables);
  const selectedRunnable = useSchemaStore((state) => state.selectedRunnable);
  const setSelectedRunnable = useSchemaStore((state) => state.setSelectedRunnable);
  const addRunnable = useSchemaStore((state) => state.addRunnable);

  const handleOpenChange = (details: { open: boolean }) => {
    setOpen(details.open);
  };

  const handleSubmit = (data: RunnableFormData) => {
    if (!validateUniquePath(data.path)) {
      // Handle error - path already exists
      return;
    }

    addRunnable({ ...data, inputs: [] });
    setOpen(false);
  };

  return (
    <Card.Root p={3} h="full" overflowY={'auto'}>
      <Stack direction="column" gap={4}>
        <DialogRoot 
          placement="center" 
          motionPreset="slide-in-bottom"
          open={open}
          onOpenChange={handleOpenChange}
        >
          <DialogTrigger asChild>
            <Button variant="solid" width="full">
              <Flex align="center" gap={2}>
                <Plus style={{ width: '16px', height: '16px' }} />
                Add Runnable
              </Flex>
            </Button>
          </DialogTrigger>

          <AddRunnableDialog
            open={open}
            onOpenChange={handleOpenChange}
            onSubmit={handleSubmit}
          />
        </DialogRoot>

        <Stack direction="column" gap={2} width="full">
          {runnables.map((runnable) => (
            <RunnableItem
              key={runnable.path}
              runnable={runnable}
              isSelected={selectedRunnable?.path === runnable.path}
              onSelect={setSelectedRunnable}
            />
          ))}
        </Stack>
      </Stack>
    </Card.Root>
  );
}

export * from './types'; 