const express = require("express");
const router = express.Router();
const contactsActions = require("../controllers/actions");

router.get("/", contactsActions.listContacts);
router.get("/:contactId", contactsActions.getContactById);

module.exports = router;
