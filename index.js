const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const uuidv1 = require('uuid/v1');
const AWS = require("aws-sdk");
dotenv.config();

const server = express();

// Set AWS config
AWS.config.update({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    region: 'ap-southeast-2'
});

const dynamo = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true
});


// Enable body parser
server.use(bodyParser.json());
server.use(cors());
server.use(morgan('combined'));

server.get('/bookmarks', (req, res) => {
    dynamo.scan({
        TableName: 'Bookmarks'
    }, (err, data) => {
        if(err) {
            console.error('Failed to query DynamoDB', err);
            res.status(500).send('Could not query database');
        } else {
            console.log('Query successful');
            res.status(200).send(data.Items[0]);
        }
    });
});

server.post('/bookmarks', (req, res) => {
    const reqBody = {...req.body, id: uuidv1() };
    dynamo.put({
        TableName: 'Bookmarks',
        Item: reqBody
    }, (err, data) => {
        if(err) {
            console.error('Failed to PUT to DynamoDB instance', err);
            res.status(500).send('Could not create file');
        } else {
            console.log('Put successful')
            res.status(201).send(data);
        }
    });
});

server.listen(3000);