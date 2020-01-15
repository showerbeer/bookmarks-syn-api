const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const server = express();
const bookmarksFolder = path.join(__dirname, 'files');

// Enable body parser
server.use(bodyParser.json());
server.use(cors());
server.use(morgan('combined'));

server.get('/bookmarks', (req, res) => {
    fs.readdir(bookmarksFolder, (err, files) => {
        if (err) {
            res.status(500).send('Could not read bookmarks directory');
        }

        const mostRecent = files.sort().shift();
        const mostRecentPath = path.join(bookmarksFolder, mostRecent);
        fs.readFile(mostRecentPath, (err, data) => {
            if (err) {
                res.status(500).send('Could not read file');
            }

            res.status(200).send(JSON.parse(data));
        })
    })
});

server.post('/bookmarks', (req, res) => {
    const reqBody = req.body;
    const newFileName = `bookmarks_${Date.now()}.json`;
    const savePath = `${bookmarksFolder}/${newFileName}`;
    fs.writeFile(savePath, JSON.stringify(reqBody, null, 2), err => {
        if (err) {
            console.error(e);
            res.status(500).send('Could not create file');
        }

        res.status(201).send('File created');
    });
});

server.listen(3000);