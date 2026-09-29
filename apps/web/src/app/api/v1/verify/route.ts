import { NextRequest, NextResponse } from 'next/server';
import { evaluateEmailPipeline } from '@/lib/mailcare-data';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = body.email ?? '';
    const result = evaluateEmailPipeline(email);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'X-Correlation-Id': `req_${Math.random().toString(36).slice(2, 10)}`,
        'X-Engine-Version': result.processing.engineVersion,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'SYNTAX_ERROR',
          message: 'Invalid verification request payload',
          request_id: `req_${Math.random().toString(36).slice(2, 10)}`,
        },
      },
      { status: 400 }
    );
  }
}
