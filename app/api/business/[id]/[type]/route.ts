import Query from '@/lib/Query';
import { BusinessResponse } from '@/types/business';
import { NextResponse } from 'next/server';

interface Props {
  params: Promise<{
    id: string;
    type: 'suppliers' | 'devices' | 'users' | 'customers';
  }>;
}

export async function GET(request: Request, { params }: Props) {
  const { id, type } = await params;
  const res = await Query<{ data: BusinessResponse[typeof type][] }>({
    api: `v1/super-admin/business/${id}/${type}`,
  });

  if (res.error) {
    return NextResponse.json({
      meta: {},
      data: [],
    });
  }

  return NextResponse.json({
    meta: res?.data,
    data: res?.data?.data || [],
  });
}
