DROP TABLE IF EXISTS images;

CREATE TABLE images(
                       id SERIAL PRIMARY KEY,
                       username VARCHAR (20),
                       title VARCHAR(50) NOT NULL,
                       description TEXT,
                       url VARCHAR NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE comments(
                       id SERIAL PRIMARY KEY,
                       image_id INTEGER REFERENCES images(id),
                       username VARCHAR (20),
                       comment TEXT,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT * FROM images;
SELECT * FROM comments;
