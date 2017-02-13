'use strict';
  
var http = require('http'),
  express = require('express'),
  fs = require('fs');

var app = express();

var port = process.env.PORT || 9000;

try {
  var ip = fs.readFileSync('SERVER_IP', 'utf8').trim();
} catch (e) {
  console.log('Please make sure you have a file named SERVER_IP with your desired IP');
  process.exit(1);
}

app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get(['/plugins/*', '/api/*'], (req, res) => {
  var options = {
    hostname: '127.0.0.1',
    port: '8090',
    path: req.originalUrl,
    method: 'GET'
  }
  
  http.request(options, webRes => {
    webRes.setEncoding('utf8');

    let rawData = '';

    webRes.on('data', chunk => {
      rawData += chunk;
    });

    return webRes.on('end', ()=> {
        res.send(rawData);
    });
  }).end();

});

app.listen(port, ip, () => {
  console.log('Listening on\n' + 'IP: ' + ip + '\n' + 'PORT: ' + port);
});
