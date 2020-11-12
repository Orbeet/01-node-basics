const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const getContacts = require("./routing/getContacts");
const editContacts = require("./routing/editContacts");
require("dotenv").config();

// const URLdb =
const PORT = 3000;

// module.exports =
