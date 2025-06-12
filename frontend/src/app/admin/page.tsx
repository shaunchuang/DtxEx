'use client';

import React from 'react';
import { useQuestionnaires, useDeleteQuestionnaire } from '@/hooks/useQuestionnaires';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import { formatDateTime } from '@/utils';
import { FileText, Plus, Edit, Trash2, Eye, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: questionnaires, isPending, error } = useQuestionnaires();
  const deleteQuestionnaireMutation = useDeleteQuestionnaire();

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`確定要刪除問卷「${title}」嗎？此操作無法復原。`)) {
      await deleteQuestionnaireMutation.mutateAsync(id);
    }
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">問卷管理</h1>
          <p className="text-secondary-600 mt-2">建立和管理您的醫療量表問卷</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>建立新問卷</span>
        </Button>
      </div>

      {/* 統計概覽 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardBody className="text-center">
            <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-secondary-900">{questionnaires?.length || 0}</p>
            <p className="text-sm text-secondary-600">總問卷數</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-secondary-900">1,234</p>
            <p className="text-sm text-secondary-600">總填答數</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-secondary-900">85%</p>
            <p className="text-sm text-secondary-600">完成率</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-secondary-900">3</p>
            <p className="text-sm text-secondary-600">進行中</p>
          </CardBody>
        </Card>
      </div>

      {/* 問卷列表 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">問卷列表</h2>
        </CardHeader>
        <CardBody>
          {!questionnaires || questionnaires.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">尚無問卷</h3>
              <p className="text-secondary-600 mb-4">建立您的第一份問卷來開始收集回答。</p>
              <Button>
                <Plus className="h-5 w-5 mr-2" />
                建立新問卷
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">問卷名稱</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">建立時間</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">區段數</th>
                    <th className="text-left py-3 px-4 font-semibold text-secondary-900">狀態</th>
                    <th className="text-center py-3 px-4 font-semibold text-secondary-900">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {questionnaires.map((questionnaire) => (
                    <tr key={questionnaire.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                      <td className="py-4 px-4">
                        <div>
                          <h3 className="font-medium text-secondary-900">{questionnaire.title}</h3>
                          {questionnaire.description && (
                            <p className="text-sm text-secondary-600 mt-1 line-clamp-2">
                              {questionnaire.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-secondary-600">
                        {formatDateTime(questionnaire.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-secondary-600">
                        {questionnaire.sections?.length || 0} 個區段
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          進行中
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link href={`/questionnaire/${questionnaire.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(questionnaire.id, questionnaire.title)}
                            disabled={deleteQuestionnaireMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
