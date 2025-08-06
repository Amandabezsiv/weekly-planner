'use client';

import DayColumn from '@/components/DayColumn';
import TaskCard from '@/components/TaskCard';
import TaskModal from '@/components/TaskModal';
import TaskDetailModal from '@/components/TaskDetailModal';
import EditTaskModal from '@/components/EditTaskModal';
import WeekSelector from '@/components/WeekSelector';
import ClientOnly from '@/components/ClientOnly';
import CalendarIcon from '@/components/CalendarIcon';
import NoteIcon from '@/components/NoteIcon';
import CheckIcon from '@/components/CheckIcon';
import HourIcon from '@/components/HourIcon';
import PinkHeartIcon from '@/components/PinkHeartIcon';
import PencilIcon from '@/components/PencilIcon';
import StarIcon from '@/components/StarIcon';
import FastIcon from '@/components/FastIcon';
import { initialTasks } from '@/utils/data';
import { DndContext } from '@dnd-kit/core';
import { useState, useEffect } from 'react';

function getCurrentWeek(startDate = null) {
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = startDate || new Date();

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dayName = daysEn[date.getDay()];
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(
      date.getMonth() + 1
    ).padStart(2, '0')}`;

    return {
      dayName,
      date: formattedDate,
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
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [currentDate, setCurrentDate] = useState(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setCurrentDate(new Date());
    setIsClient(true);
  }, []);

  // Obter a semana atual baseada na seleção ou data atual
  const week = getCurrentWeek(selectedWeekStart);
  const weekDays = week.map(({ dayName, date }) => `${dayName} - ${date}`);

  const handleWeekChange = (newWeekStart) => {
    setSelectedWeekStart(newWeekStart);
  };

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
      alert(`Schedule conflict! There is already a task in this time period.`);
      return;
    }

    if (formData.startHour + formData.duration > 24) {
      alert(`This task cannot be saved as it would extend beyond 23:59.`);
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
    const existingTasks = tasks.filter(t => t.day === formData.day);

    if (hasConflict(existingTasks, formData.startHour, formData.duration)) {
      alert(`Schedule conflict! There is already a task in this time period.`);
      return;
    }

    if (formData.startHour + formData.duration > 24) {
      alert(`This task cannot be created as it would extend beyond 23:59.`);
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
    if (isCreatingTask) return;

    setIsCreatingTask(true);
    const newTask = {
      id: 'temp-new-task',
      title: 'Drag me to schedule',
      isTemporary: true,
    };

    setTasks(prev => [...prev, newTask]);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) {
      if (active.id === 'temp-new-task') {
        setTasks(prev => prev.filter(t => t.id !== 'temp-new-task'));
        setIsCreatingTask(false);
      }
      return;
    }

    const taskId = active.id;
    const parts = over.id.split('-');
    const hour = parts[parts.length - 1];
    const dayParts = parts.slice(0, -1);
    const day = dayParts.join('-');

    const startHour = parseInt(hour, 10);

    if (taskId === 'new' || taskId === 'temp-new-task') {
      const duration = 1;
      const existingTasks = tasks.filter(t => t.day === day);

      if (hasConflict(existingTasks, startHour, duration)) {
        alert('Schedule conflict! Choose a different time.');
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
      const existingTasks = tasks.filter(t => t.day === day && t.id !== taskId);

      if (hasConflict(existingTasks, startHour, duration)) {
        alert(`Schedule conflict! This task lasts ${duration}h and doesn't fit in this time slot.`);
        return;
      }

      if (startHour + duration > 24) {
        alert(`This task cannot be placed at this time as it would extend beyond 23:59.`);
        return;
      }

      setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, day, startHour } : task)));
    }
  }

  return (
    <ClientOnly>
      <DndContext onDragEnd={handleDragEnd}>
        <div className="min-h-screen" style={{backgroundColor: '#FFEAEA'}}>
        {/* Header fofo */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b" style={{borderColor: '#F5CBCB'}}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold" style={{color: '#748DAE'}}>
                    Weekly Planner
                  </h1>
                  <p className="text-sm" style={{color: '#748DAE'}}>Organize your tasks <StarIcon className="inline w-3 h-3" /></p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm" style={{color: '#748DAE'}}>Today is</div>
                <div className="font-semibold" style={{color: '#748DAE'}}>
                  {currentDate ? currentDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  }) : ''}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-full mx-auto px-4 py-6">
          <div className="flex gap-4">
            {/* Sidebar compacta */}
            <aside className="w-72 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
              <div className="flex items-center gap-2 mb-4">
                <PinkHeartIcon className="w-6 h-6" />
                <h2 className="text-lg font-bold" style={{color: '#748DAE'}}>
                  My Tasks
                </h2>
              </div>

              {/* Estatísticas compactas */}
              <div className="rounded-xl p-3 mb-4" style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB', border: '1px solid'}}>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/80 rounded-lg p-2">
                    <div className="flex justify-center mb-1">
                      <NoteIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold" style={{color: '#748DAE'}}>
                      {tasks.filter(t => !t.isTemporary).length}
                    </div>
                    <div className="text-xs" style={{color: '#748DAE'}}>Total</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2">
                    <div className="flex justify-center mb-1">
                      <CheckIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold" style={{color: '#748DAE'}}>
                      {tasks.filter(t => t.completed).length}
                    </div>
                    <div className="text-xs" style={{color: '#748DAE'}}>Done</div>
                  </div>
                  <div className="bg-white/80 rounded-lg p-2">
                    <div className="flex justify-center mb-1">
                      <HourIcon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold" style={{color: '#748DAE'}}>
                      {tasks.filter(t => !t.completed && !t.isTemporary).length}
                    </div>
                    <div className="text-xs" style={{color: '#748DAE'}}>Pending</div>
                  </div>
                </div>
              </div>

              {/* Botões compactos */}
              <button
                onClick={openTaskModal}
                className="w-full text-white py-2 px-3 rounded-xl mb-2 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
                style={{backgroundColor: '#748DAE'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6a7ba8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#748DAE'}
              >
                <StarIcon className="w-4 h-4" />
                <span className="font-medium">New Task</span>
              </button>

              <button
                onClick={createNewTask}
                disabled={isCreatingTask}
                className={`w-full py-2 px-3 rounded-lg text-xs transition-all duration-200 flex items-center justify-center gap-2 ${
                  isCreatingTask
                    ? 'cursor-not-allowed'
                    : 'bg-white hover:bg-gray-50 border-2 border-dashed hover:border-opacity-75'
                }`}
                style={!isCreatingTask ? {borderColor: '#9ECAD6', color: '#748DAE'} : {backgroundColor: '#F5CBCB', color: '#748DAE'}}
              >
                {isCreatingTask ? (
                  <HourIcon className="w-4 h-4" />
                ) : (
                  <FastIcon className="w-4 h-4" />
                )}
                {isCreatingTask ? 'Creating...' : 'Quick Task'}
              </button>

              {/* Seções de tarefas compactas */}
              <div className="space-y-3 mt-4">
                {/* Tarefas não agendadas */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <NoteIcon className="w-4 h-4" />
                    <h3 className="text-xs font-semibold" style={{color: '#748DAE'}}>Loose Tasks</h3>
                  </div>
                  
                  <TaskCard task={{ id: 'new', title: 'Quick Task' }} onClick={null} />
                  
                  {tasks.filter(task => task.isTemporary).map(task => (
                    <TaskCard key={task.id} task={task} onClick={null} />
                  ))}
                  
                  {tasks.filter(task => !task.day && !task.isTemporary && !task.completed).map(task => (
                    <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                  ))}
                  
                  {tasks.filter(task => !task.day && !task.isTemporary && !task.completed).length === 0 && 
                   !tasks.some(task => task.isTemporary) && (
                    <div className="text-center py-4 rounded-lg border-2 border-dashed" style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB'}}>
                      <div className="text-xl mb-1">🌸</div>
                      <p className="text-xs" style={{color: '#748DAE'}}>All organized!</p>
                    </div>
                  )}
                </div>

                {/* Tarefas concluídas */}
                {tasks.some(task => task.completed) && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CheckIcon className="w-4 h-4" />
                      <h3 className="text-xs font-semibold" style={{color: '#748DAE'}}>Completed</h3>
                    </div>
                    {tasks.filter(task => task.completed).map(task => (
                      <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
                    ))}
                  </div>
                )}
              </div>
            </aside>

            {/* Área principal do calendário - layout retangular */}
            <div className="flex-1 min-w-0">
              {/* Controles com seletor de semana */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-4 shadow-sm relative z-20 overflow-visible" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <WeekSelector 
                    currentWeek={week} 
                    onWeekChange={handleWeekChange}
                  />
                  
                  <div className="flex items-center gap-4">
                    <span className="text-xs hidden sm:block" style={{color: '#748DAE'}}>
                      Drag and organize your tasks <StarIcon className="inline w-3 h-3" />
                    </span>
                    
                    <label className="flex items-center gap-2 text-xs bg-white px-3 py-2 rounded-lg border transition-colors cursor-pointer" style={{color: '#748DAE', borderColor: '#9ECAD6'}}>
                      <input
                        type="checkbox"
                        checked={showCompletedTasks}
                        onChange={e => setShowCompletedTasks(e.target.checked)}
                        className="rounded text-pink-500 focus:ring-pink-200"
                        style={{borderColor: '#F5CBCB'}}
                      />
                      <span>Show completed</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Grid do calendário retangular */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-3" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
                <main className="grid grid-cols-7 gap-2 min-h-[600px]">
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
          </div>
        </div>

        {/* Footer fofo */}
        <footer className="bg-white/60 backdrop-blur-sm mt-8" style={{borderColor: '#F5CBCB', borderTop: '1px solid'}}>
          <div className="max-w-7xl mx-auto px-4 py-4 text-center">
            <p className="text-sm flex items-center justify-center gap-2" style={{color: '#748DAE'}}>
              <span>Made with</span>
              <span className="text-pink-500">💕</span>
              <span>by Amanda</span>
              <span className="mx-2">•</span>
              <span>&copy; {currentDate ? currentDate.getFullYear() : new Date().getFullYear()}</span>
            </p>
          </div>
        </footer>
      </div>

      {/* Modais */}
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
    </ClientOnly>
  );
}
