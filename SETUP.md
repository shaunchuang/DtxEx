# 動態醫療量表問卷系統 - 快速啟動指南

## 系統已成功建置！

### 🎉 專案結構已完成：

- ✅ 後端 Express.js + TypeScript + Sequelize
- ✅ 前端 Next.js + React + TypeScript + Tailwind CSS
- ✅ 完整的資料庫設計（8張資料表）
- ✅ RESTful API
- ✅ 響應式 UI 元件
- ✅ 表單驗證和錯誤處理

### 🗄️ 資料庫設定（使用 MariaDB）

請確保已安裝並啟動 MariaDB，然後執行以下步驟：

1. **建立資料庫**：
   ```sql
   CREATE DATABASE medical_questionnaire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **設定環境變數**：
   編輯 `backend/.env` 檔案，調整資料庫連線資訊：
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=medical_questionnaire
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

3. **執行資料庫遷移**：
   ```bash
   cd backend
   npm run db:migrate
   ```

4. **載入測試資料**：
   ```bash
   npm run db:seed
   ```

### 🚀 啟動系統

#### 方法一：同時啟動前後端
```bash
npm run dev
```

#### 方法二：分別啟動
```bash
# 終端機 1 - 啟動後端
cd backend
npm run dev

# 終端機 2 - 啟動前端
cd frontend
npm run dev
```

### 🌐 訪問應用程式

- **前端應用**: http://localhost:3000
- **後端 API**: http://localhost:3001/api
- **API 健康檢查**: http://localhost:3001/api/health

### 📋 主要功能

#### 已實現功能：
1. **問卷管理**
   - 取得問卷列表
   - 查看問卷詳情
   - 建立/編輯/刪除問卷

2. **多種題型支援**
   - 文字輸入
   - 單選題
   - 複選題
   - 量表題（1-5分、1-7分等）
   - 段落顯示
   - 日期輸入

3. **問卷填寫**
   - 動態表單渲染
   - 即時驗證
   - 資料提交

4. **回答管理**
   - 儲存使用者回答
   - 支援編輯已提交的答案
   - 查看填答記錄

#### 資料庫架構：
- `questionnaires` - 問卷基本資訊
- `sections` - 問卷區段
- `questions` - 題目定義
- `question_options` - 題目選項
- `users` - 使用者資訊
- `responses` - 填答紀錄
- `answers` - 答案內容
- `answer_options` - 選擇題答案

### 🔧 開發工具

- **TypeScript** - 型別安全
- **Sequelize** - ORM 資料庫操作
- **React Query** - 資料狀態管理
- **React Hook Form** - 表單處理
- **Tailwind CSS** - UI 樣式
- **Joi** - 資料驗證

### 📖 API 文件

主要端點：
- `GET /api/questionnaires` - 取得問卷列表
- `GET /api/questionnaires/:id` - 取得問卷詳情
- `POST /api/questionnaires` - 建立問卷
- `POST /api/responses` - 提交問卷回答
- `GET /api/responses/:id` - 取得填答記錄
- `PUT /api/responses/:id` - 更新填答記錄

### 🎯 後續開發建議

1. **用戶認證系統**
2. **問卷統計分析**
3. **管理後台介面**
4. **匯出功能（PDF、Excel）**
5. **問卷分享和權限管理**
6. **響應式圖表顯示**

### 🐛 疑難排解

1. **資料庫連線問題**：確認 MariaDB 服務已啟動且連線資訊正確
2. **Port 衝突**：確認 3000 和  3001埠號沒有被其他程式使用
3. **依賴問題**：執行 `npm run install:all` 重新安裝所有依賴

### 📞 技術支援

如有問題，請檢查：
1. Node.js 版本 >= 18
2. MariaDB 版本 >= 10.6
3. 環境變數設定是否正確
4. 資料庫遷移是否成功執行

---

**恭喜！您的動態醫療量表問卷系統已準備就緒！** 🎉
