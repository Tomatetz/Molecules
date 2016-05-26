var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var path = require('path');
var multer = require('multer');

var busboy = require('connect-busboy');
app.use(busboy());
//app.use(express.bodyParser());

app.use(bodyParser.json());
//app.use(express.static(__dirname));
app.use(express.static('./app'));
app.get('/', function (req, res) {
    fs.readFile('./app/index.html', 'utf8', function(err, text){
        res.send(text);
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
    //var file = ('./files/1.bcd');
    //
    //var filename = path.basename(file);
    //var mimetype = 'application/json';
    //
    //res.setHeader('Content-disposition', 'attachment; filename=32r');
    //res.setHeader('Content-type', 'application/json');
    //
    //var filestream = fs.createReadStream(file);
    //filestream.pipe(res);
    //console.log(res);
    //res.on('finish', function () { console.log(123); });
    //res.sendFile(__dirname+'/files/1.bcd');
    //res.sendFile('files/1.bcd' , { root : __dirname});
    //res.sendFile( __dirname + "/files/" + "1.bcd" );
    //res.sendFile( path.resolve('./files/1.bcd') );
    //res.sendFile('1.bcd', { root: path.join(__dirname, './files') });
});

var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

app.post('/api/upload', upload.single('fileUploaded'), function(req, res){
    console.log('files:', req.file);
    if(req.file){
        res.send(req.file.buffer.toString('utf8'));
    }
});
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;