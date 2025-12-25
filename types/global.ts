export interface MetaData {
  total: number;
  limit: number;
}

export interface MutationProps<T = unknown> {
  method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';
  api: string;
  body?: T;
}

export interface QueryProps {
  api: string;
  revalidate?: number;
}

export interface BackendError {
  api: string;
  revalidate?: number;
}
