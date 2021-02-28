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

exports.addImage = (title, description, url) => {
    return db.query(
        `
        INSERT INTO 
            images (title, description, url)
        VALUES
            ($1, $2, $3)
        RETURNING title, description, url;
`, [title, description, url]);};
