'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { QuestionnaireEditor } from '@/components/QuestionnaireEditor';
import { useQuestionnaire, useUpdateQuestionnaire } from '@/hooks/useQuestionnaires';
import { Card, CardBody } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function EditQuestionnairePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const { data: questionnaire, isPending, error } = useQuestionnaire(id);
  const updateQuestionnaireMutation = useUpdateQuestionnaire();

  const handleSave = async (data: any) => {
    try {
      await updateQuestionnaireMutation.mutateAsync({ id, data });
      router.push('/admin');
    } catch (error) {
      console.error('更新問卷失敗:', error);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto" />
            <h2 className="text-xl font-semibold text-secondary-900">無效的問卷ID</h2>
            <p className="text-secondary-600">
              無法識別問卷 ID，請檢查您的連結是否正確。
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回管理頁面</span>
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
          <p className="text-secondary-600">載入問卷資料中...</p>
        </div>
      </div>
    );
  }

  if (error || !questionnaire) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto" />
            <h2 className="text-xl font-semibold text-secondary-900">問卷不存在</h2>
            <p className="text-secondary-600">
              抱歉，找不到您要編輯的問卷。可能該問卷已被刪除或您的連結有誤。
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回管理頁面</span>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 導航 */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回管理頁面</span>
        </Link>
      </div>

      {/* 頁面標題 */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900">編輯問卷</h1>
        <p className="text-secondary-600 mt-2">修改問卷的基本資訊和結構</p>
      </div>

      {/* 編輯器 */}
      <QuestionnaireEditor
        questionnaire={questionnaire}
        onSave={handleSave}
        isLoading={updateQuestionnaireMutation.isPending}
      />
    </div>
  );
}
