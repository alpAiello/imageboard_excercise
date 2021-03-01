const express = require("express");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require("./database");
const s3 = require("./s3");

const app = express();
exports.app = app;

app.use(express.static("public"));
app.use(express.static("uploads"));

const diskStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        const destinationDirectory = __dirname + "/uploads";
        callback(null, destinationDirectory);
    },
    filename: (request, file, callback) => {
        uidSafe(24).then((uuid) => {
            const originalExtension = path.extname(file.originalname);
            const filename = uuid + originalExtension;
            callback(null, filename);
        });
    },
});
const uploader = multer({
    limits: {
        fileSize: 5242880,
    },
    storage: diskStorage,
});

app.get("/api/images", (req, res) => {
    db.getImages()
        .then((images) => {
            const imageArray = images.rows;
            const imageJSON = JSON.stringify(imageArray);
            res.send(imageJSON);
        })
        .catch((err) => console.log(err));
});

app.get("/api/image/:id", (req, res) => {
    console.log(req.params.id);
    db.getImage(req.params.id)
        .then((image) => {
            console.log(image.rows[0]);
            const imageData = image.rows[0];
            const imageJSON = JSON.stringify(imageData);
            res.send(imageJSON);
        })
        .catch((err) => console.log(err));
});

app.post("/api/upload", uploader.single("file"), (req, res) => {
    s3.uploadFile(req.file)
        .then((result) => {
            console.log('S3 result', result);
            const fileURL = s3.getS3URL(req.file.filename);
            db.addImage(req.body.username, req.body.title, req.body.description,fileURL)
                .then(data => {
                    console.log(data.rows[0]);
                    res.send(data.rows[0]);
                });
        });
});

app.listen(8080);
