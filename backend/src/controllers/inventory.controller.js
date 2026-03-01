const inventoryService = require("../services/Inventory.service");

const getAllBatches = async (req, res, next) => {
  try {
    const { locationId, state } = req.query;

    const batches = await inventoryService.getAllBatches({
      locationId,
      state,
    });

    res.status(200).json({
      success: true,
      data: batches,
    });
  } catch (error) {
    next(error); // 🔥 IMPORTANT: don't send res manually
  }
};

const createBatch = async (req, res, next) => {
  try {
    const batch = await inventoryService.createBatch(req.body);

    res.status(201).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error); // 🔥 THIS PREVENTS "next is not a function" chain issues
  }
};

const updateBatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const batch = await inventoryService.updateBatch(id, req.body);

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

const activateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { offerPrice } = req.body;

    const batch = await inventoryService.activateOffer(id, offerPrice);

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

const deactivateOffer = async (req, res, next) => {
  try {
    const { id } = req.params;

    const batch = await inventoryService.deactivateOffer(id);

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBatches,
  createBatch,
  updateBatch,
  activateOffer,
  deactivateOffer,
};