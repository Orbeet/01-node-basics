const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.set("useFindAndModify", false);
const itemSchema = new Schema({
  id: { type: Number },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});
const itemModel = mongoose.model("collection_for_hws", itemSchema);
module.exports = itemModel;
