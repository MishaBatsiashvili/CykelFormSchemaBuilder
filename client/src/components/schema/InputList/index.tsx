import { Stack } from "@chakra-ui/react";
import { useSchemaStore } from "@/store/schema";
import { InputListProps } from "./types";
import { DraggableInput } from "./DraggableInput";

export default function InputList({ runnable, schema }: InputListProps) {
  const reorderInputs = useSchemaStore((state) => state.reorderInputs);
  const deleteInput = useSchemaStore((state) => state.deleteInput);

  const moveInput = (dragIndex: number, hoverIndex: number) => {
    const newOrder = [...runnable.inputs];
    const [removed] = newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, removed);
    reorderInputs(
      runnable.path,
      newOrder.map((input) => input.name),
    );
  };

  return (
    <Stack gap="3">
      {runnable.inputs.map((input, index) => (
        <DraggableInput
          key={input.name}
          input={input}
          index={index}
          onDelete={() => deleteInput(runnable.path, input.name)}
          moveInput={moveInput}
          runnable={runnable}
          schema={schema}
        />
      ))}
    </Stack>
  );
}

export * from './types';
export * from './DraggableInput'; 