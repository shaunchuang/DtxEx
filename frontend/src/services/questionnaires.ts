import apiClient from './api';
import { Questionnaire, ApiResponse } from '@/types';

export const questionnaireService = {
  // 取得所有問卷
  async getAll(): Promise<Questionnaire[]> {
    const response = await apiClient.get<ApiResponse<Questionnaire[]>>('/questionnaires');
    return response.data.data || [];
  },

  // 取得單一問卷
  async getById(id: string): Promise<Questionnaire | null> {
    try {
      const response = await apiClient.get<ApiResponse<Questionnaire>>(`/questionnaires/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
      return null;
    }
  },

  // 建立問卷
  async create(data: Partial<Questionnaire>): Promise<Questionnaire> {
    const response = await apiClient.post<ApiResponse<Questionnaire>>('/questionnaires', data);
    if (!response.data.data) {
      throw new Error('Failed to create questionnaire');
    }
    return response.data.data;
  },

  // 更新問卷
  async update(id: string, data: Partial<Questionnaire>): Promise<Questionnaire> {
    const response = await apiClient.put<ApiResponse<Questionnaire>>(`/questionnaires/${id}`, data);
    if (!response.data.data) {
      throw new Error('Failed to update questionnaire');
    }
    return response.data.data;
  },

  // 刪除問卷
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/questionnaires/${id}`);
  },
};
