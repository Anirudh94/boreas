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
app.get('/:coll/latest', (req, res) => {
  var options = {
    hostname: '127.0.0.1',
    port: '8090',
    path: '/' + req.params.coll + '/latest',
    method: 'GET'
  }
  http.request(options, cpuRes => {
    cpuRes.setEncoding('utf8');
    return cpuRes.on('data', data => {
      res.send(data);
    });
  }).end();
});

app.listen(port, ip, () => {
  console.log('Listening on\n' + 'IP: ' + ip + '\n' + 'PORT: ' + port);
});
