/* ------------------------------------------------------------------ */
/*  Order number generation                                            */
/*                                                                     */
/*  Format: KB-YYYYMMDD-XXXXX                                          */
/*    - date in Pacific/Auckland (NZT)                                 */
/*    - 5-char random suffix from an unambiguous alphabet              */
/*      (no 0/O, 1/I/L)                                                */
/*                                                                     */
/*  Generated once per order at checkout time and carried through      */
/*  Stripe session metadata → webhook → email → database, so the       */
/*  number is stable across webhook retries.                           */
/* ------------------------------------------------------------------ */

import { randomBytes } from "crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 unambiguous chars

export function generateOrderNumber(date: Date = new Date()): string {
  // en-CA gives YYYY-MM-DD directly
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Pacific/Auckland",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(date)
    .replaceAll("-", "");

  const bytes = randomBytes(5);
  let suffix = "";
  for (const b of bytes) suffix += ALPHABET[b % ALPHABET.length];

  return `KB-${ymd}-${suffix}`;
}
