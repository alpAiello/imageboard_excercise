const express = require("express");
var bodyParser = require('body-parser');
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const db = require("./database");
const s3 = require("./s3");


const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
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

app.get("/api/images/:lastID/:limit", (req, res) => {
    const limit = req.params.limit;
    const getImages = db.getImages(req.params.lastID, limit);
    getImages
        .then((images)=>{
            console.log("imagesRow0", images.rows);
            const imageArray = images.rows;
            const lastID = images.rows[images.rows.length - 1].id;
            const getNumberAvailableImages = db.getNumberAvailableImages(lastID);
            getNumberAvailableImages.then((rest)=>{
                const restImages = Number(rest.rows[0].count);
                const imagesObject = {"imageArray": imageArray,'lastID': lastID, "restImages": restImages};
                console.log("imagesObject------>", imagesObject);
                const imagesJSON = JSON.stringify(imagesObject);
                res.send(imagesJSON);
            });
        })
        .catch((err) => console.log(err));
});

app.get("/api/comments/:imageID", (req, res) => {
    const imageID = req.params.imageID;
    console.log(imageID);
    const getComments = db.getComments(imageID);
    getComments
        .then((comments)=>{
            console.log(comments);
            res.send(comments);
        })
        .catch((err) => console.log(err));
});

app.post("/api/comment", (req, res) => {
    console.log(req.body);
    const {comment, userName, imageID} = req.body;
    console.log(comment);
    console.log(userName);
    console.log(imageID);
    const addComment = db.addComment(comment, userName, imageID);
    addComment
        .then((comment)=>{
            console.log(comment);
            res.send(comment);
        })
        .catch(err=>err);
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
