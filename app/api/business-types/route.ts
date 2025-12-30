import Query from '@/lib/Query';
import { BusinessType } from '@/types/business';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const res = await Query<{ data: BusinessType['businessType'][] }>({
    api: 'v1/super-admin/businessTypes',
    filters: Object.fromEntries(searchParams.entries()),
  });

  let response = res?.data?.data?.map((el) => ({
    id: el.id,
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
