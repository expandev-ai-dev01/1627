/**
 * @api {post} /api/v1/internal/task Create Task
 * @apiName CreateTask
 * @apiGroup Task
 * @apiVersion 1.0.0
 *
 * @apiDescription Creates a new task with the specified parameters
 *
 * @apiParam {Number} idAccount Account identifier
 * @apiParam {Number} idUser User identifier
 * @apiParam {String} title Task title (max 100 characters)
 * @apiParam {String} [description] Task description (max 500 characters)
 * @apiParam {Number} [priority] Task priority (0=Low, 1=Medium, 2=High)
 * @apiParam {String} [dueDate] Task due date (ISO format)
 *
 * @apiSuccess {Number} idTask Task identifier
 *
 * @apiError {String} titleRequired Title is required
 * @apiError {String} titleExceedsMaxLength Title exceeds maximum length
 * @apiError {String} titleAlreadyExists Title already exists for this user
 * @apiError {String} invalidPriority Invalid priority value
 * @apiError {String} dueDateInPast Due date cannot be in the past
 */

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { successResponse, errorResponse } from '@/utils/response';
import { zFK, zString, zNullableString, zNullableDateString } from '@/utils/zodValidation';
import { taskCreate, taskList, taskGet, taskUpdate, taskDelete } from '@/services/task';
import { HTTP_STATUS } from '@/constants/http';

const createBodySchema = z.object({
  idAccount: zFK,
  idUser: zFK,
  title: zString(100),
  description: zNullableString(500).optional(),
  priority: z.number().int().min(0).max(2).optional(),
  dueDate: zNullableDateString.optional(),
});

const listQuerySchema = z.object({
  idAccount: z.coerce.number().int().positive(),
  idUser: z.coerce.number().int().positive(),
  status: z.coerce.number().int().min(0).max(1).optional(),
  priority: z.coerce.number().int().min(0).max(2).optional(),
});

const getParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const getQuerySchema = z.object({
  idAccount: z.coerce.number().int().positive(),
  idUser: z.coerce.number().int().positive(),
});

const updateParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const updateBodySchema = z.object({
  idAccount: zFK,
  idUser: zFK,
  title: zString(100),
  description: zNullableString(500).optional(),
  priority: z.number().int().min(0).max(2),
  dueDate: zNullableDateString.optional(),
  status: z.number().int().min(0).max(1),
});

const deleteParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const deleteQuerySchema = z.object({
  idAccount: z.coerce.number().int().positive(),
  idUser: z.coerce.number().int().positive(),
});

export async function postHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const validated = createBodySchema.parse(req.body);

    const data = await taskCreate({
      idAccount: validated.idAccount,
      idUser: validated.idUser,
      title: validated.title,
      description: validated.description ?? undefined,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
    });

    res.status(HTTP_STATUS.CREATED).json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.number === 51000) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

export async function getListHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validated = listQuerySchema.parse(req.query);

    const data = await taskList({
      idAccount: validated.idAccount,
      idUser: validated.idUser,
      status: validated.status,
      priority: validated.priority,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.number === 51000) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = getParamsSchema.parse(req.params);
    const query = getQuerySchema.parse(req.query);

    const data = await taskGet({
      idAccount: query.idAccount,
      idUser: query.idUser,
      idTask: params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.number === 51000) {
      res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

export async function putHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const params = updateParamsSchema.parse(req.params);
    const validated = updateBodySchema.parse(req.body);

    const data = await taskUpdate({
      idAccount: validated.idAccount,
      idUser: validated.idUser,
      idTask: params.id,
      title: validated.title,
      description: validated.description ?? undefined,
      priority: validated.priority,
      dueDate: validated.dueDate ? new Date(validated.dueDate) : undefined,
      status: validated.status,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.number === 51000) {
      res.status(HTTP_STATUS.BAD_REQUEST).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}

export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const params = deleteParamsSchema.parse(req.params);
    const query = deleteQuerySchema.parse(req.query);

    const data = await taskDelete({
      idAccount: query.idAccount,
      idUser: query.idUser,
      idTask: params.id,
    });

    res.json(successResponse(data));
  } catch (error: any) {
    if (error.name === 'ZodError') {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json(errorResponse('Validation failed', 'VALIDATION_ERROR', error.errors));
    } else if (error.number === 51000) {
      res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
}
