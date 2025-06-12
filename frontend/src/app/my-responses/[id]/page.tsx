'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useResponse } from '@/hooks/useResponses';
import { Card, CardHeader, CardBody, Button } from '@/components/ui';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, FileText, Edit } from 'lucide-react';
import { formatDateTime } from '@/utils';
import { QuestionType, ResponseStatus } from '@/types';

export default function ResponseDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: response, isPending, error } = useResponse(id);

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
              抱歉，找不到您要檢視的填答記錄。可能該記錄已被刪除或您的連結有誤。
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

  const renderAnswerValue = (answer: any) => {
    if (answer.answerText) {
      return answer.answerText;
    }
    if (answer.answerDate) {
      return formatDateTime(answer.answerDate);
    }
    if (answer.selectedOptions && answer.selectedOptions.length > 0) {
      return answer.selectedOptions
        .map((opt: any) => opt.option.optionText)
        .join(', ');
    }
    return '未回答';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 頁面標題和導航 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/my-responses"
            className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>返回記錄列表</span>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/my-responses/${response.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              編輯答案
            </Button>
          </Link>
        </div>
      </div>

      {/* 填答記錄資訊 */}
      <Card>
        <CardHeader>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-secondary-900">
                {response.questionnaire.title}
              </h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  response.status
                )}`}
              >
                {getStatusText(response.status)}
              </span>
            </div>
            {response.questionnaire.description && (
              <p className="text-secondary-600">{response.questionnaire.description}</p>
            )}
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500">填答者</p>
                <p className="font-medium text-secondary-900">
                  {response.user.name} ({response.user.email})
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-secondary-500" />
              <div>
                <p className="text-sm text-secondary-500">提交時間</p>
                <p className="font-medium text-secondary-900">
                  {formatDateTime(response.submitTime)}
                </p>
              </div>
            </div>
          </div>

          {response.lastUpdateTime && (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm text-secondary-500">最後更新</p>
                  <p className="font-medium text-secondary-900">
                    {formatDateTime(response.lastUpdateTime)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* 問卷內容和答案 */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-secondary-900">填答內容</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-8">
            {response.questionnaire.sections.map((section) => (
              <div key={section.id} className="space-y-6">
                {(section.title || section.description) && (
                  <div className="border-l-4 border-primary-500 pl-4 space-y-1">
                    {section.title && (
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {section.title}
                      </h3>
                    )}
                    {section.description && (
                      <p className="text-secondary-600">{section.description}</p>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {section.questions
                    .filter((question) => question.questionType !== QuestionType.PARAGRAPH)
                    .map((question) => {
                      const answer = response.answers.find(
                        (ans) => ans.questionId === question.id
                      );

                      return (
                        <div
                          key={question.id}
                          className="border border-secondary-200 rounded-lg p-4 space-y-3"
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-primary-600 font-medium">Q.</span>
                            <div className="flex-1">
                              <p className="font-medium text-secondary-900">
                                {question.questionText}
                                {question.isRequired && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </p>
                              {question.description && (
                                <p className="text-sm text-secondary-600 mt-1">
                                  {question.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="pl-6">
                            <div className="bg-secondary-50 rounded p-3">
                              <p className="text-secondary-900">
                                <span className="text-primary-600 font-medium">A. </span>
                                {answer ? renderAnswerValue(answer) : (
                                  <span className="text-secondary-500 italic">未回答</span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
