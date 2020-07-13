const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'button')));
app.get('/button', function(req,res) {
  res.sendFile(path.join(__dirname, 'button', 'index.html'));
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

var Users = require('./routes/Users');
var Admin = require('./routes/Admin');
app.use('/users', Users);
app.use('/admin', Admin);
app.listen(port);

