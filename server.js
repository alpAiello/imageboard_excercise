const express = require("express")
const db = require("./database");

const app= express();
exports.app = app;


app.use(express.static("public"))

app.get("/api/images", (req,res) => {
    db.getImages()
        .then((images)=>{
            const imageArray = images.rows
            const imageJSON = JSON.stringify(imageArray)
            res.send(imageJSON)

        })
        .catch(err=>console.log(err))
})

app.listen(8080)
