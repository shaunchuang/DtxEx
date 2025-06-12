import React, { useState } from 'react';
import { Questionnaire, QuestionType, SubmitAnswerData } from '@/types';
import { QuestionRenderer } from './QuestionRenderer';
import { Button, Card, CardHeader, CardBody, CardFooter, Input } from '@/components/ui';
import { generateUserId } from '@/utils';
import { useSubmitResponse } from '@/hooks/useResponses';

interface QuestionnaireFormProps {
  questionnaire: Questionnaire;
  initialValues?: any;
  onSubmit?: (data: any) => void;
  isEditing?: boolean;
}

export const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({
  questionnaire,
  initialValues,
  onSubmit,
  isEditing = false,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>(initialValues || {});
  const [userInfo, setUserInfo] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const submitResponseMutation = useSubmitResponse();

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // 清除錯誤
    if (errors[questionId]) {
      setErrors(prev => ({
        ...prev,
        [questionId]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // 編輯模式下不需要驗證使用者資訊
    if (!isEditing) {
      if (!userInfo.name.trim()) {
        newErrors.name = '請輸入姓名';
      }
      if (!userInfo.email.trim()) {
        newErrors.email = '請輸入電子郵件';
      }
    }

    // 驗證必填題目
    questionnaire.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.isRequired && question.questionType !== QuestionType.PARAGRAPH) {
          const answer = answers[question.id];
          
          if (question.questionType === QuestionType.TEXT || question.questionType === QuestionType.DATE) {
            if (!answer?.answerText && !answer?.answerDate) {
              newErrors[question.id] = '此為必填題目';
            }
          } else if (question.questionType === QuestionType.SINGLE_CHOICE || 
                    question.questionType === QuestionType.MULTIPLE_CHOICE || 
                    question.questionType === QuestionType.SCALE) {
            if (!answer?.selectedOptions || answer.selectedOptions.length === 0) {
              newErrors[question.id] = '此為必填題目';
            }
          }
        }
      });
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: SubmitAnswerData[] = [];
    
    questionnaire.sections.forEach(section => {
      section.questions.forEach(question => {
        if (question.questionType !== QuestionType.PARAGRAPH) {
          const answer = answers[question.id];
          if (answer) {
            submitData.push({
              questionId: question.id,
              answerText: answer.answerText,
              answerDate: answer.answerDate,
              selectedOptions: answer.selectedOptions
            });
          }
        }
      });
    });

    const responseData = {
      formId: questionnaire.id,
      userId: generateUserId(),
      userName: userInfo.name,
      userEmail: userInfo.email,
      answers: submitData
    };

    try {
      if (onSubmit) {
        onSubmit(responseData);
      } else {
        await submitResponseMutation.mutateAsync(responseData);
      }
    } catch (error) {
      console.error('提交失敗:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 使用者資訊 - 只在非編輯模式顯示 */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">基本資料</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="姓名"
                value={userInfo.name}
                onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                error={errors.name}
                required
              />
              <Input
                label="電子郵件"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                required
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* 問卷內容 */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-secondary-900">{questionnaire.title}</h2>
            {questionnaire.description && (
              <p className="text-secondary-600">{questionnaire.description}</p>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {questionnaire.sections.map((section) => (
              <div key={section.id} className="space-y-6">
                {(section.title || section.description) && (
                  <div className="border-l-4 border-primary-500 pl-4 space-y-1">
                    {section.title && (
                      <h3 className="text-xl font-semibold text-secondary-900">{section.title}</h3>
                    )}
                    {section.description && (
                      <p className="text-secondary-600">{section.description}</p>
                    )}
                  </div>
                )}
                
                <div className="space-y-6">
                  {section.questions.map((question) => (
                    <div key={question.id} className="border-b border-secondary-100 pb-6 last:border-b-0">
                      <QuestionRenderer
                        question={question}
                        value={answers[question.id]}
                        onChange={(value) => handleAnswerChange(question.id, value)}
                        error={errors[question.id]}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              isLoading={submitResponseMutation.isPending}
              disabled={submitResponseMutation.isPending}
            >
              {isEditing ? '更新答案' : '提交問卷'}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
};
