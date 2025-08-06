import { useDraggable } from '@dnd-kit/core';

function formatHour(hour) {
  const period = hour < 12 ? 'AM' : 'PM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:00 ${period}`;
}

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

  const handleDoubleClick = e => {
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
      onDoubleClick={handleDoubleClick}
      className={`
        rounded-lg shadow-sm p-2 mb-1 cursor-grab backdrop-blur-sm border text-xs
        hover:shadow-md transition-all duration-200 relative
        ${isDragging ? 'ring-2 ring-opacity-75 shadow-lg' : ''}
        ${
          task.completed
            ? 'opacity-75'
            : task.isTemporary
              ? 'border-2 border-dashed'
              : task.day
                ? ''
                : ''
        }
      `}
      style={{
        ...style,
        backgroundColor: task.completed 
          ? '#9ECAD6' 
          : task.isTemporary 
            ? '#FFEAEA' 
            : task.day 
              ? '#F5CBCB' 
              : '#FFEAEA',
        borderColor: task.completed 
          ? '#9ECAD6' 
          : task.isTemporary 
            ? '#F5CBCB' 
            : task.day 
              ? '#F5CBCB' 
              : '#F5CBCB',
        ...(isDragging && { borderColor: '#F5CBCB', ringColor: '#F5CBCB' })
      }}
    >
      {/* Header da tarefa */}
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            {/* Indicador de status */}
            <div
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: task.completed
                  ? 'white'
                  : task.isTemporary
                    ? '#748DAE'
                    : task.day
                      ? '#748DAE'
                      : '#748DAE',
                ...(task.isTemporary && { animation: 'pulse 2s infinite' })
              }}
            />
            
            <h4
              className={`text-xs font-medium leading-tight ${
                task.completed ? 'line-through' : ''
              }`}
              style={{ 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
                color: task.completed 
                  ? 'white' 
                  : task.isTemporary 
                    ? '#748DAE' 
                    : task.day 
                      ? '#748DAE' 
                      : '#748DAE'
              }}
            >
              {task.title}
            </h4>
          </div>

          {task.description && (
            <p className="text-xs line-clamp-1 mt-1 leading-tight" style={{color: task.completed ? 'white' : '#748DAE'}}>
              {task.description}
            </p>
          )}
        </div>
        
        {/* Badges e botões - mais compactos */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Badge de duração */}
          {task.duration > 1 && (
            <span
              className="text-xs px-1 py-0.5 rounded font-medium text-white"
              style={{
                backgroundColor: task.completed 
                  ? '#9ECAD6' 
                  : task.isTemporary 
                    ? '#F5CBCB' 
                    : '#748DAE'
              }}
            >
              {task.duration}h
            </span>
          )}

          {/* Botão de detalhes */}
          {(task.description || task.day) && !task.isTemporary && (
            <button
              onClick={handleClick}
              className="p-1 rounded hover:bg-white/50 transition-colors duration-200"
              title="View details"
            >
              <svg className="w-2.5 h-2.5" fill="#748DAE" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Footer com informações extras - mais compacto */}
      <div className="mt-1 flex items-center justify-between text-xs">
        {/* Horário (se agendada) */}
        {task.startHour !== undefined && task.day && (
                    <span className="bg-white/60 px-1 py-0.5 rounded text-xs" style={{color: '#748DAE'}}>
            {formatHour(task.startHour)}
          </span>
        )}

        {/* Status para tarefa temporária */}
        {task.isTemporary && (
          <span className="px-1 py-0.5 rounded italic text-xs" style={{color: '#748DAE', backgroundColor: '#FFEAEA'}}>
            Drag me
          </span>
        )}

        {/* Status concluída */}
        {task.completed && (
          <span className="px-1 py-0.5 rounded font-medium text-xs" style={{color: 'white', backgroundColor: '#9ECAD6'}}>
            ✓ Done
          </span>
        )}
      </div>
    </div>
  );
}
