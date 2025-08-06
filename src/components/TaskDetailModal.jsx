'use client';

import { useState } from 'react';

export default function TaskDetailModal({ task, isOpen, onClose, onEdit, onDelete, onComplete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !task) return null;

  const formatTime = hour => {
    return `${String(hour).padStart(2, '0')}:00`;
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleComplete = () => {
    onComplete(task.id);
    onClose();
  };

  const handleEdit = () => {
    onEdit(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl" style={{borderColor: '#F5CBCB', border: '1px solid'}}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold" style={{color: '#748DAE'}}>{task.title}</h2>
            {task.completed && (
              <span className="text-xs px-3 py-1 rounded-full" style={{backgroundColor: '#9ECAD6', color: 'white'}}>
                ✓ Completed
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-pink-500 text-2xl transition-colors duration-200 hover:scale-110 transform">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {task.description && (
            <div>
              <h3 className="text-sm font-semibold mb-2" style={{color: '#748DAE'}}>Description</h3>
              <p className="text-sm p-4 rounded-2xl" style={{color: '#748DAE', backgroundColor: '#FFEAEA', borderColor: '#F5CBCB', border: '1px solid'}}>{task.description}</p>
            </div>
          )}

          {task.day && (
            <div className={`p-4 rounded-2xl`} style={{backgroundColor: task.completed ? '#9ECAD6' : '#FFEAEA', borderColor: '#F5CBCB', border: '1px solid'}}>
              <h3
                className={`text-sm font-semibold mb-3`}
                style={{color: task.completed ? 'white' : '#748DAE'}}
              >
                Schedule
              </h3>
              <div
                className={`space-y-2 text-sm`}
                style={{color: task.completed ? 'white' : '#748DAE'}}
              >
                <p>
                  <strong>Day:</strong> {task.day}
                </p>
                <p>
                  <strong>Schedule:</strong> {formatTime(task.startHour)} -{' '}
                  {formatTime(task.startHour + task.duration)}
                </p>
                <p>
                  <strong>Duration:</strong> {task.duration} {task.duration === 1 ? 'hour' : 'hours'}
                </p>
              </div>
            </div>
          )}

          {!task.day && !task.isTemporary && (
            <div className="p-4 rounded-2xl" style={{backgroundColor: '#FFEAEA', borderColor: '#F5CBCB', border: '1px solid'}}>
              <p className="text-sm" style={{color: '#748DAE'}}>
                This task is not scheduled yet. Drag it to a time slot in the calendar or use the
                "Edit" button to set a schedule.
              </p>
            </div>
          )}
        </div>

        {showDeleteConfirm ? (
          <div className="p-4 rounded-2xl mt-6" style={{backgroundColor: '#F5CBCB', borderColor: '#F5CBCB', border: '1px solid'}}>
            <p className="text-sm mb-4" style={{color: '#748DAE'}}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 text-white py-3 px-4 rounded-2xl text-sm transition-all duration-200 font-medium transform hover:scale-105"
                style={{backgroundColor: '#9ECAD6'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#8bb8c4'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#9ECAD6'}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-2xl text-sm transition-all duration-200 font-medium transform hover:scale-105"
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-6">
            <div className="flex gap-4">
              <button
                onClick={handleEdit}
                className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                style={{backgroundColor: '#748DAE'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#6a7ba8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#748DAE'}
              >
                <span>✏️</span>
                Edit
              </button>
              {task.completed ? (
                <button
                  onClick={handleComplete}
                  className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                  style={{backgroundColor: '#9ECAD6'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#8bb8c4'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#9ECAD6'}
                >
                  <span>↩️</span>
                  Reopen
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                  style={{backgroundColor: '#9ECAD6'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#8bb8c4'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#9ECAD6'}
                >
                  <span>✓</span>
                  Complete
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105"
                style={{backgroundColor: '#F5CBCB'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f1b8b8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#F5CBCB'}
              >
                Close
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white py-3 px-6 rounded-2xl transition-all duration-200 font-medium transform hover:scale-105 flex items-center justify-center gap-2"
                onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
              >
                <span>🗑️</span>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
