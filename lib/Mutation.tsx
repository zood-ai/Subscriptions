import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axiosInstance from '@/guards/axiosInstance';
import { AxiosResponse } from 'axios';

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseCustomMutationProps<TBody, R> {
  api: string;
  method?: HttpMethod;
  options?: Omit<UseMutationOptions<R, AxiosResponse, TBody>, 'mutationFn'>;
}

const useCustomMutation = <TBody = void, TResponse = void>({
  api,
  method = 'POST',
  options,
}: UseCustomMutationProps<TBody, TResponse>) => {
  return useMutation<TResponse, AxiosResponse, TBody>({
    mutationFn: async (body) => {
      const response = await axiosInstance.request<TResponse>({
        url: api,
        method,
        data: body,
      });

      return response.data;
    },

    ...options,
  });
};

export default useCustomMutation;
