import { Request, Response } from 'express';
import { Response as ResponseModel, Answer, AnswerOption, User, Questionnaire, Question, QuestionOption } from '../models';
import { responseService } from '../services';
import { QuestionType, ResponseStatus } from '../types';

export class ResponseController {
  // 提交問卷回答
  async submit(req: Request, res: Response) {
    try {
      const { formId, userId, answers } = req.body;

      // 檢查問卷是否存在
      const questionnaire = await Questionnaire.findByPk(formId);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: '問卷不存在'
        });
      }

      // 檢查使用者是否存在
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: '使用者不存在'
        });
      }

      // 檢查是否已有回答記錄
      let response = await ResponseModel.findOne({
        where: {
          formId,
          userId
        }
      });

      // 如果沒有則建立新的回答記錄
      if (!response) {
        response = await ResponseModel.create({
          formId,
          userId,
          submitTime: new Date(),
          status: ResponseStatus.SUBMITTED
        });
      } else {
        // 更新現有記錄
        await response.update({
          lastUpdateTime: new Date(),
          status: ResponseStatus.SUBMITTED
        });

        // 刪除舊的答案
        await Answer.destroy({
          where: {
            responseId: response.id
          }
        });
      }

      // 儲存答案
      for (const answerData of answers) {
        const question = await Question.findByPk(answerData.questionId);
        if (!question) continue;

        const answer = await Answer.create({
          responseId: response.id,
          questionId: answerData.questionId,
          answerText: answerData.answerText,
          answerDate: answerData.answerDate
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

      // 取得完整的回答資料
      const result = await this.getResponseWithDetails(response.id);

      res.status(201).json({
        success: true,
        data: result,
        message: '問卷提交成功'
      });
    } catch (error) {
      console.error('Error submitting response:', error);
      res.status(500).json({
        success: false,
        message: '提交問卷失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 取得填答記錄
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const response = await this.getResponseWithDetails(id);
      
      if (!response) {
        return res.status(404).json({
          success: false,
          message: '填答記錄不存在'
        });
      }

      res.json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error fetching response:', error);
      res.status(500).json({
        success: false,
        message: '取得填答記錄失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 取得使用者的填答記錄
  async getByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { formId } = req.query;

      const whereCondition: any = { userId };
      if (formId) {
        whereCondition.formId = formId;
      }

      const responses = await ResponseModel.findAll({
        where: whereCondition,
        include: [{
          model: Questionnaire,
          as: 'questionnaire'
        }],
        order: [['createdAt', 'DESC']]
      });

      res.json({
        success: true,
        data: responses
      });
    } catch (error) {
      console.error('Error fetching user responses:', error);
      res.status(500).json({
        success: false,
        message: '取得使用者填答記錄失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 更新填答記錄
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { answers } = req.body;

      const response = await ResponseModel.findByPk(id);
      if (!response) {
        return res.status(404).json({
          success: false,
          message: '填答記錄不存在'
        });
      }

      // 更新時間
      await response.update({
        lastUpdateTime: new Date()
      });

      // 刪除舊答案
      await Answer.destroy({
        where: {
          responseId: response.id
        }
      });

      // 儲存新答案
      for (const answerData of answers) {
        const answer = await Answer.create({
          responseId: response.id,
          questionId: answerData.questionId,
          answerText: answerData.answerText,
          answerDate: answerData.answerDate
        });

        if (answerData.selectedOptions && answerData.selectedOptions.length > 0) {
          for (const optionId of answerData.selectedOptions) {
            await AnswerOption.create({
              answerId: answer.id,
              optionId
            });
          }
        }
      }

      const result = await this.getResponseWithDetails(response.id);

      res.json({
        success: true,
        data: result,
        message: '填答記錄更新成功'
      });
    } catch (error) {
      console.error('Error updating response:', error);
      res.status(500).json({
        success: false,
        message: '更新填答記錄失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 取得完整的回答資料（包含關聯）
  private async getResponseWithDetails(responseId: string) {
    return await ResponseModel.findByPk(responseId, {
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
          include: [
            {
              model: Question,
              as: 'question'
            },
            {
              model: AnswerOption,
              as: 'selectedOptions',
              include: [{
                model: QuestionOption,
                as: 'option'
              }]
            }
          ]
        }
      ]
    });
  }
}
