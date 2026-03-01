const express = require("express");
const router = express.Router();
const Location = require("../models/location.models");

// 🔥 GET ALL LOCATIONS (REQUIRED for dashboard dropdown)
router.get("/", async (req, res) => {
  try {
    // Only active locations (real business logic)
    const locations = await Location.find({ status: "active" }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Locations fetched successfully",
      data: locations, // frontend expects data array
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔍 GET SINGLE LOCATION (optional but professional)
router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({
      message: "Location fetched successfully",
      data: location,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➕ ADD NEW LOCATION
router.post("/add", async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        message: "Name and type are required",
      });
    }

    const newLocation = new Location({
      name,
      type,
      status: "active", // default business logic
    });

    await newLocation.save();

    res.status(201).json({
      message: "Location added successfully",
      data: newLocation,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ UPDATE LOCATION STATUS (nice for internal panels)
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({
      message: "Location updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE LOCATION (optional admin feature)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.status(200).json({
      message: "Location deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;