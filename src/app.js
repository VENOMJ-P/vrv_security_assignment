const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/serverConfig");
const apiRoutes = require("../src/routes/index");

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  initializeRoutes() {
    this.app.use("/api", apiRoutes);
  }

  initializeServer() {
    try {
      this.app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }
}

const app = new App();
app.initializeServer();
