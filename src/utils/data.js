function getCurrentWeekDates() {
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();

  // Começamos pelo domingo da semana atual
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);

    const dayName = daysEn[date.getDay()];
    const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

    return `${dayName} - ${formattedDate}`;
  });
}

const weekDates = getCurrentWeekDates();

export const initialTasks = [
  {
    id: '1',
    title: 'Meeting',
    description:
      'Reunião semanal com a equipe para discutir o progresso dos projetos e planejar as próximas atividades.',
    day: weekDates[1], // Monday
    startHour: 9,
    duration: 1,
  },
  {
    id: '2',
    title: 'Study',
    description: 'Sessão de estudos sobre React e Next.js. Focar em hooks e SSR.',
    day: weekDates[2], // Tuesday
    startHour: 10,
    duration: 2,
  },
  {
    id: '3',
    title: 'Workout',
    description: 'Treino de força na academia. Foco em membros superiores.',
    day: weekDates[3], // Wednesday
    startHour: 18,
    duration: 1,
  },
  {
    id: '4',
    title: 'Project Work',
    description:
      'Desenvolvimento do weekly planner. Implementar funcionalidades de drag and drop e criação de tarefas.',
    day: weekDates[4], // Thursday
    startHour: 14,
    duration: 3,
  },
  {
    id: '5',
    title: 'Doctor Appointment',
    description: 'Consulta médica de rotina.',
    // Sem day - tarefa não agendada para demonstrar a funcionalidade
  },
];
