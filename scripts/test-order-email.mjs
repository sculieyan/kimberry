// Sends a sample order notification email using the real lib/order-email.ts
// module, so you can preview the exact layout in your inbox.
// Run: npx tsx --env-file=.env.local scripts/test-order-email.mjs
import { sendOrderNotificationEmail } from '../lib/order-email.ts';

const ok = await sendOrderNotificationEmail({
  orderRef: 'SAMPLE-PREVIEW',
  demo: true,
  customer: {
    email: 'jane.doe@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+64 21 123 4567',
    address: '12 Queen Street',
    city: 'Auckland',
    region: 'Auckland',
    postcode: '1010',
  },
  product: { name: 'Classic — Milk Oat Flakes', detail: '400g · 10 sachets', qty: 2, unitPrice: 19.9 },
  shipping: { name: 'Courier (1-3 working days)', code: 'COURIER', price: 6.5 },
  subtotal: 39.8,
  grandTotal: 46.3,
});

console.log(ok ? 'Sample order email sent ✔ — check your inbox' : 'Send skipped/failed ✘ — see warning above');
