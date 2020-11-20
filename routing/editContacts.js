const express = require("express");
const router = express.Router();
const contactsActions = require("../controllers/actions");
const validations = require("../controllers/validation");

router.post("/", validations.validateRequest, contactsActions.addContact);

router.delete("/:contactId", contactsActions.removeContact);

router.patch(
  "/:contactId",
  validations.validateRequest,
  contactsActions.updateContact
);

module.exports = router;
