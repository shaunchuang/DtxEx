'use client';

import React, { useState, useEffect } from 'react';
import { Questionnaire, Section, Question, QuestionType, QuestionOption } from '@/types';
import { Button, Card, CardHeader, CardBody, Input, Select, Textarea } from '@/components/ui';
import { Plus, Trash2, Save } from 'lucide-react';

interface QuestionnaireEditorProps {
  questionnaire?: Questionnaire;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

interface SectionFormData {
  id?: string;
  title: string;
  description: string;
  order: number;
  questions: QuestionFormData[];
}

interface QuestionFormData {
  id?: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  description: string;
  order: number;
  options: OptionFormData[];
}

interface OptionFormData {
  id?: string;
  optionText: string;
  optionValue: string;
  order: number;
}

const questionTypeOptions = [
  { value: QuestionType.TEXT, label: '文字輸入' },
  { value: QuestionType.PARAGRAPH, label: '段落文字' },
  { value: QuestionType.SINGLE_CHOICE, label: '單選題' },
  { value: QuestionType.MULTIPLE_CHOICE, label: '複選題' },
  { value: QuestionType.SCALE, label: '量表題' },
  { value: QuestionType.DATE, label: '日期' },
];

export const QuestionnaireEditor: React.FC<QuestionnaireEditorProps> = ({
  questionnaire,
  onSave,
  isLoading = false,
}) => {
  const [title, setTitle] = useState(questionnaire?.title || '');
  const [description, setDescription] = useState(questionnaire?.description || '');
  const [sections, setSections] = useState<SectionFormData[]>([]);

  // 初始化表單數據
  useEffect(() => {
    if (questionnaire?.sections) {
      const sectionsData = questionnaire.sections.map((section, index) => ({
        id: section.id,
        title: section.title || '',
        description: section.description || '',
        order: section.order || index + 1,
        questions: section.questions.map((question, qIndex) => ({
          id: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          isRequired: question.isRequired || false,
          description: question.description || '',
          order: question.order || qIndex + 1,
          options: question.options?.map((option, oIndex) => ({
            id: option.id,
            optionText: option.optionText,
            optionValue: option.optionValue || option.optionText,
            order: option.order || oIndex + 1,
          })) || [],
        })),
      }));
      setSections(sectionsData);
    } else {
      // 新建問卷時添加一個預設區段
      setSections([{
        title: '',
        description: '',
        order: 1,
        questions: [],
      }]);
    }
  }, [questionnaire]);

  // 添加新區段
  const addSection = () => {
    const newSection: SectionFormData = {
      title: '',
      description: '',
      order: sections.length + 1,
      questions: [],
    };
    setSections([...sections, newSection]);
  };

  // 刪除區段
  const removeSection = (index: number) => {
    if (sections.length <= 1) return; // 至少保留一個區段
    setSections(sections.filter((_, i) => i !== index));
  };

  // 更新區段
  const updateSection = (index: number, field: keyof SectionFormData, value: any) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setSections(newSections);
  };

  // 添加新題目
  const addQuestion = (sectionIndex: number) => {
    const newQuestion: QuestionFormData = {
      questionText: '',
      questionType: QuestionType.TEXT,
      isRequired: false,
      description: '',
      order: sections[sectionIndex].questions.length + 1,
      options: [],
    };
    const newSections = [...sections];
    newSections[sectionIndex].questions.push(newQuestion);
    setSections(newSections);
  };

