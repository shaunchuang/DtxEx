'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useResponse, useUpdateResponse } from '@/hooks/useResponses';
import { QuestionnaireForm } from '@/components/QuestionnaireForm';
import { Card, CardBody } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function EditResponsePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: response, isPending, error } = useResponse(id);
  const updateResponseMutation = useUpdateResponse();

  const handleUpdateSubmit = async (data: any) => {
    try {
      await updateResponseMutation.mutateAsync({
        id,
        data: { answers: data.answers }
      });
      router.push(`/my-responses/${id}`);
    } catch (error) {
      console.error('更新填答記錄失敗:', error);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto" />
            <h2 className="text-xl font-semibold text-secondary-900">無效的記錄ID</h2>
            <p className="text-secondary-600">
              無法識別填答記錄 ID，請檢查您的連結是否正確。
            </p>
            <Link
              href="/my-responses"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回記錄列表</span>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600">載入填答記錄中...</p>
        </div>
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto" />
            <h2 className="text-xl font-semibold text-secondary-900">記錄不存在</h2>
            <p className="text-secondary-600">
              抱歉，找不到您要編輯的填答記錄。可能該記錄已被刪除或您的連結有誤。
            </p>
            <Link
              href="/my-responses"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回記錄列表</span>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  // 將現有的答案轉換為表單初始值格式
  const initialValues: Record<string, any> = {};
  response.answers.forEach((answer) => {
    const answerValue: any = {};
    
    if (answer.answerText) {
      answerValue.answerText = answer.answerText;
    }
    if (answer.answerDate) {
      answerValue.answerDate = answer.answerDate;
    }
    if (answer.selectedOptions && answer.selectedOptions.length > 0) {
      answerValue.selectedOptions = answer.selectedOptions.map(opt => opt.optionId);
    }
    
    initialValues[answer.questionId] = answerValue;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 頁面標題和導航 */}
      <div className="flex items-center space-x-4">
        <Link
          href={`/my-responses/${id}`}
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回檢視頁面</span>
        </Link>
      </div>

      {/* 頁面標題 */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">編輯填答記錄</h1>
        <p className="text-secondary-600 mt-2">修改您之前填寫的問卷答案</p>
      </div>

      {/* 編輯表單 */}
      <QuestionnaireForm
        questionnaire={response.questionnaire}
        initialValues={initialValues}
        onSubmit={handleUpdateSubmit}
        isEditing={true}
      />
    </div>
  );
}
