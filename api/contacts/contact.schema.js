const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  token: { type: String, required: true },
});

contactSchema.statics.createContact = createContact;
contactSchema.statics.getAllContacts = getAllContacts;
contactSchema.statics.updateContact = updateContact;
contactSchema.statics.getContactById = getContactById;
contactSchema.statics.deleteContact = deleteContact;
contactSchema.statics.findByEmail = findByEmail;
// contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function createContact(contactParams) {
  return this.create(contactParams);
}

async function getAllContacts() {
  return this.find();
}

async function getContactById(contactId) {
  return this.findById(contactId);
}

async function updateContact(contactId, contactParams) {
  return this.findByIdAndUpdate(
    contactId,
    {
      $set: contactParams,
    },
    { new: true }
  );
}

async function deleteContact(contactId) {
  return this.findByIdAndDelete(contactId);
}

async function findByEmail(email) {
  return this.findOne({ email });
}

// async function findContactByIdAndUpdate(contactId, updaeParams) {
//   return this.findByIdAndUpdate(
//     contactId,
//     { $set: updaeParams },
//     { new: true }
//   );
// }

const contactModel = mongoose.model("contact", contactSchema);

module.exports = contactModel;
