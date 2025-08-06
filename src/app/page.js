"use client";

import DayColumn from '@/components/DayColumn';
import TaskCard from '@/components/TaskCard';
import { initialTasks } from '@/utils/data';
import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newDay = over.id;

    if (taskId === 'new') {
      // Criar uma nova tarefa a partir do modelo "solto"
      const novaTarefa = {
        id: Date.now().toString(),
        title: 'Nova tarefa',
        day: newDay,
      };
      setTasks(prev => [...prev, novaTarefa]);
    } else {
      // Mover tarefa existente para outro dia
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, day: newDay } : task
        )
      );
    }
  }


  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md p-4">
          <button className="w-full bg-blue-500 text-white py-2 px-4 rounded">
            Add Task
          </button>
          <TaskCard task={{ id: "new", title: "New Task" }} onClick={() => {}} />
        </aside>

        <div className="flex-1 p-6">
          <main className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6 bg-gray-100 min-h-screen">
            {days.map(day => {
              const tasksForDay = tasks.filter(task => task.day === day)
              return <DayColumn key={day} day={day} tasks={tasksForDay} />;
            })}
          </main>
        </div>
      </div>
    </DndContext>
  );
}

      

    