#!/usr/bin/env node

const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 測試 API 連線...\n');
  
  try {
    // 測試健康檢查
    console.log('1. 測試 API 健康檢查...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ API 健康檢查成功:', healthResponse.data.message);
    
    // 測試問卷列表
    console.log('\n2. 測試問卷列表 API...');
    const questionnairesResponse = await axios.get(`${API_BASE}/questionnaires`);
    console.log('✅ 問卷列表 API 成功');
    console.log(`   找到 ${questionnairesResponse.data.data?.length || 0} 份問卷`);
    
    if (questionnairesResponse.data.data && questionnairesResponse.data.data.length > 0) {
      const questionnaire = questionnairesResponse.data.data[0];
      console.log(`   範例問卷: "${questionnaire.title}"`);
    }
    
    console.log('\n🎉 所有 API 測試通過！');
    console.log('\n📝 接下來您可以：');
    console.log('   1. 開啟瀏覽器訪問 http://localhost:3000');
    console.log('   2. 查看問卷列表和填寫問卷');
    console.log('   3. 在管理介面建立新問卷');
    
  } catch (error) {
    console.log('❌ API 測試失敗:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 可能的解決方案：');
      console.log('   1. 確認後端伺服器已啟動 (npm run dev:backend)');
      console.log('   2. 檢查 port 3001 是否被佔用');
      console.log('   3. 確認資料庫連線正常');
    }
  }
}

if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
