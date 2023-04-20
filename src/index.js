const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); //Multer-Upload-Objekt; neue Multer Instanz wird erzeugt.
/*
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Nur PDF-Dateien sind erlaubt');
      error.code = 'LIMIT_FILE_TYPES';
      return cb(error, false);
    }
    cb(null, true);
  }
});
 -Nur Dateitypen als PDFs hochladen,
 => multer-Upload-Objekt konfigurieren und eine fileFilter-Funktion schreiben die nur PDF-Dateien zulässt
 -fileFilter-Funktion verwendet, dass nur Dateien mit dem MIME-Typ application/pdf hochgeladen werden
*/

app.use(bodyParser.json());
const port = 3000;

app.get("/", (req, res) => {
  res.json({ Name: "jipson" });
});

/*
-Multer-DiskStorage-Instanz, um den Speicherort 
 und den Dateinamen zu definieren an dem die hochgeladene Datei gespeichert wird

-Verzeichnis "uploads/date/id" mit dem ursprünglichen Dateinamen als Suffix.

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = `./uploads/${req.params.date}`;
    fs.mkdirSync(dir, { recursive: true });<--
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileName = `${req.params.id}${path.extname(file.originalname)}` 
    (in diesem Fall für pdf:  const fileName = `${req.params.id}.pdf`);
    cb(null, fileName);

  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.pdf');
  }
});

const upload = multer({ storage: storage });
*/

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

app.post("/upload", upload.single("document"), (req, res, next) => {
  console.log(req.file);
  next();
  // req.file is the `doc` file
  // req.body will hold the text fields, if there were any
  //upload.single technisch betrachtet die Middleware, vorherige Schritte ist Konfig.
});

/*--> POST-Route, um die PDF-Datei hochzuladen:
app.post('/upload', upload.single('pdf'), (req, res) => {
  res.send('PDF-Datei wurde erfolgreich hochgeladen!');
});<----

---> GET-Route, um die PDF-Datei basierend auf dem Datum und der ID zurückzugeben:
app.get('/download/:date/:id', (req, res) => {
  const date = req.params.date;
  const id = req.params.id;
  const filepath = `uploads/${date}/${id}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.sendFile(filepath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send('PDF-Datei nicht gefunden');
    }
  });
}); <-----

 */
//- PDF-Dateien im Ordner uploads gespeichert/ gespeichert /Datum und ID benannt

app.get("/upload/:id", (req, res) => {
  const id = req.params.id;
  const filepath = `${process.cwd()}/uploads/${id}`; // absoluter Pfad ()
  res.setHeader("Content-Type", "application/pdf");
  res.sendFile(filepath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("PDF-Datei nicht gefunden");
    }
    return filepath;
  });
});

app.delete("/upload/:id", (req, res) => {
  const id = req.params.id;
  const filepath = `${process.cwd()}/uploads/${id}`;

  fs.unlink(filepath, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("Datei nicht gefunden");
    } else {
      res.status(204).send("Datei wurde erfolgreich gelöscht");
    }
  });
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
