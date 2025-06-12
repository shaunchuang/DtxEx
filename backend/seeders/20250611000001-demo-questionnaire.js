'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // 建立測試使用者
    const userId = uuidv4();
    await queryInterface.bulkInsert('users', [{
      id: userId,
      name: '測試使用者',
      email: 'test@example.com',
      createdAt: now,
      updatedAt: now
    }]);

    // 建立測試問卷
    const questionnaireId = uuidv4();
    await queryInterface.bulkInsert('questionnaires', [{
      id: questionnaireId,
      title: '醫療滿意度調查問卷',
      description: '本問卷旨在了解您對醫療服務的滿意程度，請依據您的實際感受填寫。',
      createdAt: now,
      updatedAt: now
    }]);

    // 建立測試區段
    const section1Id = uuidv4();
    const section2Id = uuidv4();
    await queryInterface.bulkInsert('sections', [
      {
        id: section1Id,
        formId: questionnaireId,
        title: '基本資料',
        description: '請填寫您的基本資料',
        order: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: section2Id,
        formId: questionnaireId,
        title: '服務滿意度評估',
        description: '請針對各項服務進行評分',
        order: 2,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // 建立測試題目
    const question1Id = uuidv4();
    const question2Id = uuidv4();
    const question3Id = uuidv4();
    const question4Id = uuidv4();
    const question5Id = uuidv4();
    
    await queryInterface.bulkInsert('questions', [
      {
        id: question1Id,
        sectionId: section1Id,
        questionText: '您的姓名',
        questionType: 'TEXT',
        order: 1,
        isRequired: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: question2Id,
        sectionId: section1Id,
        questionText: '您的性別',
        questionType: 'SINGLE_CHOICE',
        order: 2,
        isRequired: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: question3Id,
        sectionId: section1Id,
        questionText: '就醫日期',
        questionType: 'DATE',
        order: 3,
        isRequired: true,
        createdAt: now,
        updatedAt: now
      },
      {
        id: question4Id,
        sectionId: section2Id,
        questionText: '整體服務滿意度（1-5分）',
        questionType: 'SCALE',
        order: 1,
        isRequired: true,
        description: '1分表示非常不滿意，5分表示非常滿意',
        createdAt: now,
        updatedAt: now
      },
      {
        id: question5Id,
        sectionId: section2Id,
        questionText: '您認為哪些方面需要改善？（可複選）',
        questionType: 'MULTIPLE_CHOICE',
        order: 2,
        isRequired: false,
        createdAt: now,
        updatedAt: now
      }
    ]);

    // 建立選項
    await queryInterface.bulkInsert('question_options', [
      // 性別選項
      {
        id: uuidv4(),
        questionId: question2Id,
        optionText: '男性',
        optionValue: 'male',
        order: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question2Id,
        optionText: '女性',
        optionValue: 'female',
        order: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question2Id,
        optionText: '其他',
        optionValue: 'other',
        order: 3,
        createdAt: now,
        updatedAt: now
      },
      // 滿意度量表選項
      {
        id: uuidv4(),
        questionId: question4Id,
        optionText: '1 - 非常不滿意',
        optionValue: '1',
        order: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question4Id,
        optionText: '2 - 不滿意',
        optionValue: '2',
        order: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question4Id,
        optionText: '3 - 普通',
        optionValue: '3',
        order: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question4Id,
        optionText: '4 - 滿意',
        optionValue: '4',
        order: 4,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question4Id,
        optionText: '5 - 非常滿意',
        optionValue: '5',
        order: 5,
        createdAt: now,
        updatedAt: now
      },
      // 改善項目選項
      {
        id: uuidv4(),
        questionId: question5Id,
        optionText: '等待時間',
        optionValue: 'waiting_time',
        order: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question5Id,
        optionText: '醫護人員態度',
        optionValue: 'staff_attitude',
        order: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question5Id,
        optionText: '環境清潔',
        optionValue: 'cleanliness',
        order: 3,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uuidv4(),
        questionId: question5Id,
        optionText: '服務流程',
        optionValue: 'service_process',
        order: 4,
        createdAt: now,
        updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('question_options', null, {});
    await queryInterface.bulkDelete('questions', null, {});
    await queryInterface.bulkDelete('sections', null, {});
    await queryInterface.bulkDelete('questionnaires', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
