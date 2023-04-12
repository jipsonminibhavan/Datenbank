const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
app.use(bodyParser.json());
const port = 3000;

app.get("/", (req, res) => {
  res.json({ Name: "jipson" });
});

app.get("/documents", async (req, res) => {
  const { Document } = require("./models/DocumentModel");
  const allDocs = await Document.find();
  res.json(allDocs);
  /*res.json([
    {
      id: 1,
      title: "How to get my food for lunch",
      keywords: ["lunch", "social"],
      file: {
        path: "/2/455/444/unbekannt1.pdf",
        size: "12MB", // <---
        format: "pdf", // <!---
        pages: 12, // <---
      },
      author: "Jipson",
      lastModified: 12345577,
      createdAt: 12345577,
    },
  ]);*/
});
app.post("/documents", async (req, res) => {
  try {
    const { Document } = require("./models/DocumentModel");
    console.log(req.body);
    const newDoc = new Document({
      title: req.body.title,
      keywords: req.body.keywords,
      author: req.body.author,
    });
    const insertedDoc = await newDoc.save();
    res.json(insertedDoc);
  } catch (error) {
    console.error(error);
    res.json({ msg: error });
  }
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/mongoose?authSource=admin"
    );
    app.listen(3000, () => console.log(`Example app listening on port 3000`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
