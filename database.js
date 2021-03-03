const SPG = require("spiced-pg");
const dbUrl = "postgres://alessandroaiello@localhost:5432/image-board";
const db = SPG(dbUrl);

exports.getImages = (lastID, limit) => {
    return db.query(
        `
    SELECT * FROM images
    WHERE
        id < $1
    ORDER BY created_at DESC
    LIMIT
        $2
`, [lastID, limit]);
};

exports.getNumberAvailableImages = (lastID) => {
    return db.query(
        `
    SELECT 
        COUNT(id)
    FROM
        images
    WHERE
        id < $1;
`, [lastID]);
};

exports.getImage = (id) => {
    return db.query(
        `
    SELECT
        *
    FROM
        images
    WHERE
        images.id = $1;
        `
        ,[id]
    );
};

exports.addImage = (username, title, description, url) => {
    return db.query(
        `
        INSERT INTO 
            images (username, title, description, url)
        VALUES
            ($1, $2, $3, $4)
        RETURNING *;
`, [username, title, description, url]);};
