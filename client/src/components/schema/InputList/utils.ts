import { XYCoord } from 'react-dnd';

export const calculateDragDirection = (
  dragIndex: number,
  hoverIndex: number,
  hoverBoundingRect: DOMRect,
  clientOffset: XYCoord
) => {
  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  // Moving downwards
  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    return false;
  }

  // Moving upwards
  if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    return false;
  }

  return true;
}; 