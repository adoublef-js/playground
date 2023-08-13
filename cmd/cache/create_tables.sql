DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id TEXT,
    PRIMARY KEY (id)
);
CREATE TABLE articles (
    id TEXT,
    content TEXT NOT NULL,
    user TEXT NOT NULL,
    FOREIGN KEY (user) REFERENCES users (id),
    PRIMARY KEY (id)
);
CREATE TABLE comments (
    id TEXT,
    content TEXT NOT NULL,
    user TEXT NOT NULL,
    article TEXT NOT NULL,
    FOREIGN KEY (user) REFERENCES users (id),
    FOREIGN KEY (article) REFERENCES articles (id),
    PRIMARY KEY (id)
);