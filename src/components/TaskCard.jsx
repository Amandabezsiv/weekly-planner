
import { useDraggable } from '@dnd-kit/core';
import { use } from 'react';

export default function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="bg-blue-100 rounded-md shadow-sm p-3 mb-2 cursor-grab hover:bg-blue-200 transition"
    >
      <p className="text-gray-800 font-medium">{task.title}</p>
    </div>
  );
}