  // 刪除題目
  const removeQuestion = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions = newSections[sectionIndex].questions.filter((_, i) => i !== questionIndex);
    setSections(newSections);
  };

  // 更新題目
  const updateQuestion = (sectionIndex: number, questionIndex: number, field: keyof QuestionFormData, value: any) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex] = {
      ...newSections[sectionIndex].questions[questionIndex],
      [field]: value,
    };

    // 如果改變題目類型，清空選項
    if (field === 'questionType') {
      const needsOptions = [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE, QuestionType.SCALE].includes(value);
      if (!needsOptions) {
        newSections[sectionIndex].questions[questionIndex].options = [];
      } else if (value === QuestionType.SCALE) {
        // 量表題預設選項
        newSections[sectionIndex].questions[questionIndex].options = [
          { optionText: '1 - 非常不滿意', optionValue: '1', order: 1 },
          { optionText: '2 - 不滿意', optionValue: '2', order: 2 },
          { optionText: '3 - 普通', optionValue: '3', order: 3 },
          { optionText: '4 - 滿意', optionValue: '4', order: 4 },
          { optionText: '5 - 非常滿意', optionValue: '5', order: 5 },
        ];
      }
    }

    setSections(newSections);
  };

  // 添加選項
  const addOption = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections];
    const currentQuestion = newSections[sectionIndex].questions[questionIndex];
    const newOption: OptionFormData = {
      optionText: '',
      optionValue: '',
      order: currentQuestion.options.length + 1,
    };
    currentQuestion.options.push(newOption);
    setSections(newSections);
  };

  // 刪除選項
  const removeOption = (sectionIndex: number, questionIndex: number, optionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].options = 
      newSections[sectionIndex].questions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setSections(newSections);
  };

  // 更新選項
  const updateOption = (sectionIndex: number, questionIndex: number, optionIndex: number, field: keyof OptionFormData, value: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].options[optionIndex] = {
      ...newSections[sectionIndex].questions[questionIndex].options[optionIndex],
      [field]: value,
    };
    setSections(newSections);
  };

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 前端驗證
    if (!title.trim()) {
      alert('請輸入問卷標題');
      return;
    }

    // 驗證區段和題目
    for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      const section = sections[sectionIndex];
      
      for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex++) {
        const question = section.questions[questionIndex];
        
        if (!question.questionText.trim()) {
          alert(`區段 ${sectionIndex + 1} 的題目 ${questionIndex + 1} 內容不能為空`);
          return;
        }

        // 檢查需要選項的題目是否有選項
        if (needsOptions(question.questionType) && question.options.length === 0) {
          alert(`區段 ${sectionIndex + 1} 的題目 ${questionIndex + 1} 需要至少一個選項`);
          return;
        }

        // 檢查選項是否有空的
        for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
          const option = question.options[optionIndex];
          if (!option.optionText.trim()) {
            alert(`區段 ${sectionIndex + 1} 的題目 ${questionIndex + 1} 的選項 ${optionIndex + 1} 文字不能為空`);
            return;
          }
        }
      }
    }
    
    const formData = {
      title,
      description,
      sections: sections.map(section => ({
        ...section,
        questions: section.questions.map(question => ({
          ...question,
          options: question.options.length > 0 ? question.options : undefined,
        })),
      })),
    };

    onSave(formData);
  };

  // 檢查題目是否需要選項
  const needsOptions = (questionType: QuestionType) => {
    return [QuestionType.SINGLE_CHOICE, QuestionType.MULTIPLE_CHOICE, QuestionType.SCALE].includes(questionType);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 問卷基本資訊 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">問卷基本資訊</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Input
              label="問卷標題"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="輸入問卷標題"
            />
            <Textarea
              label="問卷描述"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="輸入問卷描述（選填）"
              rows={3}
            />
          </div>
        </CardBody>
      </Card>

      {/* 區段和題目編輯 */}
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <Card key={`section-${sectionIndex}`}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <h4 className="text-md font-semibold flex-1">
                  區段 {sectionIndex + 1}
                </h4>
                {sections.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <Input
                  label="區段標題"
                  value={section.title}
                  onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                  placeholder="輸入區段標題（選填）"
                />
                <Textarea
                  label="區段描述"
                  value={section.description}
                  onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                  placeholder="輸入區段描述（選填）"
                  rows={2}
                />

                {/* 題目列表 */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-medium text-secondary-700">題目</h5>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(sectionIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      新增題目
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {section.questions.map((question, questionIndex) => (
                      <Card key={`question-${sectionIndex}-${questionIndex}`} className="border-l-4 border-primary-200">
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">
                              題目 {questionIndex + 1}
                            </span>
                            <div className="flex-1" />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeQuestion(sectionIndex, questionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input
                                label="題目內容"
                                value={question.questionText}
                                onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'questionText', e.target.value)}
                                required
                                placeholder="輸入題目內容"
                              />
                              <Select
                                label="題目類型"
                                value={question.questionType}
                                onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'questionType', e.target.value as QuestionType)}
                                options={questionTypeOptions}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Textarea
                                label="題目說明"
                                value={question.description}
                                onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'description', e.target.value)}
                                placeholder="輸入題目說明（選填）"
                                rows={2}
                              />
                              <div className="flex items-center space-x-2 pt-6">
                                <input
                                  type="checkbox"
                                  id={`required-${sectionIndex}-${questionIndex}`}
                                  checked={question.isRequired}
                                  onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'isRequired', e.target.checked)}
                                  className="form-checkbox"
                                />
                                <label 
                                  htmlFor={`required-${sectionIndex}-${questionIndex}`}
                                  className="text-sm text-secondary-700"
                                >
                                  必填題目
                                </label>
                              </div>
                            </div>

                            {/* 選項編輯 */}
                            {needsOptions(question.questionType) && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium text-secondary-700">
                                    選項
                                  </label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(sectionIndex, questionIndex)}
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    新增選項
                                  </Button>
                                </div>
                                
                                <div className="space-y-2">
                                  {question.options.map((option, optionIndex) => (
                                    <div key={`option-${optionIndex}`} className="flex items-center space-x-2">
                                      <Input
                                        value={option.optionText}
                                        onChange={(e) => updateOption(sectionIndex, questionIndex, optionIndex, 'optionText', e.target.value)}
                                        placeholder="選項文字"
                                        className="flex-1"
                                      />
                                      <Input
                                        value={option.optionValue}
                                        onChange={(e) => updateOption(sectionIndex, questionIndex, optionIndex, 'optionValue', e.target.value)}
                                        placeholder="選項值"
                                        className="w-32"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => removeOption(sectionIndex, questionIndex, optionIndex)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* 新增區段按鈕 */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={addSection}
        >
          <Plus className="h-4 w-4 mr-2" />
          新增區段
        </Button>
      </div>

      {/* 操作按鈕 */}
      <div className="flex justify-end space-x-4">
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !title.trim() || sections.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          {questionnaire ? '更新問卷' : '建立問卷'}
        </Button>
      </div>
    </form>
  );
};
