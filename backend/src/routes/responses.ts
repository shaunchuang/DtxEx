import { Router } from 'express';
import { ResponseController } from '../controllers/ResponseController';

const router = Router();
const responseController = new ResponseController();

// 填答路由
router.post('/', responseController.submit);
router.get('/:id', responseController.getById);
router.get('/user/:userId', responseController.getByUser);
router.put('/:id', responseController.update);

export default router;
