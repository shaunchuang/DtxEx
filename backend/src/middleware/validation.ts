import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// 問卷建立驗證
export const validateQuestionnaireCreation = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    title: Joi.string().required().min(1).max(255),
    description: Joi.string().optional().allow(''),
    sections: Joi.array().items(
      Joi.object({
        title: Joi.string().optional().allow(''),
        description: Joi.string().optional().allow(''),
        order: Joi.number().integer().min(1).required(),
        questions: Joi.array().items(
          Joi.object({
            questionText: Joi.string().required(),
            questionType: Joi.string().valid('TEXT', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'SCALE', 'PARAGRAPH', 'DATE').required(),
            order: Joi.number().integer().min(1).required(),
            isRequired: Joi.boolean().optional(),
            description: Joi.string().optional().allow(''),
            options: Joi.array().items(
              Joi.object({
                optionText: Joi.string().required(),
                optionValue: Joi.string().optional().allow(''),
                order: Joi.number().integer().min(1).required()
              })
            ).optional()
          })
        ).optional()
      })
    ).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: '輸入資料格式錯誤',
      details: error.details
    });
  }

  next();
};

// 填答提交驗證
export const validateResponseSubmission = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    formId: Joi.string().uuid().required(),
    userId: Joi.string().uuid().required(),
    answers: Joi.array().items(
      Joi.object({
        questionId: Joi.string().uuid().required(),
        answerText: Joi.string().optional().allow(''),
        answerDate: Joi.date().optional(),
        selectedOptions: Joi.array().items(
          Joi.string().uuid()
        ).optional()
      })
    ).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: '填答資料格式錯誤',
      details: error.details
    });
  }

  next();
};
