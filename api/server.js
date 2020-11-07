const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { contactsRouter } = require("./contacts/contacts.router");

const PORT = 3000;
const FRONTEND_URL = "http://localhost:3000";

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    this.handleErrors();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(cors({ origin: FRONTEND_URL }));
    this.server.use(morgan("tiny"));
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRouter);
  }

  handleErrors() {
    this.server.use((err, req, res, next) => {
      delete err.stack;

      return res.status(err.status).send(`${err.name}: ${err.message}`);
    });
  }

  initDatabase() {}

  startListening() {
    this.server.listen(PORT, () =>
      console.log("Server started listening on port:", PORT)
    );
  }
}

module.exports = {
  Server,
};
