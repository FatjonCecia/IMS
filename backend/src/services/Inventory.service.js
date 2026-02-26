const ItemBatch = require("../models/itemBatch.models");
const Location = require("../models/location.models");

//
// 🔥 STATE COMPUTATION
//

function computeState(batch) {
  const now = new Date();

  if (batch.quantity === 0) return "sold_out";

  if (now > batch.expirationDate) return "expired";

  if (batch.manualOverride === "in_offer")
    return "in_offer";

  const diff = batch.expirationDate - now;

  if (diff < 24 * 60 * 60 * 1000)
    return "near_expiry";

  return "available";
}

//
// 🔥 GET ALL BATCHES (with filtering)
//

async function getAllBatches(filters = {}) {
  const { locationId, state } = filters;

  const query = {};

  if (locationId) {
    query.locationId = locationId;
  }

  const batches = await ItemBatch.find(query).populate("locationId");

  const batchesWithState = batches.map((batch) => {
    const computedState = computeState(batch);

    return {
      ...batch.toObject(),
      state: computedState
    };
  });

  // Filter by state (after computing it)
  if (state) {
    return batchesWithState.filter(
      (batch) => batch.state === state
    );
  }

  return batchesWithState;
}

//
// 🔥 CREATE BATCH
//

async function createBatch(data) {
  const location = await Location.findById(data.locationId);

  if (!location)
    throw new Error("Location not found");

  const batch = await ItemBatch.create(data);

  return {
    ...batch.toObject(),
    state: computeState(batch)
  };
}

//
// 🔥 UPDATE BATCH
//

async function updateBatch(batchId, updates) {
  const batch = await ItemBatch.findById(batchId);

  if (!batch)
    throw new Error("Batch not found");

  Object.assign(batch, updates);

  await batch.save();

  return {
    ...batch.toObject(),
    state: computeState(batch)
  };
}

//
// 🔥 ACTIVATE OFFER
//

async function activateOffer(batchId, offerPrice) {
  const batch = await ItemBatch.findById(batchId);

  if (!batch)
    throw new Error("Batch not found");

  const state = computeState(batch);

  if (state === "expired")
    throw new Error("Cannot activate offer on expired batch");

  if (batch.quantity === 0)
    throw new Error("Cannot activate offer with zero quantity");

  if (offerPrice >= batch.basePrice)
    throw new Error("Offer price must be lower than base price");

  batch.offerPrice = offerPrice;
  batch.manualOverride = "in_offer";

  await batch.save();

  return {
    ...batch.toObject(),
    state: computeState(batch)
  };
}

//
// 🔥 DEACTIVATE OFFER
//

async function deactivateOffer(batchId) {
  const batch = await ItemBatch.findById(batchId);

  if (!batch)
    throw new Error("Batch not found");

  batch.offerPrice = null;
  batch.manualOverride = null;

  await batch.save();

  return {
    ...batch.toObject(),
    state: computeState(batch)
  };
}

//
// 🔥 EXPORTS
//

module.exports = {
  computeState,
  getAllBatches,
  createBatch,
  updateBatch,
  activateOffer,
  deactivateOffer
};