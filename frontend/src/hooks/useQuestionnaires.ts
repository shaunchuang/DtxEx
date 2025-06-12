import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionnaireService } from '@/services/questionnaires';
import { Questionnaire } from '@/types';
import toast from 'react-hot-toast';

export const useQuestionnaires = () => {
  return useQuery({
    queryKey: ['questionnaires'],
    queryFn: questionnaireService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useQuestionnaire = (id: string) => {
  return useQuery({
    queryKey: ['questionnaire', id],
    queryFn: () => questionnaireService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionnaireService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast.success('問卷建立成功！');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '建立問卷失敗');
    },
  });
};

export const useUpdateQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Questionnaire> }) =>
      questionnaireService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      queryClient.invalidateQueries({ queryKey: ['questionnaire', variables.id] });
      toast.success('問卷更新成功！');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '更新問卷失敗');
    },
  });
};

export const useDeleteQuestionnaire = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: questionnaireService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questionnaires'] });
      toast.success('問卷刪除成功！');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '刪除問卷失敗');
    },
  });
};