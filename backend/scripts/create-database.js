const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  try {
    const dbName = process.env.DB_NAME || 'medical_questionnaire';
    console.log(`🔍 檢查資料庫 "${dbName}" 是否存在...`);
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ 資料庫 "${dbName}" 已準備就緒`);
    
    await connection.end();
    console.log('🔌 資料庫連線已關閉');
  } catch (error) {
    console.error('❌ 建立資料庫時發生錯誤:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 請確認：');
      console.log('   1. MariaDB 服務已啟動');
      console.log('   2. 連接埠 ' + (process.env.DB_PORT || 3306) + ' 正確');
      console.log('   3. 使用者名稱和密碼正確');
    }
    process.exit(1);
  }
}

if (require.main === module) {
  createDatabase();
}

module.exports = createDatabase;
