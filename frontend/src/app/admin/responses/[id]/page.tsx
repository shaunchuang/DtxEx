'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuestionnaire, useQuestionnaireResponses } from '@/hooks/useQuestionnaires';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft, FileText, User, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateTime } from '@/utils';
import { ResponseStatus } from '@/types';

export default function QuestionnaireResponsesPage() {
  const params = useParams();
  const id = params?.id as string;
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: questionnaire, isPending: questionnaireLoading } = useQuestionnaire(id);
  const { data: responsesData, isPending: responsesLoading } = useQuestionnaireResponses(id, {
    page: currentPage,
    limit: pageSize
  });

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

  if (questionnaireLoading || responsesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-secondary-600">載入資料中...</p>
        </div>
      </div>
    );
  }

  if (!questionnaire || !responsesData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto" />
            <h2 className="text-xl font-semibold text-secondary-900">問卷不存在</h2>
            <p className="text-secondary-600">
              抱歉，找不到您要查看的問卷或其填答記錄。
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

  const getStatusText = (status: ResponseStatus) => {
    switch (status) {
      case ResponseStatus.COMPLETED:
        return '已完成';
      case ResponseStatus.SUBMITTED:
        return '已提交';
      case ResponseStatus.DRAFT:
        return '草稿';
      default:
        return '未知';
    }
  };

  const getStatusColor = (status: ResponseStatus) => {
    switch (status) {
      case ResponseStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case ResponseStatus.SUBMITTED:
        return 'bg-blue-100 text-blue-800';
      case ResponseStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const { questionnaire: questionnaireInfo, responses, pagination } = responsesData;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* 頁面標題和導航 */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin"
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回管理頁面</span>
        </Link>
      </div>

      {/* 問卷資訊 */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-secondary-900">
              {questionnaireInfo.title} - 填答記錄
            </h1>
            {questionnaireInfo.description && (
              <p className="text-secondary-600">{questionnaireInfo.description}</p>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {pagination.totalCount}
              </div>
              <div className="text-sm text-secondary-600">總填答數</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {responses.filter(r => r.status === ResponseStatus.COMPLETED).length}
              </div>
              <div className="text-sm text-secondary-600">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {responses.filter(r => r.status === ResponseStatus.SUBMITTED).length}
              </div>
              <div className="text-sm text-secondary-600">已提交</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 填答記錄列表 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">填答記錄</h2>
        </CardHeader>
        <CardBody>
          {responses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">尚無填答記錄</h3>
              <p className="text-secondary-600">
                這份問卷目前還沒有任何填答記錄。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 桌面版表格 */}
              <div className="hidden md:block">
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="border-b border-secondary-200">
                        <th className="text-left py-3 px-4 font-semibold text-secondary-900">填答者</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-900">提交時間</th>
                        <th className="text-left py-3 px-4 font-semibold text-secondary-900">狀態</th>
                        <th className="text-center py-3 px-4 font-semibold text-secondary-900">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((response) => (
                        <tr key={response.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <User className="h-5 w-5 text-secondary-500" />
                              <div>
                                <div className="font-medium text-secondary-900">
                                  {response.user.name}
                                </div>
                                <div className="text-sm text-secondary-600">
                                  {response.user.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-secondary-600">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDateTime(response.submitTime)}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                response.status
                              )}`}
                            >
                              {getStatusText(response.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center">
                              <Link href={`/my-responses/${response.id}`}>
                                <Button variant="outline" size="sm" title="檢視填答記錄">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 手機版卡片 */}
              <div className="md:hidden space-y-4">
                {responses.map((response) => (
                  <Card key={response.id} className="hover:shadow-lg transition-shadow">
                    <CardBody>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <User className="h-5 w-5 text-secondary-500" />
                            <div>
                              <div className="font-medium text-secondary-900">
                                {response.user.name}
                              </div>
                              <div className="text-sm text-secondary-600">
                                {response.user.email}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              response.status
                            )}`}
                          >
                            {getStatusText(response.status)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-secondary-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDateTime(response.submitTime)}</span>
                          </div>
                          
                          <Link href={`/my-responses/${response.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              檢視
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 分頁控制 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-secondary-200 pt-4 mt-6">
              <div className="text-sm text-secondary-600">
                第 {pagination.page} 頁，共 {pagination.totalPages} 頁
                （總共 {pagination.totalCount} 筆記錄）
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                  上一頁
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  下一頁
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
