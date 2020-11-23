const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./users/userRouter");
const contactsRouter = require("./contacts/contact.router");

require("dotenv").config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initUserRoutes();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    // this.server.use(express.static("public"));
    this.server.use("/images", express.static("public/images")); // add
    this.server.use(cors({ origin: `http://localhost:${process.env.PORT}` }));
  }
  initUserRoutes() {
    this.server.use("/api/user", userRouter);
  }
  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }
  async initDatabase() {
    mongoose.set("useCreateIndex", true);
    await mongoose.connect(
      process.env.MONGODB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
      },
      (err) => {
        if (err) {
          console.log("err");
          process.exit(1);
        }
        console.log("Database connection successful");
      }
    );
  }

  startListening() {
    const PORT = process.env.PORT;

    this.server.listen(PORT, () => {
      console.log("Server listening on port", PORT);
    });
  }
};
