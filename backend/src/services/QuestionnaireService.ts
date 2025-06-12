import { Questionnaire, Section, Question, QuestionOption, Response, User } from '../models';
import { QuestionType } from '../types';

export class QuestionnaireService {
  /**
   * 建立問卷及其所有相關資料
   */
  async createQuestionnaire(data: {
    title: string;
    description?: string;
    sections: Array<{
      title?: string;
      description?: string;
      order: number;
      questions: Array<{
        questionText: string;
        questionType: QuestionType;
        isRequired: boolean;
        order: number;
        options?: Array<{
          optionText: string;
          optionValue: string;
          order: number;
        }>;
      }>;
    }>;
  }) {
    const questionnaire = await Questionnaire.create({
      title: data.title,
      description: data.description
    });

    for (const sectionData of data.sections) {
      const section = await Section.create({
        formId: questionnaire.id,
        title: sectionData.title,
        description: sectionData.description,
        order: sectionData.order
      });

      for (const questionData of sectionData.questions) {
        const question = await Question.create({
          sectionId: section.id,
          questionText: questionData.questionText,
          questionType: questionData.questionType,
          isRequired: questionData.isRequired,
          order: questionData.order
        });

        if (questionData.options && questionData.options.length > 0) {
          for (const optionData of questionData.options) {
            await QuestionOption.create({
              questionId: question.id,
              optionText: optionData.optionText,
              optionValue: optionData.optionValue,
              order: optionData.order
            });
          }
        }
      }
    }

    return this.getQuestionnaireById(questionnaire.id);
  }

  /**
   * 取得問卷完整資料
   */
  async getQuestionnaireById(id: string) {
    return await Questionnaire.findByPk(id, {
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: Question,
          as: 'questions',
          include: [{
            model: QuestionOption,
            as: 'options'
          }]
        }]
      }],
      order: [
        ['sections', 'order', 'ASC'],
        ['sections', 'questions', 'order', 'ASC'],
        ['sections', 'questions', 'options', 'order', 'ASC']
      ]
    });
  }

  /**
   * 取得所有問卷
   */
  async getAllQuestionnaires() {
    return await Questionnaire.findAll({
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: Question,
          as: 'questions',
          include: [{
            model: QuestionOption,
            as: 'options'
          }]
        }]
      }],
      order: [
        ['createdAt', 'DESC'],
        ['sections', 'order', 'ASC'],
        ['sections', 'questions', 'order', 'ASC'],
        ['sections', 'questions', 'options', 'order', 'ASC']
      ]
    });
  }

  /**
   * 更新問卷
   */
  async updateQuestionnaire(id: string, data: { 
    title?: string; 
    description?: string;
    sections?: Array<{
      id?: string;
      title?: string;
      description?: string;
      order: number;
      questions: Array<{
        id?: string;
        questionText: string;
        questionType: QuestionType;
        isRequired: boolean;
        order: number;
        description?: string;
        options?: Array<{
          id?: string;
          optionText: string;
          optionValue: string;
          order: number;
        }>;
      }>;
    }>;
  }) {
    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      throw new Error('問卷不存在');
    }

    // 更新問卷基本資訊
    await questionnaire.update({
      title: data.title,
      description: data.description
    });

    // 如果有提供區段資料，則進行完整更新
    if (data.sections) {
      // 刪除現有的區段（級聯刪除會自動處理題目和選項）
      await Section.destroy({
        where: { formId: id }
      });

      // 重新建立區段和題目
      for (const sectionData of data.sections) {
        const section = await Section.create({
          formId: questionnaire.id,
          title: sectionData.title,
          description: sectionData.description,
          order: sectionData.order
        });

        for (const questionData of sectionData.questions) {
          const question = await Question.create({
            sectionId: section.id,
            questionText: questionData.questionText,
            questionType: questionData.questionType,
            isRequired: questionData.isRequired,
            order: questionData.order,
            description: questionData.description
          });

          if (questionData.options && questionData.options.length > 0) {
            for (const optionData of questionData.options) {
              await QuestionOption.create({
                questionId: question.id,
                optionText: optionData.optionText,
                optionValue: optionData.optionValue,
                order: optionData.order
              });
            }
          }
        }
      }
    }

    return this.getQuestionnaireById(id);
  }

  /**
   * 刪除問卷
   */
  async deleteQuestionnaire(id: string) {
    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      throw new Error('問卷不存在');
    }

    await questionnaire.destroy();
    return true;
  }

  /**
   * 取得問卷的所有填答記錄
   */
  async getQuestionnaireResponses(questionnaireId: string, options?: {
    limit?: number;
    offset?: number;
  }) {
    const { limit = 10, offset = 0 } = options || {};

    return await Response.findAndCountAll({
      where: {
        formId: questionnaireId
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
  }
}

export const questionnaireService = new QuestionnaireService();
