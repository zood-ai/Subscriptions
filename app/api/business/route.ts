import Query from '@/lib/Query';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

interface GetResponse {
  id: string;
  reference: number;
  owner_email: string;
  end_at: string;
  created_at: string;
  name: string;
}

export async function GET() {
  const res = await Query<GetResponse[]>({
    api: 'v1/super-admin/business',
  });

  let response = res?.data?.map((el) => ({
    id: el.id,
    reference: el.reference,
    owner_email: el.owner_email,
    end_at: el.end_at
      ? dayjs(new Date(el.end_at)).format('YYYY-MM-DD HH:mm')
      : '',
    created_at: el.created_at
      ? dayjs(new Date(el.created_at)).format('YYYY-MM-DD HH:mm')
      : '',
    name: el.name,
  }));

  if (res.error) response = [];
  return NextResponse.json(response);
}
