var http = require('http');
var fs = require('fs');
var querystring = require('querystring')
var path = require('path');
var request = require('request');

var server = http.createServer(function(req, res) {
    if (path.normalize(decodeURI(req.url)) !== decodeURI(req.url)) {
        res.statusCode = 403;
        res.end();
        return;
    }
    var staticUrl = path.join(__dirname + req.url);
    try {
        switch (req.url) {
            case '/':
                res.writeHeader(200, { 'content-type': 'text/html' });
                var readStream = fs.createReadStream(path.join(__dirname + '/index.html'));
                readStream.pipe(res);
                break;
            default:
                fs.stat(staticUrl, function(err, stat) {
                    if (err) {
                        res.end();
                        return;
                    }
                    if (stat.isFile()) {
                        if (/\.html$/.test(staticUrl)) {
                            res.writeHeader(200, { 'content-type': 'text/html' });
                        }
                        var readStream = fs.createReadStream(staticUrl)
                        readStream.pipe(res);
                    } else {
                        res.end();
                    }
                });
                break;
        }

    } catch (e) {
        console.log(e);
    }
});

server.listen(3001, function() {
    console.log('server listening 3001');
});
