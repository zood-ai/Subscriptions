import {
  QueryClient,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { AxiosResponse } from "axios";
import { useModal } from "@/context/ModalContext";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface UseCustomMutationProps<TBody, R> {
  api: string;
  method?: HttpMethod;
  options?: Omit<UseMutationOptions<R, AxiosResponse, TBody>, "mutationFn">;
  queryKeys?: string[];
}

const useCustomMutation = <TBody = void, TResponse = void>({
  api,
  method = "POST",
  options,
  queryKeys = [],
}: UseCustomMutationProps<TBody, TResponse>) => {
  const { close } = useModal();
  const queryClient = new QueryClient();

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
    onSuccess: (...rest) => {
      close();
      if (queryKeys.length > 0) {
        queryKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: [key] });
        });
      }
      if (options?.onSuccess) options?.onSuccess?.(...rest);
    },
    onError: (...rest) => {
      if (options?.onError) options?.onError?.(...rest);
    },
  });
};

export default useCustomMutation;
