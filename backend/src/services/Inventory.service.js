const mongoose = require("mongoose");
const ItemBatch = require("../models/itemBatch.models");
const Location = require("../models/location.models");

//
// 🔥 STATE COMPUTATION
//
function computeState(batch) {
  const now = new Date();

  if (batch.quantity === 0) return "sold_out";
  if (now > batch.expirationDate) return "expired";
  if (batch.manualOverride === "in_offer") return "in_offer";

  const diff = batch.expirationDate - now;
  if (diff < 24 * 60 * 60 * 1000) return "near_expiry";

  return "available";
}

//
// 🔥 GET ALL BATCHES
//
async function getAllBatches(filters = {}) {
  const { locationId, state } = filters;
  const query = {};

  if (locationId && mongoose.Types.ObjectId.isValid(locationId)) {
    query.locationId = locationId;
  }

  const batches = await ItemBatch.find(query).populate("locationId");

  const result = batches.map((batch) => {
    const obj = batch.toObject();

    return {
      ...obj,
      id: obj._id, // 🔥 IMPORTANT for frontend (you use batch.id)
      state: computeState(batch),
    };
  });

  if (state) {
    return result.filter((b) => b.state === state);
  }

  return result;
}

//
// 🔥 CREATE BATCH (FIXED 500 ERROR)
//
async function createBatch(data) {
  const { title, quantity, basePrice, expirationDate, locationId } = data;

  // 🔒 Validate required fields
  if (!title || !locationId || !expirationDate) {
    throw new Error("Missing required fields");
  }

  // 🔒 Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(locationId)) {
    throw new Error("Invalid locationId");
  }

  // 🔒 Check location exists
  const location = await Location.findById(locationId);
  if (!location) {
    throw new Error("Location not found");
  }

  // 🔒 Ensure future expiration (matches your schema)
  const expDate = new Date(expirationDate);
  if (expDate <= new Date()) {
    throw new Error("Expiration date must be in the future");
  }

  const batch = await ItemBatch.create({
    title,
    quantity: Number(quantity),
    basePrice: Number(basePrice),
    expirationDate: expDate,
    locationId,
  });

  const obj = batch.toObject();

  return {
    ...obj,
    id: obj._id, // 🔥 CRITICAL for React table actions
    state: computeState(batch),
  };
}

//
// 🔥 UPDATE BATCH
//
async function updateBatch(batchId, updates) {
  if (!mongoose.Types.ObjectId.isValid(batchId)) {
    throw new Error("Invalid batch id");
  }

  const batch = await ItemBatch.findById(batchId);
  if (!batch) throw new Error("Batch not found");

  Object.assign(batch, updates);
  await batch.save();

  const obj = batch.toObject();

  return {
    ...obj,
    id: obj._id,
    state: computeState(batch),
  };
}

//
// 🔥 ACTIVATE OFFER
//
async function activateOffer(batchId, offerPrice) {
  const batch = await ItemBatch.findById(batchId);
  if (!batch) throw new Error("Batch not found");

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

  const obj = batch.toObject();

  return {
    ...obj,
    id: obj._id,
    state: computeState(batch),
  };
}

//
// 🔥 DEACTIVATE OFFER
//
async function deactivateOffer(batchId) {
  const batch = await ItemBatch.findById(batchId);
  if (!batch) throw new Error("Batch not found");

  batch.offerPrice = null;
  batch.manualOverride = null;

  await batch.save();

  const obj = batch.toObject();

  return {
    ...obj,
    id: obj._id,
    state: computeState(batch),
  };
}

module.exports = {
  computeState,
  getAllBatches,
  createBatch,
  updateBatch,
  activateOffer,
  deactivateOffer,
};