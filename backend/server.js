require("dotenv").config();

const app = require("./src/app");
const { ConnectDB } = require("./src/config/db.config");

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await ConnectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();