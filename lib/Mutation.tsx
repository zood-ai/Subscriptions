import { cookies } from 'next/headers';
import axios, { AxiosRequestConfig } from 'axios';
import { redirect } from 'next/navigation';
import { MutationProps } from '@/types/global';

const Mutation = async <Body, Response>({
  method,
  api,
  body,
}: MutationProps<Body>): Promise<{
  data: Response | null;
  error: string | null;
  status: number;
}> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const config: AxiosRequestConfig = {
      method,
      url: `${process.env.BE_BASE_URL}/${api}`,
      headers: {},
      data: body,
      withCredentials: true,
    };

    if (!(body instanceof FormData) && body) {
      config.headers!['Content-Type'] = 'application/json';
    }

    if (token) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }

    const res = await axios.request<Response>(config);

    return { data: res.data, error: null, status: res.status };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        const cookieStore = await cookies();
        cookieStore.delete('token');
        redirect('/login');
      }

      const errorMsg =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        'Network error';

      return {
        data: null,
        error: String(errorMsg),
        status: err.response?.status ?? 400,
      };
    }

    if (err instanceof Error) {
      return {
        data: null,
        error: err.message,
        status: 500,
      };
    }

    return {
      data: null,
      error: 'Unknown error',
      status: 500,
    };
  }
};

export default Mutation;
