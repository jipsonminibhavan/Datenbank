const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    keywords: {
      type: Array,
    },
    author: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", DocumentSchema);

module.exports = { Document };
