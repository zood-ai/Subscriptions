import { useQuery, QueryKey } from '@tanstack/react-query';
import axiosInstance from '@/guards/axiosInstance';

export type QueryFilters = Record<string, number | string | boolean>;

interface QueryOptions<R, Error> {
  onSuccess?: (data: R) => void;
  onError?: (error: Error) => void;
}

interface Props<R> {
  queryKey: QueryKey;
  api: string;
  filters?: QueryFilters;
  enabled?: boolean;
  options?: QueryOptions<R, Error>;
}

const useCustomQuery = <R,>({
  queryKey,
  api,
  filters = {},
  enabled = true,
  options,
}: Props<R>) => {
  return useQuery<R, Error>({
    queryKey,
    enabled,

    queryFn: async ({ signal }) => {
      const response = await axiosInstance
        .get<R>(api, {
          params: filters,
          signal,
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
