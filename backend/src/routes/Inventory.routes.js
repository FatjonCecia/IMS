const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory.controller");
const Authentication = require("../middlewares/Authentication");

router.use(Authentication);

router.get("/batches", inventoryController.getAllBatches);
router.post("/batches", inventoryController.createBatch);
router.patch("/batches/:id", inventoryController.updateBatch);
router.post("/batches/:id/activate-offer", inventoryController.activateOffer);
router.post("/batches/:id/deactivate-offer", inventoryController.deactivateOffer);

module.exports = router;