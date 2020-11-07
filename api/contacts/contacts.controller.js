const fs = require("fs");
const path = require("path");

const contactsDB = path.join(__dirname, "./db/contacts.json");

class ContactsController {
  listContacts(req, res, next) {
    try {
      fs.readFile(contactsDB, "utf8", (err, data) => {
        if (err) throw err;
        return res.status(200).send(JSON.parse(data));
      });
    } catch (err) {
      next(err);
    }
  }

  getById(req, res, next) {
    try {
      const { contactId } = req.params;
      const idNumber = Number(contactId);
      fs.readFile(contactsDB, "utf8", (err, data) => {
        if (err) throw err;
        const contactsArray = JSON.parse(data);
        const searchedUser = contactsArray.find(({ id }) => id === idNumber);
        if (!searchedUser)
          return res.status(404).send({ message: "Not found" });
        return res.status(200).send(searchedUser);
      });
    } catch (err) {
      next(err);
    }
  }

  addContact(req, res, next) {
    const { name, email, phone } = req.body;

    try {
      fs.readFile(contactsDB, "utf8", (err, data) => {
        if (err) throw err;
        const contactsArray = JSON.parse(data);
        const allIds = contactsArray.map(({ id }) => id);
        const newId = Math.max(...allIds) + 1;
        const newContact = { id: newId, name, email, phone };
        const newData = JSON.stringify([...contactsArray, newContact]);

        fs.writeFile(contactsDB, newData, (err) => {
          if (err) throw err;
          return res.status(201).send(newContact);
        });
      });
    } catch (err) {
      next(err);
    }
  }

  validateAddContact(req, res, next) {
    const { name, email, phone } = req.body;
    if (!name) {
      return res.status(400).send({ message: "missing required name field" });
    }
    if (!email) {
      return res.status(400).send({ message: "missing required email field" });
    }
    if (!phone) {
      return res.status(400).send({ message: "missing required phone field" });
    }
    next();
  }

  removeContact(req, res, next) {
    const { contactId } = req.params;
    const idNumber = Number(contactId);

    try {
      fs.readFile(contactsDB, "utf8", (err, data) => {
        if (err) throw err;
        const contactsArray = JSON.parse(data);
        const searchedUser = contactsArray.find(({ id }) => id === idNumber);
        if (!searchedUser)
          return res.status(404).send({ message: "Not found" });

        const newData = JSON.stringify(
          contactsArray.filter(({ id }) => id !== idNumber)
        );

        fs.writeFile(contactsDB, newData, (err) => {
          if (err) throw err;
          return res.status(200).send({ message: "contact deleted" });
        });
      });
    } catch (err) {
      next(err);
    }
  }

  updateContact(req, res, next) {
    const { name, email, phone } = req.body;
    if (!name && !email && !phone) {
      return res.status(400).send({ message: "missing fields" });
    }

    const { contactId } = req.params;
    const idNumber = Number(contactId);

    try {
      fs.readFile(contactsDB, "utf8", (err, data) => {
        if (err) throw err;

        const contactsArray = JSON.parse(data);
        const searchedUser = contactsArray.find(({ id }) => id === idNumber);
        if (!searchedUser)
          return res.status(404).send({ message: "contact not found" });

        const searchedUserIndex = contactsArray.findIndex(
          ({ id }) => id === idNumber
        );

        const updatedContact = {
          ...searchedUser,
          ...req.body,
        };

        contactsArray[searchedUserIndex] = updatedContact;

        const newData = JSON.stringify(contactsArray);

        fs.writeFile(contactsDB, newData, (err) => {
          if (err) throw err;
          return res.status(200).send(updatedContact);
        });
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = {
  ContactsController: new ContactsController(),
};
