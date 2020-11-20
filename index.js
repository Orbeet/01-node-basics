const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const getContacts = require("./routing/getContacts");
const editContacts = require("./routing/editContacts");
require("dotenv").config();

//--- mongodb atlas ------
// test_admin
// b7YrGuCRZRCP1TDZ

// mongodb+srv://test_admin:b7YrGuCRZRCP1TDZ@03-mongodb.o01mu.mongodb.net/db-contacts?retryWrites=true&w=majority

const URLdb = process.env.URLdb;
const PORT = process.env.PORT;

module.exports = class myMongoDBServer {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDataBase();
    this.startListening();
  }
  initServer = () => {
    this.server = express();
  };
  initMiddlewares = () => {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: true }));
    this.server.use(cors());
    this.server.use(morgan("combined"));
  };
  initRoutes = () => {
    this.server.use("/contacts", getContacts);
    this.server.use("/contacts", editContacts);
  };
  initDataBase = async () => {
    try {
      await mongoose.connect(URLdb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Database connection successful");
    } catch (error) {
      console.log("Connecting error:", error.message);
      process.exit(1);
    }
  };
  startListening = () => {
    this.server.listen(PORT, () => {
      console.log("myMongoDBServer listening on port:", PORT);
    });
  };
};
