import { Request, Response } from 'express';
import { Questionnaire, Section, Question, QuestionOption } from '../models';
import { questionnaireService } from '../services';

export class QuestionnaireController {
  // 取得所有問卷
  async getAll(req: Request, res: Response) {
    try {
      const questionnaires = await questionnaireService.getAllQuestionnaires();

      res.json({
        success: true,
        data: questionnaires
      });
    } catch (error) {
      console.error('Error fetching questionnaires:', error);
      res.status(500).json({
        success: false,
        message: '取得問卷列表失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 取得單一問卷
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const questionnaire = await questionnaireService.getQuestionnaireById(id);

      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: '問卷不存在'
        });
      }

      res.json({
        success: true,
        data: questionnaire
      });
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
      res.status(500).json({
        success: false,
        message: '取得問卷失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 建立問卷
  async create(req: Request, res: Response) {
    try {
      const { title, description, sections } = req.body;

      // 基本驗證
      if (!title || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: '問卷標題為必填項目'
        });
      }

      if (sections && sections.length > 0) {
        // 驗證區段和題目
        for (const section of sections) {
          if (section.questions && section.questions.length > 0) {
            for (const question of section.questions) {
              if (!question.questionText || question.questionText.trim().length === 0) {
                return res.status(400).json({
                  success: false,
                  message: '題目內容不能為空'
                });
              }
              if (!question.questionType) {
                return res.status(400).json({
                  success: false,
                  message: '請選擇題目類型'
                });
              }
            }
          }
        }
      }

      const result = await questionnaireService.createQuestionnaire({
        title,
        description,
        sections: sections || []
      });

      res.status(201).json({
        success: true,
        data: result,
        message: '問卷建立成功'
      });
    } catch (error) {
      console.error('Error creating questionnaire:', error);
      res.status(500).json({
        success: false,
        message: '建立問卷失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 更新問卷
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, sections } = req.body;

      // 基本驗證
      if (title !== undefined && (!title || title.trim().length === 0)) {
        return res.status(400).json({
          success: false,
          message: '問卷標題不能為空'
        });
      }

      if (sections && sections.length > 0) {
        // 驗證區段和題目
        for (const section of sections) {
          if (section.questions && section.questions.length > 0) {
            for (const question of section.questions) {
              if (!question.questionText || question.questionText.trim().length === 0) {
                return res.status(400).json({
                  success: false,
                  message: '題目內容不能為空'
                });
              }
              if (!question.questionType) {
                return res.status(400).json({
                  success: false,
                  message: '請選擇題目類型'
                });
              }
            }
          }
        }
      }

      const result = await questionnaireService.updateQuestionnaire(id, {
        title,
        description,
        sections
      });

      res.json({
        success: true,
        data: result,
        message: '問卷更新成功'
      });
    } catch (error) {
      console.error('Error updating questionnaire:', error);
      res.status(500).json({
        success: false,
        message: '更新問卷失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 刪除問卷
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const questionnaire = await Questionnaire.findByPk(id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: '問卷不存在'
        });
      }

      await questionnaire.destroy();

      res.json({
        success: true,
        message: '問卷刪除成功'
      });
    } catch (error) {
      console.error('Error deleting questionnaire:', error);
      res.status(500).json({
        success: false,
        message: '刪除問卷失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // 取得問卷的所有填答記錄
  async getResponses(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // 檢查問卷是否存在
      const questionnaire = await Questionnaire.findByPk(id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: '問卷不存在'
        });
      }

      // 取得填答記錄
      const { rows: responses, count: totalCount } = await questionnaireService.getQuestionnaireResponses(id, {
        limit,
        offset
      });

      const totalPages = Math.ceil(totalCount / limit);

      res.json({
        success: true,
        data: {
          questionnaire: {
            id: questionnaire.id,
            title: questionnaire.title,
            description: questionnaire.description
          },
          responses,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
          }
        }
      });
    } catch (error) {
      console.error('Error fetching questionnaire responses:', error);
      res.status(500).json({
        success: false,
        message: '取得問卷填答記錄失敗',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
