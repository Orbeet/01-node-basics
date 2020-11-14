const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./users/user.router");

require("dotenv").config();

// const PORT = 3000;
// const MONGODB_URL =
//   "mongodb+srv://test_admin:b7YrGuCRZRCP1TDZ@03-mongodb.o01mu.mongodb.net/db-contacts?retryWrites=true&w=majority";

module.exports = class UserServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use("/users", userRouter);
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  startListening() {
    const PORT = process.env.PORT;

    this.server.listen(PORT, () => {
      console.log("Server started listening on port", PORT);
    });
  }
};
