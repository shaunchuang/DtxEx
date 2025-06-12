import { Router } from 'express';
import questionnaireRoutes from './questionnaires';
import responseRoutes from './responses';

const router = Router();

// API 路由
router.use('/questionnaires', questionnaireRoutes);
router.use('/responses', responseRoutes);

// 健康檢查
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
