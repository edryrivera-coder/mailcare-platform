import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const idempotencyKey = request.headers.get('Idempotency-Key') ?? `idem_${Date.now()}`;
  const body = (await request.json()) as {
    action?: 'ARCHIVE' | 'DELETE' | 'UNSUBSCRIBE';
    messageIds?: string[];
  };

  const action = body.action ?? 'ARCHIVE';
  const count = body.messageIds?.length ?? 1;

  return NextResponse.json(
    {
      job_id: `BJ-2025-${Math.floor(10000 + Math.random() * 89999)}`,
      action,
      affected_count: count,
      idempotency_key: idempotencyKey,
      queue: action === 'UNSUBSCRIBE' ? 'consumer.unsubscribe' : 'consumer.mutations',
      rfc8058_one_click: action === 'UNSUBSCRIBE',
      audit_event: {
        event_id: `audit_${Math.random().toString(36).slice(2, 10)}`,
        action: `BULK_${action}`,
        result: 'SUCCESS',
        timestamp: new Date().toISOString(),
      },
    },
    { status: 202 }
  );
}
