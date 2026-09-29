import { NextRequest, NextResponse } from 'next/server';
import { dispatchV1GatewayRequest } from '@mailcare/api-gateway';

async function handleGatewayRoute(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const pathname = `/v1/${slug.join('/')}`;

  const headers: Record<string, string | undefined> = {};
  request.headers.forEach((val, key) => {
    headers[key.toLowerCase()] = val;
  });

  let parsedBody: Record<string, unknown> | undefined;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    try {
      parsedBody = (await request.json()) as Record<string, unknown>;
    } catch {
      parsedBody = undefined;
    }
  }

  const result = await dispatchV1GatewayRequest({
    method: request.method,
    pathname,
    headers,
    body: parsedBody,
  });

  return NextResponse.json(result.body, {
    status: result.status,
    headers: result.headers,
  });
}

export const GET = handleGatewayRoute;
export const POST = handleGatewayRoute;
export const PUT = handleGatewayRoute;
export const DELETE = handleGatewayRoute;
