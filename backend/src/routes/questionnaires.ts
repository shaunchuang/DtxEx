import { Router } from 'express';
import { QuestionnaireController } from '../controllers/QuestionnaireController';

const router = Router();
const questionnaireController = new QuestionnaireController();

// 問卷路由
router.get('/', questionnaireController.getAll);
router.get('/:id', questionnaireController.getById);
router.post('/', questionnaireController.create);
router.put('/:id', questionnaireController.update);
router.delete('/:id', questionnaireController.delete);

export default router;
