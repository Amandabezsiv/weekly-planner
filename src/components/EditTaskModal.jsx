'use client';

import { useState, useEffect } from 'react';

export default function EditTaskModal({ task, isOpen, onClose, onSave, weekDays }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day: '',
    startHour: 9,
    duration: 1,
  });

  // Update form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        day: task.day || '',
        startHour: task.startHour || 9,
        duration: task.duration || 1,
      });
    }
  }, [task]);

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor, adicione um título para a tarefa');
      return;
    }
    if (!formData.day) {
      alert('Por favor, selecione um dia');
      return;
    }

    onSave(task.id, formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{color: '#748DAE'}}>Editar Tarefa</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-pink-500 text-2xl transition-colors duration-200 hover:scale-110 transform">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#748DAE'}}>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="Ex: Reunião de equipe"
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
              style={{borderColor: '#F5CBCB', border: '2px solid'}}
              autoFocus
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#748DAE'}}>Descrição</label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Adicione uma descrição opcional..."
              rows={3}
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200 resize-none"
              style={{borderColor: '#F5CBCB', border: '2px solid'}}
            />
          </div>

          {/* Dia */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#748DAE'}}>Dia *</label>
            <select
              value={formData.day}
              onChange={e => handleChange('day', e.target.value)}
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
              style={{borderColor: '#F5CBCB', border: '2px solid'}}
            >
              <option value="">Selecione um dia</option>
              {weekDays.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          {/* Horário e Duração */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#748DAE'}}>Hora de Início</label>
              <select
                value={formData.startHour}
                onChange={e => handleChange('startHour', parseInt(e.target.value))}
                className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
                style={{borderColor: '#F5CBCB', border: '2px solid'}}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {String(i).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#748DAE'}}>
                Duração (horas)
              </label>
              <select
                value={formData.duration}
                onChange={e => handleChange('duration', parseInt(e.target.value))}
                className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
                style={{borderColor: '#F5CBCB', border: '2px solid'}}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map(duration => (
                  <option key={duration} value={duration}>
                    {duration} {duration === 1 ? 'hora' : 'horas'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Horário de término (calculado) */}
          {formData.startHour !== '' && formData.duration && (
            <div className="p-4 rounded-2xl" style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB', border: '1px solid'}}>
              <p className="text-sm font-medium" style={{color: '#748DAE'}}>
                <strong>Horário:</strong> {String(formData.startHour).padStart(2, '0')}:00 -{' '}
                {String(formData.startHour + formData.duration).padStart(2, '0')}:00
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105"
              style={{backgroundColor: '#9ECAD6'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#8bb8c4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#9ECAD6'}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105 shadow-lg"
              style={{backgroundColor: '#748DAE'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6a7ba8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#748DAE'}
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
