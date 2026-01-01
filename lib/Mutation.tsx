import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import axiosInstance from '@/guards/axiosInstance';
import { AxiosError, AxiosResponse } from 'axios';

export type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Define the error response structure from your backend
interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Custom error type that extends AxiosError

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
