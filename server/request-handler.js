var Messages = {
  _data: [],

  add: function(message, callback = ()=>{}) {
    Messages._data.push(message);
    callback();
  }
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  if (request.method === 'POST' && request.url === '/classes/messages') {
    var body = '';
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => { //why is this anonymous func used? becaasue otherwise on end would return the result of the Messages.add function right away?
      var message = JSON.parse(body);
      Messages.add(message, () => {
        var statusCode = 201;
        var headers = defaultCorsHeaders;
        headers['Content-Type'] = 'application/json';
        response.writeHead(statusCode, headers);
        response.end();
      });
    });
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    var statusCode = 200;
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);

    response.end(JSON.stringify(Messages._data));

  } else {

    response.writeHead(404);
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


exports.requestHandler = requestHandler;

