const express = require("express")
const multer = require("multer")
const uidSafe = ("uid-safe")
const path = ("path")
const db = require("./database");

const app= express();
exports.app = app;

app.use(express.static("public"))

const diskStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        const destinationDirectory = __dirname + "/uploads";
        callback(null, destinationDirectory);
    },
    filename: (request, file, callback) => {
        uidSafe(24).then(uid => {
            const originalExtension = path.extname(file.originalname)
            const filename = uid + originalExtension;
            callback(null, filename)
        })
    }
})
const uploader = multer({
    limits: {
        fileSize: 5242880,
    },
    storage: diskStorage
})

app.get("/api/images", (req,res) => {
    db.getImages()
        .then((images)=>{
            const imageArray = images.rows
            const imageJSON = JSON.stringify(imageArray)
            res.send(imageJSON)

        })
        .catch(err=>console.log(err))
})

app.post("/api/upload",uploader.single("file"),(req,res) =>{
})

app.listen(8080)
