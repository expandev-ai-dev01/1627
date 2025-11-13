import { useState } from 'react';
import type { QuickTaskFormProps } from './types';

export const QuickTaskForm = (props: QuickTaskFormProps) => {
  const { onSubmit, isSubmitting = false } = props;
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('O título da tarefa é obrigatório');
      return;
    }

    if (title.length > 100) {
      setError('O título não pode ter mais de 100 caracteres');
      return;
    }

    setError('');
    onSubmit(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Digite o título da tarefa e pressione Enter"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Criando...' : 'Adicionar'}
      </button>
    </form>
  );
};
