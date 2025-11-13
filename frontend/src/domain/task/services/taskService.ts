import { authenticatedClient } from '@/core/lib/api';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskListParams } from '../types';
import type { ApiResponse } from '@/core/types';

export const taskService = {
  async list(params: TaskListParams): Promise<Task[]> {
    const response = await authenticatedClient.get<ApiResponse<Task[]>>('/task', { params });
    return response.data.data;
  },

  async getById(id: number, idAccount: number, idUser: number): Promise<Task> {
    const response = await authenticatedClient.get<ApiResponse<Task>>(`/task/${id}`, {
      params: { idAccount, idUser },
    });
    return response.data.data;
  },

  async create(data: CreateTaskDto): Promise<Task> {
    const response = await authenticatedClient.post<ApiResponse<Task>>('/task', data);
    return response.data.data;
  },

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const response = await authenticatedClient.put<ApiResponse<Task>>(`/task/${id}`, data);
    return response.data.data;
  },

  async delete(id: number, idAccount: number, idUser: number): Promise<void> {
    await authenticatedClient.delete(`/task/${id}`, {
      params: { idAccount, idUser },
    });
  },
};
