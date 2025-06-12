'use client';

import React from 'react';
import Link from 'next/link';
import { useQuestionnaires } from '@/hooks/useQuestionnaires';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import { formatDateTime } from '@/utils';
import { FileText, Clock, Users } from 'lucide-react';

export default function HomePage() {
  const { data: questionnaires, isPending, error } = useQuestionnaires();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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
    <div className="space-y-8">
      {/* 頁面標題 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">醫療量表問卷</h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          歡迎使用動態醫療量表問卷系統，請選擇您要填寫的問卷
        </p>
      </div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardBody>
            <div className="flex items-center justify-center space-x-3">
              <FileText className="h-8 w-8 text-primary-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">{questionnaires?.length || 0}</p>
                <p className="text-sm text-secondary-600">可用問卷</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="text-center">
          <CardBody>
            <div className="flex items-center justify-center space-x-3">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">1,234</p>
                <p className="text-sm text-secondary-600">參與人數</p>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className="text-center">
          <CardBody>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-secondary-900">5-10</p>
                <p className="text-sm text-secondary-600">分鐘完成</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 問卷列表 */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-secondary-900">可用問卷</h2>
        
        {!questionnaires || questionnaires.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">暫無可用問卷</h3>
                <p className="text-secondary-600">請稍後再來查看新的問卷。</p>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {questionnaires.map((questionnaire) => (
              <Card key={questionnaire.id} className="hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      {questionnaire.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      進行中
                    </span>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="space-y-4">
                    {questionnaire.description && (
                      <p className="text-secondary-600 line-clamp-3">
                        {questionnaire.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-secondary-500">
                      <span>建立時間: {formatDateTime(questionnaire.createdAt)}</span>
                      <span>{questionnaire.sections?.length || 0} 個區段</span>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link href={`/questionnaire/${questionnaire.id}`} className="flex-1">
                        <Button className="w-full">
                          開始填寫
                        </Button>
                      </Link>
                      <Link href={`/questionnaire/${questionnaire.id}/preview`}>
                        <Button variant="outline">
                          預覽
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
