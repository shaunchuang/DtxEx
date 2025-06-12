'use client';

import React from 'react';
import { useQuestionnaires } from '@/hooks/useQuestionnaires';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import Link from 'next/link';
import { FileText, Plus, Calendar, Users } from 'lucide-react';
import { formatDateTime } from '@/utils';

export default function QuestionnairesOverviewPage() {
  const { data: questionnaires, isPending, error } = useQuestionnaires();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600">載入問卷列表中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="alert-error max-w-md mx-auto">
          載入問卷列表時發生錯誤，請稍後再試。
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 頁面標題 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-secondary-900">問卷總覽</h1>
        <p className="text-secondary-600">選擇要填寫的問卷或查看您的填答記錄</p>
      </div>

      {/* 快速操作 */}
      <div className="flex justify-center space-x-4">
        <Link href="/my-responses">
          <Button variant="outline">
            <Users className="h-5 w-5 mr-2" />
            查看我的填答記錄
          </Button>
        </Link>
      </div>

      {/* 問卷列表 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">可用問卷</h2>
        </CardHeader>
        <CardBody>
          {!questionnaires || questionnaires.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">暫無可用問卷</h3>
              <p className="text-secondary-600 mb-4">目前沒有可填寫的問卷。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {questionnaires.map((questionnaire) => (
                <Card key={questionnaire.id} className="hover:shadow-lg transition-shadow">
                  <CardBody>
                    <div className="space-y-4">
                      {/* 問卷標題和描述 */}
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          {questionnaire.title}
                        </h3>
                        {questionnaire.description && (
                          <p className="text-secondary-600 text-sm line-clamp-3">
                            {questionnaire.description}
                          </p>
                        )}
                      </div>

                      {/* 問卷資訊 */}
                      <div className="space-y-2 text-sm text-secondary-600">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{questionnaire.sections?.length || 0} 個區段</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>建立於 {formatDateTime(questionnaire.createdAt)}</span>
                        </div>
                      </div>

                      {/* 操作按鈕 */}
                      <div className="pt-2">
                        <Link href={`/questionnaire/${questionnaire.id}`} className="block">
                          <Button className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            開始填寫
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* 底部說明 */}
      <div className="text-center text-sm text-secondary-500">
        <p>填寫完成後，您可以在「我的填答記錄」中查看和管理您的答案。</p>
      </div>
    </div>
  );
}
