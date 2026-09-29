// ============================================================================
// STANDALONE NODE.JS API GATEWAY SERVER (Sec. 4, 39)
// ============================================================================

import http from 'node:http';
import { dispatchV1GatewayRequest } from './router';

const PORT = Number(process.env.API_GATEWAY_PORT ?? 4000);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk));
  }
  const rawBody = Buffer.concat(chunks).toString('utf-8');
  let parsedBody: Record<string, unknown> | undefined;
  if (rawBody) {
    try {
      parsedBody = JSON.parse(rawBody) as Record<string, unknown>;
    } catch {
      parsedBody = undefined;
    }
  }

  const normalizedHeaders: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    normalizedHeaders[k.toLowerCase()] = Array.isArray(v) ? v[0] : v;
  }

  const result = await dispatchV1GatewayRequest({
    method: req.method ?? 'GET',
    pathname: url.pathname,
    headers: normalizedHeaders,
    body: parsedBody,
  });

  res.writeHead(result.status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...result.headers,
  });
  res.end(JSON.stringify(result.body, null, 2));
});

if (import.meta.url === `file://${process.argv[1]}`) {
  server.listen(PORT, () => {
    console.log(`[MailCare API Gateway] Listening on http://localhost:${PORT}/v1`);
  });
}

export { server };
