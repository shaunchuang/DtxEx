import React from 'react';
import { Question, QuestionType } from '@/types';
import { Input, Textarea } from '@/components/ui';

interface QuestionRendererProps {
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const renderQuestionByType = () => {
    switch (question.questionType) {
      case QuestionType.TEXT:
        return (
          <Input
            type="text"
            value={value?.answerText || ''}
            onChange={(e) => onChange({ answerText: e.target.value })}
            error={error}
            required={question.isRequired}
            placeholder="請輸入您的答案"
          />
        );

      case QuestionType.DATE:
        return (
          <Input
            type="date"
            value={value?.answerDate || ''}
            onChange={(e) => onChange({ answerDate: e.target.value })}
            error={error}
            required={question.isRequired}
          />
        );

      case QuestionType.PARAGRAPH:
        return (
          <div className="text-secondary-600 text-sm leading-relaxed">
            {question.questionText}
          </div>
        );

      case QuestionType.SINGLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={value?.selectedOptions?.includes(option.id) || false}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({ selectedOptions: [option.id] });
                    }
                  }}
                  className="form-radio"
                  required={question.isRequired}
                />
                <span className="text-secondary-700">{option.optionText}</span>
              </label>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.id}
                  checked={value?.selectedOptions?.includes(option.id) || false}
                  onChange={(e) => {
                    const currentSelections = value?.selectedOptions || [];
                    if (e.target.checked) {
                      onChange({
                        selectedOptions: [...currentSelections, option.id]
                      });
                    } else {
                      onChange({
                        selectedOptions: currentSelections.filter((id: string) => id !== option.id)
                      });
                    }
                  }}
                  className="form-checkbox"
                />
                <span className="text-secondary-700">{option.optionText}</span>
              </label>
            ))}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      case QuestionType.SCALE:
        return (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.id}
                    checked={value?.selectedOptions?.includes(option.id) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onChange({ selectedOptions: [option.id] });
                      }
                    }}
                    className="form-radio"
                    required={question.isRequired}
                  />
                  <span className="text-secondary-700 text-sm">{option.optionText}</span>
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return <div className="text-red-500">不支援的題目類型</div>;
    }
  };

  if (question.questionType === QuestionType.PARAGRAPH) {
    return (
      <div className="space-y-2">
        {renderQuestionByType()}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h4 className="text-lg font-medium text-secondary-900">
          {question.questionText}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </h4>
        {question.description && (
          <p className="text-sm text-secondary-600">{question.description}</p>
        )}
      </div>
      {renderQuestionByType()}
    </div>
  );
};
