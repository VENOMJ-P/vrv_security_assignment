const express = require("express");
const cors = require("cors");
const { PORT } = require("./config/serverConfig");

class App {
  constructor() {
    this.app = express();
    this.initializeMiddlewares();
  }

  initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
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
