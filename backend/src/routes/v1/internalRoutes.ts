import { Router } from 'express';
import * as taskController from '@/api/v1/internal/task/controller';

const router = Router();

// Task routes - /api/v1/internal/task
router.post('/task', taskController.postHandler);
router.get('/task', taskController.getListHandler);
router.get('/task/:id', taskController.getHandler);
router.put('/task/:id', taskController.putHandler);
router.delete('/task/:id', taskController.deleteHandler);

export default router;
