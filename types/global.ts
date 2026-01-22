export interface MetaData {
  from: number;
  last_page: number;
  to: number;
  total: number;
  current_page: number;
}

export interface MutationProps<T = unknown> {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  api: string;
  body?: T;
}

export interface QueryProps {
  api: string;
}
