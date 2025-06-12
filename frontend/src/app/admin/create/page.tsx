'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { QuestionnaireEditor } from '@/components/QuestionnaireEditor';
import { useCreateQuestionnaire } from '@/hooks/useQuestionnaires';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CreateQuestionnairePage() {
  const router = useRouter();
  const createQuestionnaireMutation = useCreateQuestionnaire();

  const handleSave = async (data: any) => {
    try {
      const result = await createQuestionnaireMutation.mutateAsync(data);
      router.push(`/admin`);
    } catch (error) {
      console.error('建立問卷失敗:', error);
    }
  };

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
        <h1 className="text-3xl font-bold text-secondary-900">建立新問卷</h1>
        <p className="text-secondary-600 mt-2">設計您的問卷結構，包含區段、題目和選項</p>
      </div>

      {/* 編輯器 */}
      <QuestionnaireEditor
        onSave={handleSave}
        isLoading={createQuestionnaireMutation.isPending}
      />
    </div>
  );
}
