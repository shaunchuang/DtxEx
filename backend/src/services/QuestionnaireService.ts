import { Questionnaire, Section, Question, QuestionOption } from '../models';
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
        questionnaireId: questionnaire.id,
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
  async updateQuestionnaire(id: string, data: { title?: string; description?: string }) {
    const questionnaire = await Questionnaire.findByPk(id);
    if (!questionnaire) {
      throw new Error('問卷不存在');
    }

    await questionnaire.update(data);
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
}

export const questionnaireService = new QuestionnaireService();
