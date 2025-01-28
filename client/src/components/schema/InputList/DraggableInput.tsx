import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button, Badge, Box, Flex, Text } from "@chakra-ui/react";
import { GripVertical, Trash2 } from "lucide-react";
import InputForm from "../InputForm/InputForm";
import { DraggableInputProps, DragItem } from "./types";
import { calculateDragDirection } from "./utils";

export function DraggableInput({
  input,
  index,
  onDelete,
  moveInput,
  runnable,
  schema,
}: DraggableInputProps) {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "INPUT",
    item: { type: "INPUT", id: input.name, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "INPUT",
    hover: (item: DragItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Get rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get mouse position
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) {
        return;
      }

      const shouldMove = calculateDragDirection(
        dragIndex,
        hoverIndex,
        hoverBoundingRect,
        clientOffset
      );

      if (!shouldMove) {
        return;
      }

      moveInput(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      p={3}
      bg="background"
      borderRadius="md"
      borderWidth="1px"
      boxShadow="sm"
      opacity={isDragging ? 0.5 : 1}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex align="center" flex={1} gap={3}>
        <Badge
          variant="outline"
          w="6"
          h="6"
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={0}
        >
          {index + 1}
        </Badge>
        <GripVertical style={{ width: '16px', height: '16px', cursor: 'move', color: 'var(--chakra-colors-gray-500)' }} />
        <Box>
          <Text fontWeight="medium">{input.name}</Text>
          <Text fontSize="sm" color="gray.500">{input.type}</Text>
        </Box>
      </Flex>
      <Flex align="center">
        <InputForm runnable={runnable} existingInput={input} schema={schema} />
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          colorScheme="red"
        >
          <Trash2 style={{ width: '16px', height: '16px' }} />
        </Button>
      </Flex>
    </Box>
  );
} 