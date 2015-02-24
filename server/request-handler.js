/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  if (request.method === 'POST'){
    var body = '';

    request.on('data', function(data){
      body += data;
    });

    request.on('end', function(){
      var timestamp = new Date();
      var message = JSON.parse(body);
      storedMessages.push({
        'objectId': storedMessages.length,
        'createdAt': timestamp,
        'username': message.username,
        'text': message.text,
        'roomname': message.roomname
      });
      response.writeHead(201, headers);
      response.end();
    });
  }

  else if (request.method === 'GET') {
    if ( request.url === '/arglebargle') {
      statusCode = 404;
    }
    response.writeHead(statusCode, headers);
    response.end( JSON.stringify({results: storedMessages}) );
  }

  else {
    response.writeHead(statusCode, headers);
    response.end();
  }
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var storedMessages = [];

exports.requestHandler = requestHandler;
