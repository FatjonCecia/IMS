// src/domain/batchState.ts

export type BatchState =
  | "available"
  | "near_expiry"
  | "in_offer"
  | "expired"
  | "sold_out";

/**
 * 🔥 CRITICAL:
 * - Uses backend derived state FIRST (best architecture)
 * - Falls back to local computation only if state missing
 * - Matches your Node.js computeState() logic exactly
 */
export const getBatchState = (batch: any): BatchState => {
  // ✅ 1. TRUST BACKEND STATE (MOST IMPORTANT)
  if (batch.state) {
    return batch.state as BatchState;
  }

  const now = new Date();
  const expiration = new Date(batch.expirationDate);

  // Safety check
  if (isNaN(expiration.getTime())) {
    return "available";
  }

  // ✅ 2. SOLD OUT (highest priority)
  if (batch.quantity === 0) {
    return "sold_out";
  }

  // ✅ 3. EXPIRED (cannot be reversed - business rule)
  if (expiration < now) {
    return "expired";
  }

  // ✅ 4. MANUAL OFFER OVERRIDE (matches backend logic)
  if (batch.manualOverride === "in_offer") {
    return "in_offer";
  }

  // Fallback if manualOverride not present but offerPrice exists
  if (
    batch.offerPrice !== null &&
    batch.offerPrice !== undefined
  ) {
    return "in_offer";
  }

  // ✅ 5. NEAR EXPIRY (< 24h)
  const hoursLeft =
    (expiration.getTime() - now.getTime()) /
    (1000 * 60 * 60);

  if (hoursLeft < 24) {
    return "near_expiry";
  }

  // ✅ 6. DEFAULT
  return "available";
};