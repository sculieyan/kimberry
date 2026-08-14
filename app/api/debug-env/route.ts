import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * TEMPORARY diagnostic endpoint — reports which env vars are present in
 * the SSR runtime (presence + length only, never values).
 * Append ?db=1 to also probe the database connection and surface the
 * real Prisma error (credentials are masked before returning).
 * DELETE THIS FILE once the deployment issues are resolved.
 */
export async function GET(request: Request) {
  const names = [
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'DATABASE_URL',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'ORDER_NOTIFY_EMAIL',
    'NZPOST_API_KEY',
  ];
  const report: Record<string, string> = {};
  for (const n of names) {
    const v = process.env[n];
    report[n] = v === undefined ? 'MISSING' : v.trim() === '' ? 'EMPTY' : `set (len ${v.length})`;
  }

  if (new URL(request.url).searchParams.get('db') === '1') {
    try {
      await prisma.$queryRaw`SELECT 1`;
      report._database = 'OK';
    } catch (err) {
      const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      report._database =
        'ERROR: ' +
        message
          .replace(/postgres(?:ql)?:\/\/[^@]+@/gi, 'postgresql://***@')
          .split('\n')
          .slice(0, 6)
          .join(' | ');
    }
  }

  return NextResponse.json(report);
}
