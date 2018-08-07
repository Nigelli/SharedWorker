var express = require('express');
var app = express();

app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/main.html');
})

app.get('/slave', (req, res, next) => {
    res.sendFile(__dirname + '/slave.html');
})

app.use(express.static('public'));

app.listen(8000);