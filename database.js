const SPG = require("spiced-pg")
const dbUrl = "postgres://alessandroaiello@localhost:5432/image-board"
const db = SPG(dbUrl)

exports.getImages = () => {
    return db.query(
    `
    SELECT
        *
    FROM
        images
`)}
