const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function submitTestResponse() {
  try {
    console.log('🧪 提交測試問卷回答...');

    // 獲取問卷列表
    const questionnairesResponse = await axios.get(`${API_BASE}/questionnaires`);
    const questionnaires = questionnairesResponse.data.data;
    
    if (questionnaires.length === 0) {
      console.log('❌ 沒有可用的問卷');
      return;
    }

    const questionnaire = questionnaires[0]; // 使用第一份問卷
    console.log(`📝 使用問卷: "${questionnaire.title}"`);

    // 準備測試回答數據
    const testUsers = [
      { name: '王小明', email: 'wang@example.com' },
      { name: '李小華', email: 'li@example.com' },
      { name: '陳小美', email: 'chen@example.com' }
    ];

    for (let i = 0; i < testUsers.length; i++) {
      const user = testUsers[i];
      
      // 生成用戶 ID
      const userId = `user_${Date.now()}_${i}`;
      
      // 準備答案數據
      const answers = [];
      
      questionnaire.sections.forEach(section => {
        section.questions.forEach(question => {
          const answer = {
            questionId: question.id,
            answerText: null,
            answerDate: null,
            selectedOptions: []
          };

          switch (question.questionType) {
            case 'TEXT':
              answer.answerText = `測試回答 ${i + 1}`;
              break;
            case 'PARAGRAPH':
              answer.answerText = `這是一個詳細的測試回答 ${i + 1}，用於展示段落題型的回答。`;
              break;
            case 'SINGLE_CHOICE':
            case 'SCALE':
              if (question.options.length > 0) {
                // 選擇第一個選項
                answer.selectedOptions = [question.options[0].id];
              }
              break;
            case 'MULTIPLE_CHOICE':
              if (question.options.length > 0) {
                // 選擇前兩個選項（如果有的話）
                answer.selectedOptions = question.options.slice(0, Math.min(2, question.options.length)).map(opt => opt.id);
              }
              break;
            case 'DATE':
              answer.answerDate = new Date().toISOString();
              break;
          }

          answers.push(answer);
        });
      });

      // 提交回答
      const responseData = {
        formId: questionnaire.id,
        userId: userId,
        userName: user.name,
        userEmail: user.email,
        answers: answers
      };

      const submitResponse = await axios.post(`${API_BASE}/responses`, responseData);
      console.log(`✅ 使用者 "${user.name}" 的回答已提交，ID: ${submitResponse.data.data.id}`);
    }

    console.log('\n🎉 所有測試回答提交完成！');
    console.log('\n📝 現在您可以：');
    console.log('   1. 訪問 http://localhost:3000/admin');
    console.log('   2. 在問卷列表中點擊 "檢視填答記錄" 按鈕');
    console.log('   3. 查看剛才提交的測試數據');

  } catch (error) {
    console.error('❌ 提交測試回答時發生錯誤:', error.response?.data || error.message);
  }
}

submitTestResponse();
