'use client';

import { useState } from 'react';
import CalendarIcon from './CalendarIcon';
import StarIcon from './StarIcon';

export default function TaskModal({ isOpen, onClose, onSave, weekDays }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    day: '',
    startHour: 9,
    duration: 1,
  });

  const handleSubmit = e => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please add a title for the task');
      return;
    }
    if (!formData.day) {
      alert('Please select a day');
      return;
    }

    onSave(formData);
    setFormData({
      title: '',
      description: '',
      day: '',
      startHour: 9,
      duration: 1,
    });
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2" style={{color: '#748DAE'}}>
            <StarIcon className="w-6 h-6" /> New Task
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-pink-500 text-2xl transition-colors duration-200 hover:scale-110 transform"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-1" style={{color: '#748DAE'}}>
              🎯 Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder="e.g: Team meeting"
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
              style={{borderColor: '#F5CBCB', border: '2px solid', focusRingColor: '#9ECAD6'}}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-1" style={{color: '#748DAE'}}>
              📝 Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Add a lovely description... 💫"
              rows={3}
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200 resize-none"
              style={{borderColor: '#F5CBCB', border: '2px solid'}}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-1" style={{color: '#748DAE'}}>
              <CalendarIcon className="w-4 h-4" /> Day *
            </label>
            <select
              value={formData.day}
              onChange={e => handleChange('day', e.target.value)}
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
              style={{borderColor: '#F5CBCB', border: '2px solid'}}
            >
              <option value="">Select a day</option>
              {weekDays.map(day => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-1" style={{color: '#748DAE'}}>
              🕒 Start Time
            </label>
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
            <label className="block text-sm font-semibold mb-2 flex items-center gap-1" style={{color: '#748DAE'}}>
              ⏰ Duration (hours)
            </label>
            <select
              value={formData.duration}
              onChange={e => handleChange('duration', parseInt(e.target.value))}
              className="w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 bg-white transition-all duration-200"
              style={{borderColor: '#F5CBCB', border: '2px solid'}}
            >
              {Array.from({ length: 8 }, (_, i) => i + 1).map(duration => (
                <option key={duration} value={duration}>
                  {duration} {duration === 1 ? 'hour' : 'hours'}
                </option>
              ))}
            </select>
          </div>

          {formData.startHour !== '' && formData.duration && (
            <div className="p-4 rounded-2xl" style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB', border: '1px solid'}}>
              <p className="text-sm font-medium flex items-center gap-2" style={{color: '#748DAE'}}>
                <span className="text-lg">⏰</span>
                <strong>Schedule:</strong> {String(formData.startHour).padStart(2, '0')}:00 -{' '}
                {String(formData.startHour + formData.duration).padStart(2, '0')}:00
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105"
              style={{backgroundColor: '#9ECAD6'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#8bb8c4'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#9ECAD6'}
            >
              💔 Cancel
            </button>
            <button
              type="submit"
              className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              style={{backgroundColor: '#748DAE'}}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#6a7ba8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#748DAE'}
            >
              <StarIcon className="w-4 h-4" /> Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
