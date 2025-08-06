import TaskCard from '@/components/TaskCard';
import { useDroppable } from '@dnd-kit/core';


export default function DayColumn({ day, tasks }) {
  const { setNodeRef, isOver } = useDroppable({
    id: day, // usamos o nome do dia como id da área de drop
  });
  return (
    <div ref={setNodeRef} className={`bg-white p-3 rounded shadow min-h-[150px] ${isOver ? 'ring-2 ring-blue-500' : ''}`}>
      <h2 className="font-semibold capitalize mb-2">{day}</h2>

      
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
