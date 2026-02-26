const express = require("express");
const router = express.Router();
const Location = require("../models/location.models"); // path to your Location model

// Add a new location
router.post("/add", async (req, res) => {
  try {
    const { name, type } = req.body;

    const newLocation = new Location({ name, type });
    await newLocation.save();

    res.status(201).json({ message: "Location added!", location: newLocation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;