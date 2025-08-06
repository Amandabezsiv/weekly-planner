import { useDraggable } from '@dnd-kit/core';

export default function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = e => {
    if (!isDragging && onClick) {
      e.stopPropagation();
      onClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`
        rounded-md shadow-sm p-3 mb-2 cursor-grab 
        hover:shadow-md transition-all duration-200 relative
        ${isDragging ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
        ${
          task.completed
            ? 'bg-green-50 border-2 border-green-200'
            : task.isTemporary
              ? 'bg-yellow-100 hover:bg-yellow-200 border-2 border-dashed border-yellow-400'
              : task.day
                ? 'bg-blue-100 hover:bg-blue-200'
                : 'bg-gray-100 hover:bg-gray-200'
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p
            className={`font-medium text-sm ${
              task.completed
                ? 'text-green-800 line-through'
                : task.isTemporary
                  ? 'text-yellow-800'
                  : task.day
                    ? 'text-gray-800'
                    : 'text-gray-600'
            }`}
          >
            {task.title}
          </p>

          {task.description && (
            <p
              className={`text-xs mt-1 line-clamp-2 ${
                task.completed ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {task.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          {task.completed && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">✓</span>
          )}
          {/* Badge de duração */}
          {task.duration > 1 && (
            <span
              className={`text-white text-xs px-2 py-1 rounded-full ${
                task.completed ? 'bg-green-500' : task.isTemporary ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
            >
              {task.duration}h
            </span>
          )}

          {(task.description || task.day) && !task.isTemporary && (
            <button
              onClick={handleClick}
              className={`text-sm ${
                task.completed
                  ? 'text-green-400 hover:text-green-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Ver detalhes"
            >
              ℹ️
            </button>
          )}
        </div>
      </div>

      {task.startHour !== undefined && task.day && (
        <p className="text-xs text-gray-600 mt-1">
          {`${task.startHour}:00 - ${task.startHour + (task.duration || 1)}:00`}
        </p>
      )}

      {task.isTemporary && <p className="text-xs text-yellow-600 mt-1 italic">Drag to schedule</p>}
    </div>
  );
}
