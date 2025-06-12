'use client';

import React, { useState } from 'react';
import { useAllResponses, useUserResponses } from '@/hooks/useResponses';
import { Button, Card, CardHeader, CardBody, Input } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft, FileText, Calendar, User, Eye, Edit, RefreshCw, Search } from 'lucide-react';
import { formatDateTime } from '@/utils';
import { ResponseStatus } from '@/types';

export default function MyResponsesPage() {
  const [page, setPage] = useState(1);
  const [searchUserId, setSearchUserId] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  
  const { data, isPending, error, refetch } = useAllResponses({ page, limit: 10 });
  const { data: userResponses, isPending: isUserSearchPending, error: userSearchError, refetch: refetchUserResponses } = useUserResponses(searchUserId);

  const handleSearch = () => {
    if (searchUserId.trim()) {
      setIsSearchMode(true);
      refetchUserResponses();
    }
  };

  const handleClearSearch = () => {
    setIsSearchMode(false);
    setSearchUserId('');
    refetch();
  };

  const displayData = isSearchMode ? userResponses : data?.responses;
  const pagination = isSearchMode ? null : data?.pagination;
  const isLoading = isSearchMode ? isUserSearchPending : isPending;
  const hasError = isSearchMode ? userSearchError : error;

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 頁面標題和導航 */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>返回首頁</span>
        </Link>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isPending}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isPending ? 'animate-spin' : ''}`} />
          重新整理
        </Button>
      </div>

      {      /* 頁面標題 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">我的填答記錄</h1>
          <p className="text-secondary-600 mt-2">查看和管理您已填寫的問卷記錄</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          重新整理
        </Button>
      </div>

      {/* 搜尋區域 */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>按使用者 ID 搜尋</span>
          </h3>
        </CardHeader>
        <CardBody>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Input
                label="使用者 ID"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                placeholder="請輸入使用者 ID"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <p className="text-sm text-secondary-500 mt-1">
                提示：使用者 ID 是在填寫問卷時系統自動生成的唯一識別碼
              </p>
            </div>
            <Button
              onClick={handleSearch}
              disabled={!searchUserId.trim() || isUserSearchPending}
              className="shrink-0"
            >
              <Search className="h-4 w-4 mr-2" />
              搜尋
            </Button>
            {isSearchMode && (
              <Button
                onClick={handleClearSearch}
                variant="outline"
                className="shrink-0"
              >
                顯示全部
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 載入狀態 */}
      {isLoading ? (
        <Card>
          <CardBody className="text-center py-12">
            <RefreshCw className="h-8 w-8 text-primary-600 mx-auto mb-4 animate-spin" />
            <p className="text-secondary-600">載入填答記錄中...</p>
          </CardBody>
        </Card>
      ) : hasError ? (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">載入失敗</h3>
            <p className="text-secondary-600 mb-4">
              無法取得填答記錄，請稍後再試。
            </p>
            <Button onClick={() => isSearchMode ? refetchUserResponses() : refetch()} variant="outline">
              重新載入
            </Button>
          </CardBody>
        </Card>
      ) : !displayData || displayData.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <FileText className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              {isSearchMode ? '未找到符合條件的記錄' : '尚無填答記錄'}
            </h3>
            <p className="text-secondary-600 mb-4">
              {isSearchMode 
                ? '此使用者 ID 尚未填寫任何問卷，或使用者 ID 不正確。'
                : '目前還沒有任何填答記錄，前往填寫問卷吧！'
              }
            </p>
            {!isSearchMode && (
              <Link
                href="/questionnaires"
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <span>前往問卷列表</span>
              </Link>
            )}
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-secondary-900">
              {isSearchMode 
                ? `使用者 "${searchUserId}" 的填答記錄 (${displayData.length} 筆)`
                : `填答記錄 (${pagination?.totalCount || displayData.length} 筆)`
              }
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {displayData.map((response: any) => (
              <Card key={response.id} className="hover:shadow-lg transition-shadow">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      {/* 問卷標題 */}
                      <div>
                        <h3 className="text-lg font-semibold text-secondary-900">
                          {response.questionnaire.title}
                        </h3>
                        {response.questionnaire.description && (
                          <p className="text-secondary-600 text-sm mt-1">
                            {response.questionnaire.description}
                          </p>
                        )}
                      </div>

                      {/* 填答資訊 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-secondary-500" />
                          <span className="text-secondary-600">
                            填答者：{response.user?.name || response.userId}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-secondary-500" />
                          <span className="text-secondary-600">
                            提交時間：{response.submitTime ? formatDateTime(response.submitTime) : '尚未提交'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              response.status
                            )}`}
                          >
                            {getStatusText(response.status)}
                          </span>
                        </div>
                      </div>

                      {/* 答案摘要 */}
                      <div className="text-sm text-secondary-600">
                        已回答 {response.answers?.length || 0} 個問題
                      </div>
                    </div>

                    {/* 操作按鈕 */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/my-responses/${response.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          檢視
                        </Button>
                      </Link>
                      {(response.status === ResponseStatus.DRAFT || response.status === ResponseStatus.COMPLETED) && (
                        <Link href={`/my-responses/${response.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            編輯
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* 分頁控制 */}
          {!isSearchMode && pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-8">
              <Button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage}
                variant="outline"
                size="sm"
              >
                上一頁
              </Button>
              <span className="text-sm text-secondary-600">
                第 {pagination.page} 頁，共 {pagination.totalPages} 頁
              </span>
              <Button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage}
                variant="outline"
                size="sm"
              >
                下一頁
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
