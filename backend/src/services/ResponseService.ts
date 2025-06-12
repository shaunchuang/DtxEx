import { Response as ResponseModel, Answer, AnswerOption, User, Questionnaire } from '../models';
import { ResponseStatus } from '../types';

export class ResponseService {
  /**
   * 提交問卷回答
   */
  async submitResponse(data: {
    formId: string;
    userId: string;
    userName?: string;
    userEmail?: string;
    answers: Array<{
      questionId: string;
      answerText?: string;
      answerDate?: string;
      selectedOptions?: string[];
    }>;
  }) {
    // 檢查問卷是否存在
    const questionnaire = await Questionnaire.findByPk(data.formId);
    if (!questionnaire) {
      throw new Error('問卷不存在');
    }

    // 建立或取得使用者
    let user = await User.findByPk(data.userId);
    if (!user) {
      user = await User.create({
        id: data.userId,
        name: data.userName || 'Anonymous',
        email: data.userEmail || `user_${data.userId}@example.com`
      });
    }

    // 建立回答記錄
    const response = await ResponseModel.create({
      formId: data.formId,
      userId: data.userId,
      status: ResponseStatus.COMPLETED,
      submitTime: new Date()
    });

    // 處理每個答案
    for (const answerData of data.answers) {
      const answer = await Answer.create({
        responseId: response.id,
        questionId: answerData.questionId,
        answerText: answerData.answerText,
        answerDate: answerData.answerDate ? new Date(answerData.answerDate) : undefined
      });

      // 如果是選擇題，儲存選項
      if (answerData.selectedOptions && answerData.selectedOptions.length > 0) {
        for (const optionId of answerData.selectedOptions) {
          await AnswerOption.create({
            answerId: answer.id,
            optionId
          });
        }
      }
    }

    return this.getResponseById(response.id);
  }

  /**
   * 取得填答記錄
   */
  async getResponseById(id: string) {
    return await ResponseModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user'
        },
        {
          model: Questionnaire,
          as: 'questionnaire'
        },
        {
          model: Answer,
          as: 'answers',
          include: [{
            model: AnswerOption,
            as: 'selectedOptions'
          }]
        }
      ]
    });
  }

  /**
   * 取得使用者的填答記錄
   */
  async getResponsesByUser(userId: string, formId?: string) {
    const where: any = { userId };
    if (formId) {
      where.formId = formId;
    }

    return await ResponseModel.findAll({
      where,
      include: [
        {
          model: Questionnaire,
          as: 'questionnaire'
        },
        {
          model: Answer,
          as: 'answers',
          include: [{
            model: AnswerOption,
            as: 'selectedOptions'
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  /**
   * 更新填答記錄
   */
  async updateResponse(id: string, data: {
    answers: Array<{
      questionId: string;
      answerText?: string;
      answerDate?: string;
      selectedOptions?: string[];
    }>;
  }) {
    const response = await ResponseModel.findByPk(id);
    if (!response) {
      throw new Error('填答記錄不存在');
    }

    // 刪除現有答案
    await Answer.destroy({
      where: { responseId: id }
    });

    // 重新建立答案
    for (const answerData of data.answers) {
      const answer = await Answer.create({
        responseId: response.id,
        questionId: answerData.questionId,
        answerText: answerData.answerText,
        answerDate: answerData.answerDate ? new Date(answerData.answerDate) : undefined
      });

      // 如果是選擇題，儲存選項
      if (answerData.selectedOptions && answerData.selectedOptions.length > 0) {
        for (const optionId of answerData.selectedOptions) {
          await AnswerOption.create({
            answerId: answer.id,
            optionId
          });
        }
      }
    }

    // 更新提交時間
    await response.update({
      submitTime: new Date()
    });

    return this.getResponseById(id);
  }

  /**
   * 刪除填答記錄
   */
  async deleteResponse(id: string) {
    const response = await ResponseModel.findByPk(id);
    if (!response) {
      throw new Error('填答記錄不存在');
    }

    await response.destroy();
    return true;
  }
}

export const responseService = new ResponseService();
