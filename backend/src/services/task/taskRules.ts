/**
 * @summary
 * Task management business rules and database operations
 *
 * @module services/task
 */

import { getPool } from '@/instances/database';
import {
  TaskCreateRequest,
  TaskUpdateRequest,
  TaskListRequest,
  TaskGetRequest,
  TaskDeleteRequest,
  TaskEntity,
  TaskCreateResult,
  TaskUpdateResult,
  TaskDeleteResult,
} from './taskTypes';

/**
 * @summary
 * Creates a new task in the database
 *
 * @function taskCreate
 * @module services/task
 *
 * @param {TaskCreateRequest} params - Task creation parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {string} params.title - Task title
 * @param {string} [params.description] - Task description (optional)
 * @param {number} [params.priority] - Task priority (optional, defaults to 1)
 * @param {Date | null} [params.dueDate] - Task due date (optional)
 *
 * @returns {Promise<TaskCreateResult>} Created task identifier
 *
 * @throws {Error} When database operation fails
 * @throws {Error} When validation fails (titleRequired, titleExceedsMaxLength, etc.)
 *
 * @example
 * const result = await taskCreate({
 *   idAccount: 1,
 *   idUser: 123,
 *   title: 'Complete project documentation',
 *   description: 'Write comprehensive documentation for the project',
 *   priority: 2,
 *   dueDate: new Date('2024-12-31')
 * });
 */
export async function taskCreate(params: TaskCreateRequest): Promise<TaskCreateResult> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('title', params.title)
    .input('description', params.description || '')
    .input('priority', params.priority ?? 1)
    .input('dueDate', params.dueDate || null)
    .execute('[functional].[spTaskCreate]');

  return result.recordset[0];
}

/**
 * @summary
 * Lists tasks for a specific user with optional filters
 *
 * @function taskList
 * @module services/task
 *
 * @param {TaskListRequest} params - Task listing parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number | null} [params.status] - Filter by status (optional)
 * @param {number | null} [params.priority] - Filter by priority (optional)
 *
 * @returns {Promise<TaskEntity[]>} Array of task entities
 *
 * @throws {Error} When database operation fails
 *
 * @example
 * const tasks = await taskList({
 *   idAccount: 1,
 *   idUser: 123,
 *   status: 0,
 *   priority: 2
 * });
 */
export async function taskList(params: TaskListRequest): Promise<TaskEntity[]> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('status', params.status ?? null)
    .input('priority', params.priority ?? null)
    .execute('[functional].[spTaskList]');

  return result.recordset;
}

/**
 * @summary
 * Retrieves a specific task by ID
 *
 * @function taskGet
 * @module services/task
 *
 * @param {TaskGetRequest} params - Task retrieval parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<TaskEntity>} Task entity
 *
 * @throws {Error} When database operation fails
 * @throws {Error} When task doesn't exist (taskDoesntExist)
 *
 * @example
 * const task = await taskGet({
 *   idAccount: 1,
 *   idUser: 123,
 *   idTask: 456
 * });
 */
export async function taskGet(params: TaskGetRequest): Promise<TaskEntity> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('idTask', params.idTask)
    .execute('[functional].[spTaskGet]');

  return result.recordset[0];
}

/**
 * @summary
 * Updates an existing task
 *
 * @function taskUpdate
 * @module services/task
 *
 * @param {TaskUpdateRequest} params - Task update parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 * @param {string} params.title - Updated task title
 * @param {string} [params.description] - Updated task description
 * @param {number} params.priority - Updated task priority
 * @param {Date | null} [params.dueDate] - Updated task due date
 * @param {number} params.status - Updated task status
 *
 * @returns {Promise<TaskUpdateResult>} Updated task identifier
 *
 * @throws {Error} When database operation fails
 * @throws {Error} When validation fails
 *
 * @example
 * const result = await taskUpdate({
 *   idAccount: 1,
 *   idUser: 123,
 *   idTask: 456,
 *   title: 'Updated task title',
 *   description: 'Updated description',
 *   priority: 1,
 *   dueDate: new Date('2024-12-31'),
 *   status: 0
 * });
 */
export async function taskUpdate(params: TaskUpdateRequest): Promise<TaskUpdateResult> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('idTask', params.idTask)
    .input('title', params.title)
    .input('description', params.description || '')
    .input('priority', params.priority)
    .input('dueDate', params.dueDate || null)
    .input('status', params.status)
    .execute('[functional].[spTaskUpdate]');

  return result.recordset[0];
}

/**
 * @summary
 * Soft deletes a task
 *
 * @function taskDelete
 * @module services/task
 *
 * @param {TaskDeleteRequest} params - Task deletion parameters
 * @param {number} params.idAccount - Account identifier
 * @param {number} params.idUser - User identifier
 * @param {number} params.idTask - Task identifier
 *
 * @returns {Promise<TaskDeleteResult>} Deleted task identifier
 *
 * @throws {Error} When database operation fails
 * @throws {Error} When task doesn't exist (taskDoesntExist)
 *
 * @example
 * const result = await taskDelete({
 *   idAccount: 1,
 *   idUser: 123,
 *   idTask: 456
 * });
 */
export async function taskDelete(params: TaskDeleteRequest): Promise<TaskDeleteResult> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('idAccount', params.idAccount)
    .input('idUser', params.idUser)
    .input('idTask', params.idTask)
    .execute('[functional].[spTaskDelete]');

  return result.recordset[0];
}
