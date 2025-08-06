'use client';

import { useState } from 'react';
import CalendarIcon from './CalendarIcon';
import StarIcon from './StarIcon';

export default function WeekSelector({ currentWeek, onWeekChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Função para obter o calendário do mês
  const getCalendarData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    // Último dia do mês
    const lastDay = new Date(year, month + 1, 0);
    
    // Quantos dias vazios no início (para alinhar com domingo)
    const startPadding = firstDay.getDay();
    
    // Array de todas as datas do calendário
    const calendarDays = [];
    
    // Dias do mês anterior (cinza)
    for (let i = startPadding - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      calendarDays.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    // Dias do mês atual
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isToday
      });
    }
    
    // Completar com dias do próximo mês para preencher a grade
    const remainingSlots = 42 - calendarDays.length; // 6 semanas x 7 dias
    for (let day = 1; day <= remainingSlots; day++) {
      const nextDate = new Date(year, month + 1, day);
      calendarDays.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false
      });
    }
    
    return calendarDays;
  };

  // Função para obter a semana de uma data
  const getWeekStart = (date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    return weekStart;
  };

  // Função para verificar se uma data está na semana selecionada
  const isInSelectedWeek = (date) => {
    if (!currentWeek || !currentWeek[0]) return false;
    const weekStart = getWeekStart(date);
    const selectedWeekStart = getWeekStart(currentWeek[0].fullDate);
    return weekStart.toDateString() === selectedWeekStart.toDateString();
  };

  const calendarDays = getCalendarData();
  const currentWeekLabel = currentWeek ? 
    `${currentWeek[0].date} - ${currentWeek[6].date}` : 
    'Selecione uma semana';

  const handleDayClick = (date) => {
    const weekStart = getWeekStart(date);
    if (onWeekChange) {
      onWeekChange(weekStart);
    }
    setIsOpen(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="relative z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-200 shadow-sm hover:shadow-md relative z-30"
        style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB'}}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#f5dede'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#FFEAEA'}
      >
        <CalendarIcon className="w-6 h-6" />
        <div className="text-left">
          <h2 className="font-bold text-sm" style={{color: '#748DAE'}}>Semana Selecionada</h2>
          <p className="text-xs font-medium" style={{color: '#748DAE'}}>{currentWeekLabel}</p>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="#748DAE" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl p-4 z-[9999] min-w-[320px] backdrop-blur-sm" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
          {/* Header do calendário */}
          <div className="flex items-center justify-between mb-3">
            <button 
              onClick={goToPreviousMonth}
              className="p-1 rounded-lg transition-colors"
              style={{backgroundColor: '#FFEAEA', color: '#748DAE'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F5CBCB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FFEAEA'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-sm font-bold" style={{color: '#748DAE'}}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button 
              onClick={goToNextMonth}
              className="p-1 rounded-lg transition-colors"
              style={{backgroundColor: '#FFEAEA', color: '#748DAE'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#F5CBCB'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#FFEAEA'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Cabeçalho dos dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium py-1" style={{color: '#748DAE'}}>
                {day}
              </div>
            ))}
          </div>

          {/* Grade do calendário */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const isSelected = isInSelectedWeek(day.date);
              const isCurrentMonth = day.isCurrentMonth;
              const isToday = day.isToday;
              
              return (
                <button
                  key={index}
                  onClick={() => handleDayClick(day.date)}
                  className={`
                    h-8 w-8 text-xs rounded-lg transition-all duration-200 font-medium
                    ${isToday && !isSelected ? 'ring-2 ring-opacity-50' : ''}
                  `}
                  style={{
                    backgroundColor: isSelected 
                      ? '#748DAE' 
                      : isCurrentMonth 
                        ? 'transparent' 
                        : 'transparent',
                    color: isSelected 
                      ? 'white' 
                      : isCurrentMonth 
                        ? '#748DAE' 
                        : '#9ECAD6',
                    ...(isToday && !isSelected && { borderColor: '#F5CBCB' })
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && isCurrentMonth) {
                      e.target.style.backgroundColor = '#F5CBCB';
                      e.target.style.color = '#748DAE';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && isCurrentMonth) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#748DAE';
                    }
                  }}
                >
                  {day.date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Instruções */}
          <div className="mt-3 text-xs text-center flex items-center justify-center gap-2" style={{color: '#748DAE'}}>
            <StarIcon className="w-3 h-3" />
            <span>Clique em qualquer dia para selecionar a semana</span>
          </div>
        </div>
      )}

      {/* Overlay para fechar o dropdown */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9998]" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
