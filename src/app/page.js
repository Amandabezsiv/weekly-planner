"use client";

import DayColumn from '@/components/DayColumn';
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

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, day: newDay } : task
      )
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <main className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6 bg-gray-100 min-h-screen">
        {days.map(day => {
          const tasksForDay = tasks.filter(task => task.day === day)
          return <DayColumn key={day} day={day} tasks={tasksForDay} />;
        })}
      </main>
    </DndContext>
  );
}
    