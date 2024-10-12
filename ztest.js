import http from 'http';

const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

http.createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Node.js ' + process.version);
 
}).listen(port, function() {
  console.log('Server is listening on port ' + port);
  console.log('NOde ver' + process.version);
});