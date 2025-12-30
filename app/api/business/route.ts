import Query from '@/lib/Query';
import { BusinessData } from '@/types/business';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const res = await Query<{ data: BusinessData[] }>({
    api: 'v1/super-admin/business',
    filters: Object.fromEntries(searchParams.entries()),
  });
  console.log({ res });

  let response = res?.data?.data?.map((el) => ({
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
  return NextResponse.json({
    meta: res.data,
    data: response,
  });
}
