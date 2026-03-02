const mongoose = require("mongoose"); // 🔥 FIXED IMPORT
const { PUBLIC_DATA } = require("../../constant");

const ConnectDB = async () => {
  try {
    if (!PUBLIC_DATA.mongo_uri) {
      throw new Error("MONGO URI is missing in PUBLIC_DATA");
    }

    await mongoose.connect(PUBLIC_DATA.mongo_uri, {
      serverSelectionTimeoutMS: 5000, // fail fast instead of buffering 10s
    });

    console.log(
      `✅ MongoDB Connected: ${mongoose.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // crash if DB fails (best practice)
  }
};

module.exports = { ConnectDB };