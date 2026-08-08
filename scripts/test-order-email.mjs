// Quick SMTP sanity check: loads .env.local, verifies login, sends a test email.
// Run: node scripts/test-order-email.mjs
import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ORDER_NOTIFY_EMAIL } = env;
console.log('host:', SMTP_HOST, 'port:', SMTP_PORT, 'user:', SMTP_USER,
  'pass length:', (SMTP_PASS || '').length, 'to:', ORDER_NOTIFY_EMAIL);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || 'smtp.qq.com',
  port: Number(SMTP_PORT) || 465,
  secure: Number(SMTP_PORT || 465) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

try {
  await transporter.verify();
  console.log('SMTP login OK ✔');
} catch (err) {
  console.error('SMTP login FAILED ✘:', err.message);
  process.exit(1);
}

try {
  const info = await transporter.sendMail({
    from: `"Kimberry Test" <${SMTP_USER}>`,
    to: ORDER_NOTIFY_EMAIL || SMTP_USER,
    subject: 'Kimberry order email — SMTP test',
    text: 'If you can read this, order notification emails are working.',
  });
  console.log('Test email sent ✔ messageId:', info.messageId);
} catch (err) {
  console.error('Send FAILED ✘:', err.message);
  process.exit(1);
}
