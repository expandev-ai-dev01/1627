export interface Task {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string | null;
  priority: 0 | 1 | 2;
  dueDate: string | null;
  status: 0 | 1;
  createdAt: string;
}

export interface CreateTaskDto {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  priority?: 0 | 1 | 2;
  dueDate?: string;
}

export interface UpdateTaskDto {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  priority: 0 | 1 | 2;
  dueDate?: string;
  status: 0 | 1;
}

export interface TaskListParams {
  idAccount: number;
  idUser: number;
  status?: 0 | 1;
  priority?: 0 | 1 | 2;
}

export type PriorityLevel = 0 | 1 | 2;
export type TaskStatus = 0 | 1;

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  0: 'Baixa',
  1: 'Média',
  2: 'Alta',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  0: 'Pendente',
  1: 'Concluída',
};
