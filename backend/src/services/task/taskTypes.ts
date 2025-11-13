/**
 * @summary
 * Type definitions for task management service
 *
 * @module services/task
 */

/**
 * @interface TaskEntity
 * @description Represents a task entity in the system
 *
 * @property {number} idTask - Unique task identifier
 * @property {number} idAccount - Associated account identifier
 * @property {number} idUser - User identifier who owns the task
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {TaskPriority} priority - Task priority level
 * @property {Date | null} dueDate - Task due date
 * @property {TaskStatus} status - Current task status
 * @property {Date} dateCreated - Creation timestamp
 * @property {Date} dateModified - Last modification timestamp
 */
export interface TaskEntity {
  idTask: number;
  idAccount: number;
  idUser: number;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: Date | null;
  status: TaskStatus;
  dateCreated: Date;
  dateModified: Date;
}

/**
 * @interface TaskCreateRequest
 * @description Request parameters for creating a new task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {string} title - Task title (max 100 characters)
 * @property {string} description - Task description (max 500 characters, optional)
 * @property {TaskPriority} priority - Task priority (defaults to Medium)
 * @property {Date | null} dueDate - Task due date (optional)
 */
export interface TaskCreateRequest {
  idAccount: number;
  idUser: number;
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

/**
 * @interface TaskUpdateRequest
 * @description Request parameters for updating an existing task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idTask - Task identifier
 * @property {string} title - Updated task title
 * @property {string} description - Updated task description
 * @property {TaskPriority} priority - Updated task priority
 * @property {Date | null} dueDate - Updated task due date
 * @property {TaskStatus} status - Updated task status
 */
export interface TaskUpdateRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date | null;
  status: TaskStatus;
}

/**
 * @interface TaskListRequest
 * @description Request parameters for listing tasks
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {TaskStatus | null} status - Filter by status (optional)
 * @property {TaskPriority | null} priority - Filter by priority (optional)
 */
export interface TaskListRequest {
  idAccount: number;
  idUser: number;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
}

/**
 * @interface TaskGetRequest
 * @description Request parameters for retrieving a specific task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskGetRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @interface TaskDeleteRequest
 * @description Request parameters for deleting a task
 *
 * @property {number} idAccount - Account identifier
 * @property {number} idUser - User identifier
 * @property {number} idTask - Task identifier
 */
export interface TaskDeleteRequest {
  idAccount: number;
  idUser: number;
  idTask: number;
}

/**
 * @enum TaskPriority
 * @description Task priority levels
 */
export enum TaskPriority {
  Low = 0,
  Medium = 1,
  High = 2,
}

/**
 * @enum TaskStatus
 * @description Task status values
 */
export enum TaskStatus {
  Pending = 0,
  Completed = 1,
}

/**
 * @interface TaskCreateResult
 * @description Result of task creation operation
 *
 * @property {number} idTask - Created task identifier
 */
export interface TaskCreateResult {
  idTask: number;
}

/**
 * @interface TaskUpdateResult
 * @description Result of task update operation
 *
 * @property {number} idTask - Updated task identifier
 */
export interface TaskUpdateResult {
  idTask: number;
}

/**
 * @interface TaskDeleteResult
 * @description Result of task deletion operation
 *
 * @property {number} idTask - Deleted task identifier
 */
export interface TaskDeleteResult {
  idTask: number;
}
