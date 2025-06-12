import apiClient from './api';
import { Response, SubmitResponseData, ApiResponse } from '@/types';

export const responseService = {
  // 取得所有填答記錄
  async getAll(params?: { page?: number; limit?: number }): Promise<{
    responses: Response[];
    pagination: {
      page: number;
      limit: number;
      totalCount: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }> {
    const response = await apiClient.get<ApiResponse<{
      responses: Response[];
      pagination: {
        page: number;
        limit: number;
        totalCount: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>>('/responses', { params });
    return response.data.data || { responses: [], pagination: { page: 1, limit: 20, totalCount: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
  },

  // 提交問卷回答
  async submit(data: SubmitResponseData): Promise<Response> {
    const response = await apiClient.post<ApiResponse<Response>>('/responses', data);
    if (!response.data.data) {
      throw new Error('Failed to submit response');
    }
    return response.data.data;
  },

  // 取得填答記錄
  async getById(id: string): Promise<Response | null> {
    try {
      const response = await apiClient.get<ApiResponse<Response>>(`/responses/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching response:', error);
      return null;
    }
  },

  // 取得使用者的填答記錄
  async getByUser(userId: string, formId?: string): Promise<Response[]> {
    const params = formId ? { formId } : {};
    const response = await apiClient.get<ApiResponse<Response[]>>(`/responses/user/${userId}`, { params });
    return response.data.data || [];
  },

  // 更新填答記錄
  async update(id: string, data: { answers: any[] }): Promise<Response> {
    const response = await apiClient.put<ApiResponse<Response>>(`/responses/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update response');
    }
    return response.data.data;
  },
};
