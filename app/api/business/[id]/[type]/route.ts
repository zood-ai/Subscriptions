import { NextRequest, NextResponse } from 'next/server';
import Query from '@/lib/Query';
import { BusinessResponse } from '@/types/business';

const allowedTypes = ['suppliers', 'devices', 'users', 'customers'] as const;
type AllowedType = (typeof allowedTypes)[number];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; type: string }> }
) {
  const { id, type } = await context.params;

  if (!allowedTypes.includes(type as AllowedType)) {
    return NextResponse.json({ meta: {}, data: [] }, { status: 400 });
  }

  const res = await Query<{ data: BusinessResponse[AllowedType][] }>({
    api: `v1/super-admin/business/${id}/${type}`,
  });

  if (res.error) {
    return NextResponse.json({
      meta: {},
      data: [],
    });
  }

  return NextResponse.json({
    meta: res.data,
    data: res.data?.data || [],
  });
}
