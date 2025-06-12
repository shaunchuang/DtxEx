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

      const questionnaire = await Questionnaire.create({
        title,
        description
      });

      // 建立區段和題目
      if (sections && sections.length > 0) {
        for (const sectionData of sections) {
          const section = await Section.create({
            formId: questionnaire.id,
            title: sectionData.title,
            description: sectionData.description,
            order: sectionData.order
          });

          if (sectionData.questions && sectionData.questions.length > 0) {
            for (const questionData of sectionData.questions) {
              const question = await Question.create({
                sectionId: section.id,
                questionText: questionData.questionText,
                questionType: questionData.questionType,
                order: questionData.order,
                isRequired: questionData.isRequired,
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
      }

      // 重新取得完整資料
      const result = await Questionnaire.findByPk(questionnaire.id, {
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
      const { title, description } = req.body;

      const questionnaire = await Questionnaire.findByPk(id);
      if (!questionnaire) {
        return res.status(404).json({
          success: false,
          message: '問卷不存在'
        });
      }

      await questionnaire.update({ title, description });

      res.json({
        success: true,
        data: questionnaire,
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
}
