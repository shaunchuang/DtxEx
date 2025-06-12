import { Request, Response } from 'express';
import { Response as ResponseModel, Answer, AnswerOption, User, Questionnaire, Question, QuestionOption } from '../models';
import { responseService } from '../services';
import { QuestionType, ResponseStatus } from '../types';

export class ResponseController {
  // 取得所有填答記錄
  async getAll(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const { count, rows } = await ResponseModel.findAndCountAll({
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
              }
            ]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset: offset
      });

      res.json({
        success: true,
        data: {
          responses: rows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            totalCount: count,
            totalPages: Math.ceil(count / Number(limit)),
            hasNextPage: offset + rows.length < count,
            hasPrevPage: Number(page) > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching all responses:', error);
      res.status(500).json({
        success: false,
        message: '取得填答記錄失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 提交問卷回答
  async submit(req: Request, res: Response) {
    try {
      const { formId, userId, answers } = req.body;

      // 基本驗證
      if (!formId || !userId || !answers) {
        return res.status(400).json({
          success: false,
          message: '缺少必要的提交資料'
        });
      }

      // 使用 ResponseService 來處理提交 (它會自動創建使用者如果不存在)
      const result = await responseService.submitResponse({
        formId,
        userId,
        answers
      });

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
      
      const response = await ResponseModel.findByPk(id, {
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
