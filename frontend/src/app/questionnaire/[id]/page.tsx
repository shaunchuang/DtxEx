'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuestionnaire } from '@/hooks/useQuestionnaires';
import { QuestionnaireForm } from '@/components/QuestionnaireForm';
import { Card, CardBody } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

export default function QuestionnairePage() {
  const params = useParams();
  const id = params?.id as string;
  
  if (!params || !id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto" />
            <h2 className="text-xl font-semibold text-secondary-900">無效的問卷連結</h2>
            <p className="text-secondary-600">
              無法識別問卷 ID，請檢查您的連結是否正確。
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回問卷列表</span>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  const { data: questionnaire, isPending, error } = useQuestionnaire(id);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600">載入問卷中...</p>
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
              抱歉，找不到您要的問卷。可能該問卷已被刪除或您的連結有誤。
            </p>
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>返回問卷列表</span>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 頁面標題和導航 */}
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回列表</span>
        </Link>
        <div className="h-6 w-px bg-secondary-300"></div>
        <div className="flex items-center space-x-2 text-secondary-600">
          <Clock className="h-5 w-5" />
          <span>預估時間: 5-10 分鐘</span>
        </div>
      </div>

      {/* 問卷表單 */}
      <QuestionnaireForm questionnaire={questionnaire} />
    </div>
  );
}
