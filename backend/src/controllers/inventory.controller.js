const inventoryService = require("../services/Inventory.service");

//
// 🔥 GET ALL BATCHES
//

const getAllBatches = async (req, res) => {
  try {
    const { locationId, state } = req.query;

    const batches = await inventoryService.getAllBatches({
      locationId,
      state
    });

    res.status(200).json({
      success: true,
      data: batches
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🔥 CREATE BATCH
//

const createBatch = async (req, res) => {
  try {
    const batch = await inventoryService.createBatch(req.body);

    res.status(201).json({
      success: true,
      data: batch
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🔥 UPDATE BATCH
//

const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await inventoryService.updateBatch(
      id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: batch
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🔥 ACTIVATE OFFER
//

const activateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { offerPrice } = req.body;

    const batch = await inventoryService.activateOffer(
      id,
      offerPrice
    );

    res.status(200).json({
      success: true,
      data: batch
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🔥 DEACTIVATE OFFER
//

const deactivateOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const batch = await inventoryService.deactivateOffer(id);

    res.status(200).json({
      success: true,
      data: batch
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//
// 🔥 EXPORTS
//

module.exports = {
  getAllBatches,
  createBatch,
  updateBatch,
  activateOffer,
  deactivateOffer
};