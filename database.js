const SPG = require("spiced-pg");
const dbUrl = "postgres://alessandroaiello@localhost:5432/image-board";
const db = SPG(dbUrl);

exports.getImages = () => {
    return db.query(
        `
    SELECT
        *
    FROM
        images
`);};

exports.addImage = (username, title, description, url) => {
    return db.query(
        `
        INSERT INTO 
            images (username, title, description, url)
        VALUES
            ($1, $2, $3, $4)
        RETURNING *;
`, [username, title, description, url]);};
