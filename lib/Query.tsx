import { useQuery, QueryKey } from "@tanstack/react-query";
import axiosInstance from "@/guards/axiosInstance";
import { AxiosResponse } from "axios";

export type QueryFilters = Record<string, number | string | boolean>;

interface QueryOptions<R, AxiosResponse> {
  onSuccess?: (data: R) => void;
  onError?: (error: AxiosResponse) => void;
}

interface Props<R> {
  queryKey: QueryKey;
  api: string;
  filters?: QueryFilters;
  enabled?: boolean;
  options?: QueryOptions<R, AxiosResponse>;
}

const useCustomQuery = <R,>({
  queryKey,
  api,
  filters = {},
  enabled = true,
  options,
}: Props<R>) => {
  return useQuery<R, AxiosResponse>({
    queryKey,
    enabled,

    queryFn: async () => {
      const response = await axiosInstance
        .get<R>(api, {
          params: filters,
        })
        .then((res) => {
          options?.onSuccess?.(res.data);
          return res.data;
        })
        .catch((error) => {
          options?.onError?.(error);
          throw error;
        });

      return response;
    },

    ...options,
  });
};

export default useCustomQuery;
