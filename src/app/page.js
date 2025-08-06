'use client';

import DayColumn from '@/components/DayColumn';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import TaskDetailModal from '@/components/TaskDetailModal';
import EditTaskModal from '@/components/EditTaskModal';
import { initialTasks } from '@/utils/data';
import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';

const week = getCurrentWeek();

function getCurrentWeek() {
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dayName = daysEn[date.getDay()];
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

    return {
      dayName, // 'Monday'
      date: formattedDate, // '05/08'
      fullDate: date,
    };
  });
}

function hasConflict(existingTasks, newStart, newDuration) {
  return existingTasks.some(task => {
    const start = task.startHour;
    const end = start + task.duration;
    const newEnd = newStart + newDuration;
    return newStart < end && newEnd > start;
  });
}

export default function Home() {
  const [tasks, setTasks] = useState(initialTasks);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);

  // Get week days for the modal
  const weekDays = week.map(({ dayName, date }) => `${dayName} - ${date}`);

  function openTaskModal() {
    setIsModalOpen(true);
  }

  function closeTaskModal() {
    setIsModalOpen(false);
  }

  function handleTaskClick(task) {
    setSelectedTask(task);
    setIsDetailModalOpen(true);
  }

  function closeDetailModal() {
    setIsDetailModalOpen(false);
    setSelectedTask(null);
  }

  function handleEditTask(task) {
    setTaskToEdit(task);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  }

  function handleSaveEditedTask(taskId, formData) {
    const existingTasks = tasks.filter(t => t.day === formData.day && t.id !== taskId);

    if (hasConflict(existingTasks, formData.startHour, formData.duration)) {
      alert(`Conflito de horário! Já existe uma tarefa neste período.`);
      return;
    }

    if (formData.startHour + formData.duration > 24) {
      alert(`Esta tarefa não pode ser salva pois se estenderia além de 23:59.`);
      return;
    }

    setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, ...formData } : task)));
  }

  function handleDeleteTask(taskId) {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  }

  function handleCompleteTask(taskId) {
    setTasks(prev =>
      prev.map(task => (task.id === taskId ? { ...task, completed: !task.completed } : task))
    );
  }

  function handleSaveTask(formData) {
    // Check for conflicts before saving
    const existingTasks = tasks.filter(t => t.day === formData.day);

    if (hasConflict(existingTasks, formData.startHour, formData.duration)) {
      alert(`Conflito de horário! Já existe uma tarefa neste período.`);
      return;
    }

    if (formData.startHour + formData.duration > 24) {
      alert(`Esta tarefa não pode ser criada pois se estenderia além de 23:59.`);
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      day: formData.day,
      startHour: formData.startHour,
      duration: formData.duration,
    };

    setTasks(prev => [...prev, newTask]);
  }

  function createNewTask() {
    if (isCreatingTask) return; // Prevent multiple new tasks

    setIsCreatingTask(true);
    const newTask = {
      id: 'temp-new-task',
      title: 'Drag me to schedule',
      isTemporary: true,
    };

    // Add temporary task to sidebar
    setTasks(prev => [...prev, newTask]);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      // If dragging a temporary task and dropping outside, remove it
      if (active.id === 'temp-new-task') {
        setTasks(prev => prev.filter(t => t.id !== 'temp-new-task'));
        setIsCreatingTask(false);
      }
      return;
    }

    const taskId = active.id;
    console.log('Drag operation:', { taskId, overId: over.id });

    const parts = over.id.split('-');
    const hour = parts[parts.length - 1];
    const dayParts = parts.slice(0, -1);
    const day = dayParts.join('-');

    const startHour = parseInt(hour, 10);

    console.log('Parsed values:', { day, hour, startHour });

    if (taskId === 'new' || taskId === 'temp-new-task') {
      const duration = 1;
      const existingTasks = tasks.filter(t => t.day === day);

      if (hasConflict(existingTasks, startHour, duration)) {
        alert('Conflito de horário! Escolha um horário diferente.');
        if (taskId === 'temp-new-task') {
          setTasks(prev => prev.filter(t => t.id !== 'temp-new-task'));
          setIsCreatingTask(false);
        }
        return;
      }

      const newTask = {
        id: Date.now().toString(),
        title: taskId === 'temp-new-task' ? 'New Task' : 'New Task',
        day,
        startHour,
        duration,
      };

      if (taskId === 'temp-new-task') {
        setTasks(prev => prev.filter(t => t.id !== 'temp-new-task').concat(newTask));
        setIsCreatingTask(false);
      } else {
        setTasks(prev => [...prev, newTask]);
      }
    } else {
      const taskToMove = tasks.find(t => t.id === taskId);
      if (!taskToMove) return;

      const duration = taskToMove.duration;

      const startHour = parseInt(hour, 10);
      const existingTasks = tasks.filter(t => t.day === day && t.id !== taskId);

      if (hasConflict(existingTasks, startHour, duration)) {
        alert(`Conflict this task have ${duration}h and can't be placed at this time.`);
        return;
      }

      // Check if the task would extend beyond 23:59
      if (startHour + duration > 24) {
        alert(`This task can't be placed at this time as it would extend beyond 23:59.`);
        return;
      }

      setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, day, startHour } : task)));
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex min-h-screen bg-gray-100">
        <aside className="w-64 bg-white shadow-md p-4">
          <h2 className="text-lg font-bold mb-2 text-gray-800">Task Manager</h2>

          {/* Estatísticas */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Total de tarefas:</span>
              <span className="font-semibold">{tasks.filter(t => !t.isTemporary).length}</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600">Concluídas:</span>
              <span className="font-semibold text-green-600">
                {tasks.filter(t => t.completed).length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pendentes:</span>
              <span className="font-semibold text-blue-600">
                {tasks.filter(t => !t.completed && !t.isTemporary).length}
              </span>
            </div>
          </div>

          <button
            onClick={openTaskModal}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md mb-3 transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">+</span>
            Nova Tarefa
          </button>

          <div className="space-y-2 mb-4">
            <button
              onClick={createNewTask}
              disabled={isCreatingTask}
              className={`w-full py-2 px-4 rounded text-sm transition-colors ${
                isCreatingTask
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
              }`}
            >
              {isCreatingTask ? 'Criando...' : '⚡ Tarefa Rápida'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Tarefas não agendadas */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
                Tarefas Não Agendadas
              </h3>

              {/* Show legacy new task card */}
              <TaskCard task={{ id: 'new', title: 'Quick Task' }} onClick={null} />

              {/* Show temporary task */}
              {tasks
                .filter(task => task.isTemporary)
                .map(task => (
                  <TaskCard key={task.id} task={task} onClick={null} />
                ))}

              {/* Show unscheduled tasks (tasks without day property) */}
              {tasks
                .filter(task => !task.day && !task.isTemporary && !task.completed)
                .map(task => (
                  <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                ))}

              {tasks.filter(task => !task.day && !task.isTemporary && !task.completed).length ===
                0 &&
                !tasks.some(task => task.isTemporary) && (
                  <p className="text-sm text-gray-500 italic py-2">Nenhuma tarefa não agendada</p>
                )}
            </div>

            {tasks.some(task => task.completed) && (
              <div>
                <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">
                  Tarefas Concluídas
                </h3>
                {tasks
                  .filter(task => task.completed)
                  .map(task => (
                    <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                  ))}
              </div>
            )}
          </div>
        </aside>

        <div className="flex-1 p-6">
          <div className="mb-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showCompletedTasks}
                onChange={e => setShowCompletedTasks(e.target.checked)}
                className="rounded"
              />
              Mostrar tarefas concluídas
            </label>
          </div>

          <main className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-6 bg-gray-100 min-h-screen">
            {week.map(({ dayName, date }) => {
              const dayString = `${dayName} - ${date}`;
              let tasksForDay = tasks.filter(task => task.day === dayString);

              if (!showCompletedTasks) {
                tasksForDay = tasksForDay.filter(task => !task.completed);
              }

              return (
                <DayColumn
                  key={dayString}
                  day={dayString}
                  tasks={tasksForDay}
                  onTaskClick={handleTaskClick}
                />
              );
            })}
          </main>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeTaskModal}
        onSave={handleSaveTask}
        weekDays={weekDays}
      />

      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onComplete={handleCompleteTask}
      />

      <EditTaskModal
        task={taskToEdit}
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={handleSaveEditedTask}
        weekDays={weekDays}
      />
    </DndContext>
  );
}

<footer className="bg-white shadow-inner py-4">
  <div className="container mx-auto text-center">
    <p className="text-sm text-gray-500">
      &copy; {new Date().getFullYear()} Weekly Planner. All rights reserved.
    </p>
  </div>
</footer>;
