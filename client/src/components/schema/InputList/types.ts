import { Runnable, Input, Schema } from "@/lib/schema";

export interface InputListProps {
  runnable: Runnable;
  schema: Schema;
}

export interface DraggableInputProps {
  input: Input;
  index: number;
  onDelete: () => void;
  moveInput: (dragIndex: number, hoverIndex: number) => void;
  runnable: Runnable;
  schema: Schema;
}

export interface DragItem {
  type: string;
  id: string;
  index: number;
} 