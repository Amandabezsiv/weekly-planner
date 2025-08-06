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
  return (
    <div className="bg-white rounded shadow p-2 min-h-full">
      <h3 className="text-center font-bold capitalize mb-2">{day}</h3>
      {hours.map(hour => {
        const droppableId = `${day}-${hour}`; // ex: "Monday - 05/08-9"
        const { setNodeRef, isOver } = useDroppable({ id: droppableId });

        const tasksStartingThisHour = tasks.filter(task => task.startHour === hour);

        const isOccupied = tasks.some(
          task => hour >= task.startHour && hour < task.startHour + task.duration
        );

        return (
          <div
            key={hour}
            ref={setNodeRef}
            className={`border-b h-24 p-2 relative rounded transition-colors ${
              isOver ? 'bg-blue-100 border-blue-300' : isOccupied ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="text-sm text-gray-500 mb-1">{formatHour(hour)}</div>

            {tasksStartingThisHour.map(task => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}

            {tasks
              .filter(task => hour > task.startHour && hour < task.startHour + task.duration)
              .map(task => (
                <div
                  key={`${task.id}-continuation`}
                  className="absolute inset-x-2 top-8 bottom-2 bg-blue-50 border-l-2 border-blue-300 rounded-r opacity-50"
                >
                  <div className="text-xs text-blue-600 p-1 font-medium">
                    {task.title} (continuing...)
                  </div>
                </div>
              ))}
          </div>
        );
      })}
    </div>
  );
}
