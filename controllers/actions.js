const itemModel = require("../models/model");
exports.listContacts = async (req, res) => {
  try {
    const item = await itemModel.find();
    return res.status(200).json(item);
  } catch (error) {
    res.send(error);
  }
};
exports.getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const item = await itemModel.findOne({ id: contactId });
    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    res.send(error);
  }
};
exports.removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const item = await itemModel.findOneAndDelete({ id: contactId });
    if (item) {
      res.status(200).send({ message: "contact deleted" });
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
exports.addContact = async (req, res, next) => {
  try {
    const item = await itemModel.create(req.body);
    return res.status(200).json(item);
  } catch (error) {
    next(error);
  }
};
exports.updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const newProperties = req.body;

    const item = await itemModel.findOneAndUpdate(
      { id: contactId },
      { $set: newProperties },
      { new: true }
    );
    if (item) {
      res.status(200).json(item);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
};
