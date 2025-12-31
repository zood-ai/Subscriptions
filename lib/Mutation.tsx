import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface UseCustomMutationProps<TBody, R> {
  api: string;
  method?: HttpMethod;
  options?: UseMutationOptions<R, Error, TBody>;
}

const useCustomMutation = <TBody=void, TResponse=void>({
  api,
  method = 'POST',
  options,
}: UseCustomMutationProps<TBody, TResponse>) => {
  return useMutation<TResponse, Error, TBody>({
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
