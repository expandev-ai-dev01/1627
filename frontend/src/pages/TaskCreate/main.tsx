import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskForm } from '@/domain/task/components/TaskForm';
import { QuickTaskForm } from '@/domain/task/components/QuickTaskForm';
import { useTaskCreate } from '@/domain/task/hooks/useTaskCreate';
import type { CreateTaskDto } from '@/domain/task/types';
import type { TaskCreatePageProps } from './types';

export const TaskCreatePage = (props: TaskCreatePageProps) => {
  const navigate = useNavigate();
  const [showFullForm, setShowFullForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { createTask, isCreating } = useTaskCreate({
    onSuccess: (task) => {
      setSuccessMessage(`Tarefa "${task.title}" criada com sucesso!`);
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/');
      }, 3000);
    },
    onError: (error: Error) => {
      alert(`Erro ao criar tarefa: ${error.message}`);
    },
  });

  const handleQuickSubmit = async (title: string) => {
    const data: CreateTaskDto = {
      idAccount: 1,
      idUser: 1,
      title,
      priority: 1,
    };
    await createTask(data);
  };

  const handleFullSubmit = async (data: CreateTaskDto) => {
    await createTask(data);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl mx-auto">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Nova Tarefa</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Criação Rápida</h3>
          <QuickTaskForm onSubmit={handleQuickSubmit} isSubmitting={isCreating} />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Formulário Completo</h3>
            <button
              onClick={() => setShowFullForm(!showFullForm)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showFullForm ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {showFullForm && (
            <TaskForm
              onSubmit={handleFullSubmit}
              onCancel={handleCancel}
              isSubmitting={isCreating}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCreatePage;
