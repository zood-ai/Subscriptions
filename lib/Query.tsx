import { useQuery, QueryKey } from '@tanstack/react-query';
import axiosInstance from '@/lib/axiosInstance';

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
      const response = await axiosInstance.get<R>(api, {
        params: filters,
        signal,
      });

      return response.data;
    },

    ...options,
  });
};

export default useCustomQuery;
