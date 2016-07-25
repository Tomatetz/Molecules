var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');

var busboy = require('connect-busboy');
app.use(busboy());
//app.use(express.bodyParser());

app.use(bodyParser.json({limit: '50mb'}));
//app.use(express.static(__dirname));
app.use(express.static('./app'));
app.get('/', function (req, res) {
    fs.readFile('./app/index.html', 'utf8', function(err, text){
        res.send(text);
    });
});

app.post('/api/molecules', function(req, res) {
    //console.log(JSON.parse(JSON.stringify(req.body)));
    res.send(req.body);

    fs.writeFile('./files/molecules-list-' + 'temp'/*req.body.name*/ + '.bcd', JSON.stringify(req.body), function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});
app.post('/api/molecule', function(req, res){
    //console.log(JSON.parse(JSON.stringify(req.body)));
    res.send(req.body);

    fs.writeFile('./files/molecule-'+req.body.name+'.bcd', JSON.stringify(req.body), function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
});

app.post('/api/experiment', function(req, res){
    res.send(req.body);
});

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.post('/api/upload', upload.single('fileUploaded'), function(req, res){
    console.log('files:', req.file);
    if(req.file){
        res.send(req.file.buffer.toString('utf8'));
    }
});
app.post('/api/upload-list', upload.single('fileUploader'), function(req, res){
    if(req.file){
        res.send(req.file.buffer.toString('utf8'));
    }
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;