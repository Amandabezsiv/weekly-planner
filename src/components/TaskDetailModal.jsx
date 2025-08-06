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
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">{task.title}</h2>
            {task.completed && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                ✓ Concluída
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        <div className="space-y-4">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-1">Descrição</h3>
              <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-md">{task.description}</p>
            </div>
          )}

          {task.day && (
            <div className={`p-4 rounded-md ${task.completed ? 'bg-green-50' : 'bg-blue-50'}`}>
              <h3
                className={`text-sm font-medium mb-2 ${task.completed ? 'text-green-800' : 'text-blue-800'}`}
              >
                Agendamento
              </h3>
              <div
                className={`space-y-1 text-sm ${task.completed ? 'text-green-700' : 'text-blue-700'}`}
              >
                <p>
                  <strong>Dia:</strong> {task.day}
                </p>
                <p>
                  <strong>Horário:</strong> {formatTime(task.startHour)} -{' '}
                  {formatTime(task.startHour + task.duration)}
                </p>
                <p>
                  <strong>Duração:</strong> {task.duration} {task.duration === 1 ? 'hora' : 'horas'}
                </p>
              </div>
            </div>
          )}

          {!task.day && !task.isTemporary && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                Esta tarefa ainda não foi agendada. Arraste-a para um horário no calendário ou use o
                botão "Editar" para definir um horário.
              </p>
            </div>
          )}
        </div>

        {showDeleteConfirm ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
            <p className="text-sm text-red-800 mb-3">
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-400 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pt-6">
            <div className="flex gap-3">
              <button
                onClick={handleEdit}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>✏️</span>
                Editar
              </button>
              {task.completed ? (
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>↩️</span>
                  Reabrir
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <span>✓</span>
                  Concluir
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <span>🗑️</span>
                Excluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
