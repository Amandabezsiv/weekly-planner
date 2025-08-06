'use client';

import TaskCard from './TaskCard';
import { useDroppable } from '@dnd-kit/core';

const hours = Array.from({ length: 24 }, (_, i) => i);

function formatHour(hour) {
  const period = hour < 12 ? 'AM' : 'PM';
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:00 ${period}`;
}

export default function DayColumn({ day, tasks, onTaskClick }) {
  // Extrair apenas o nome do dia para exibição mais fofa
  const dayName = day.split(' - ')[0];
  const dayDate = day.split(' - ')[1];
  
  // Mostrar todos os horários (sem filtro)
  const filteredHours = hours;
  
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-pink-100 p-2 min-h-full flex flex-col">
      {/* Header do dia - mais compacto */}
      <div className="text-center mb-2 pb-2 border-b border-pink-100 flex-shrink-0">
        <h3 className="font-bold text-gray-800 text-xs">{dayName}</h3>
        <p className="text-xs" style={{color: '#748DAE'}}>{dayDate}</p>
      </div>
      
      {/* Horários - área rolável */}
      <div className="flex-1 space-y-1 overflow-y-auto max-h-[500px]">
        {filteredHours.map(hour => {
          const droppableId = `${day}-${hour}`;
          const { setNodeRef, isOver } = useDroppable({ id: droppableId });

          const tasksStartingThisHour = tasks.filter(task => task.startHour === hour);

          const isOccupied = tasks.some(
            task => hour >= task.startHour && hour < task.startHour + task.duration
          );

          return (
            <div
              key={hour}
              ref={setNodeRef}
              className={`transition-all duration-200 border rounded-lg ${
                isOver 
                  ? 'shadow-sm' 
                  : isOccupied 
                    ? '' 
                    : 'hover:bg-gray-50'
              }`}
              style={{
                backgroundColor: isOver 
                  ? '#F5CBCB' 
                  : isOccupied 
                    ? '#FFEAEA' 
                    : 'white',
                borderColor: isOver 
                  ? '#F5CBCB' 
                  : '#F5CBCB'
              }}
            >
              {/* Horário - header fixo */}
              <div className="px-2 py-1 flex items-center justify-between rounded-t-lg" style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB', borderBottom: '1px solid'}}>
                <span className="text-xs font-medium" style={{color: '#748DAE'}}>
                  {formatHour(hour)}
                </span>
                {isOver && (
                  <span className="text-xs font-medium" style={{color: '#748DAE'}}>Drop here</span>
                )}
              </div>

              {/* Área das tarefas - maior altura para títulos */}
              <div className="p-2 min-h-[70px] space-y-1">
                {/* Tarefas que começam neste horário */}
                {tasksStartingThisHour.map(task => (
                  <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                ))}

                {/* Indicador de continuação de tarefa */}
                {tasks
                  .filter(task => hour > task.startHour && hour < task.startHour + task.duration)
                  .map(task => (
                    <div
                      key={`${task.id}-continuation`}
                      className="rounded-r-lg p-2"
                      style={{backgroundColor: '#FFEAEA', borderLeft: '4px solid #F5CBCB'}}
                    >
                      <div className="text-xs font-medium flex items-center gap-2" style={{color: '#748DAE'}}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{backgroundColor: '#748DAE'}}/>
                        <span className="truncate">{task.title}</span>
                      </div>
                      <span className="text-xs" style={{color: '#748DAE'}}>(continuation)</span>
                    </div>
                  ))}
                
                {/* Placeholder quando vazio - mais sutil */}
                {!tasksStartingThisHour.length && 
                 !tasks.filter(task => hour > task.startHour && hour < task.startHour + task.duration).length && (
                  <div className="h-12 flex items-center justify-center text-gray-200 text-xs">
                    {/* Sem texto para ficar mais limpo */}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
