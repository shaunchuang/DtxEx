import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// 載入環境變數
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中介軟體
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API 路由
app.use('/api', routes);

// 錯誤處理
app.use(notFoundHandler);
app.use(errorHandler);

// 啟動伺服器
const startServer = async () => {
  try {
    // 測試資料庫連線
    await sequelize.authenticate();
    console.log('✅ 資料庫連線成功');

    // 同步資料庫模型
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ 資料庫模型同步完成');
    }

    app.listen(PORT, () => {
      console.log(`🚀 伺服器啟動於 http://localhost:${PORT}`);
      console.log(`📖 API 文件: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ 伺服器啟動失敗:', error);
    process.exit(1);
  }
};

// 優雅關閉
process.on('SIGTERM', async () => {
  console.log('🔄 正在關閉伺服器...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 正在關閉伺服器...');
  await sequelize.close();
  process.exit(0);
});

startServer();
