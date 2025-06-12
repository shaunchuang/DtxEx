# 動態醫療量表問卷系統

## 系統概述

本系統是一個「Google 表單等級」的動態醫療量表問卷系統，支援多種題型、問卷區段、以及使用者填答紀錄的儲存與後續編輯。

## 技術架構

- **前端**: Next.js 14 (React, TypeScript, Tailwind CSS)
- **後端**: Express.js (Node.js, TypeScript)
- **資料庫**: MariaDB
- **ORM**: Sequelize

## 核心功能

### 支援題型
- 文字輸入（簡答）
- 單選題
- 複選題
- 量表題（1-5分、1-7分等）
- 段落（純文字內容顯示）
- 日期輸入

### 系統特色
- 多區段問卷設計
- 動態問卷結構配置
- 使用者填答記錄保存
- 支援填答後編輯
- 高度正規化的資料庫設計
- RESTful API 設計

## 資料庫設計

### 主要資料表
1. **Questionnaire** - 問卷基本資訊
2. **Section** - 問卷區段
3. **Question** - 題目定義
4. **QuestionOption** - 題目選項
5. **User** - 使用者資訊
6. **Response** - 填答紀錄
7. **Answer** - 答案內容
8. **AnswerOption** - 選擇題答案

## 快速開始

### 環境需求
- Node.js 18+
- MariaDB 10.6+
- npm 或 yarn

### 安裝步驟

1. **安裝所有依賴**
```bash
npm run install:all
```

2. **設定資料庫**
```bash
# 建立 MariaDB 資料庫
mysql -u root -p
CREATE DATABASE medical_questionnaire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 設定環境變數（編輯 backend/.env）
cp backend/.env.example backend/.env
# 修改資料庫連線設定
```

3. **執行資料庫遷移和種子資料**
```bash
npm run setup:db
```

4. **啟動開發環境**
```bash
# 同時啟動前後端
npm run dev

# 或分別啟動
npm run dev:frontend  # 前端: http://localhost:3000
npm run dev:backend   # 後端: http://localhost:3001
```

5. **測試 API 連線**
```bash
npm run test:api
```

## 系統預覽

### 主要頁面
- **首頁**: 問卷列表和統計資訊
- **問卷填寫**: 動態表單渲染和驗證
- **管理後台**: 問卷建立和管理

### 支援的題型
- **文字輸入**: 簡答題、長文本
- **選擇題**: 單選、複選
- **量表題**: 1-5分、1-7分等評分
- **日期題**: 日期選擇器
- **段落**: 純文字內容顯示

### 核心特色
- 📱 **響應式設計**: 支援桌面和行動裝置
- 🎨 **現代化 UI**: 使用 Tailwind CSS 精美設計
- ⚡ **即時驗證**: 表單即時錯誤提示
- 🔄 **狀態管理**: React Query 最佳化資料管理
- 🛡️ **型別安全**: 全面 TypeScript 支援
- 🗄️ **關聯式設計**: 高度正規化資料庫架構

## 專案結構

```
├── frontend/          # Next.js 前端
│   ├── src/
│   │   ├── app/          # Next.js 13+ App Router 頁面
│   │   ├── components/   # React 元件
│   │   ├── hooks/        # 自定義 Hooks
│   │   ├── services/     # API 服務
│   │   ├── types/        # TypeScript 型別
│   │   ├── utils/        # 工具函數
│   │   └── styles/       # 樣式檔案
│   └── package.json
├── backend/           # Express.js 後端
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 資料模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中介軟體
│   │   ├── services/     # 業務邏輯
│   │   ├── types/        # TypeScript 型別
│   │   └── utils/        # 工具函數
│   ├── migrations/       # 資料庫遷移
│   ├── seeders/         # 測試資料
│   ├── scripts/         # 資料庫設定腳本
│   └── package.json
└── docs/              # 文件
```

## API 文件

### 問卷管理
- `GET /api/questionnaires` - 取得問卷列表
- `POST /api/questionnaires` - 建立問卷
- `GET /api/questionnaires/:id` - 取得問卷詳情
- `PUT /api/questionnaires/:id` - 更新問卷
- `DELETE /api/questionnaires/:id` - 刪除問卷

### 填答管理
- `POST /api/responses` - 提交問卷回答
- `GET /api/responses/:id` - 取得填答記錄
- `PUT /api/responses/:id` - 更新填答記錄

## 開發指南

### 新增題型
1. 在 `QuestionType` 枚舉中新增類型
2. 在前端新增對應的元件
3. 在後端新增驗證邏輯

### 資料庫遷移
```bash
cd backend
npm run db:create-migration -- --name migration-name
npm run db:migrate
```

## 部署

### 生產環境建置
```bash
npm run build
npm start
```

## 授權

MIT License