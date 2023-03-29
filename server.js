// dependencies
const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

// read and write files asynchronously
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// set up server
const app = express();
const PORT = process.env.PORT || 3000;

// express.urlencoded is a method built into express that recognizes a Request Object as strings or arrays
// extended: true allows for objects to be passed in the URL
app.use(express.urlencoded({ extended: true }));
// express.json is a method built into express that recognizes Request Object as JSON
app.use(express.json());

// middleware to access static files
app.use(express.static('public'));
