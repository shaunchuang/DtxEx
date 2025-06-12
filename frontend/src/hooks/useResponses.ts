import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { responseService } from '@/services/responses';
import { SubmitResponseData } from '@/types';
import toast from 'react-hot-toast';

export const useAllResponses = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['allResponses', params],
    queryFn: () => responseService.getAll(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useResponse = (id: string) => {
  return useQuery({
    queryKey: ['response', id],
    queryFn: () => responseService.getById(id),
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUserResponses = (userId: string) => {
  return useQuery({
    queryKey: ['userResponses', userId],
    queryFn: () => responseService.getByUser(userId),
    enabled: false, // 預設不自動查詢，需要手動觸發
    staleTime: 1 * 60 * 1000,
  });
};

export const useSubmitResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: responseService.submit,
    onSuccess: (response, data) => {
      queryClient.invalidateQueries({ queryKey: ['userResponses', data.userId] });
      toast.success('問卷提交成功！');
    },
    onError: (error: any) => {
      console.error('提交問卷失敗:', error);
      toast.error(error.response?.data?.message || '提交問卷失敗，請稍後再試');
    },
  });
};

export const useUpdateResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { answers: any[] } }) =>
      responseService.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ['response', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['userResponses', response.userId] });
      toast.success('問卷更新成功！');
    },
    onError: (error: any) => {
      console.error('更新問卷失敗:', error);
      toast.error(error.response?.data?.message || '更新問卷失敗，請稍後再試');
    },
  });
};
