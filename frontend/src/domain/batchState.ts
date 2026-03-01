// src/domain/batchState.ts
export type BatchState =
  | "available"
  | "near_expiry"
  | "in_offer"
  | "expired"
  | "sold_out";

export const getBatchState = (batch: any): BatchState => {
  const now = new Date();
  const expiration = new Date(batch.expirationDate);

  if (batch.quantity === 0) return "sold_out";
  if (expiration < now) return "expired";

  const hoursLeft =
    (expiration.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (batch.offerPrice) return "in_offer";
  if (hoursLeft < 24) return "near_expiry";

  return "available";
};