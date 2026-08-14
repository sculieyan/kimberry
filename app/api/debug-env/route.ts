import { NextResponse } from 'next/server';

/**
 * TEMPORARY diagnostic endpoint — reports which env vars are present in
 * the SSR runtime (presence + length only, never values).
 * DELETE THIS FILE once the Stripe env issue is resolved.
 */
export async function GET() {
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
  return NextResponse.json(report);
}
