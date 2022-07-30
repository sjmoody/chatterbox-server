var Messages = {
  _data: [],

  add: function(message, callback = ()=>{}) {
    Messages._data.push(message);
    callback();
  }
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

    var data2 = [{"message_id":70506,"roomname":"lobby","text":"hey VoidWizid!","username":"Bob","github_handle":"romanlaughs","campus":"rpp","created_at":"2022-07-11T00:44:00.308Z","updated_at":"2022-07-11T00:44:00.308Z"}];

    // replace with something from messages._data
    response.end(JSON.stringify(Messages._data));

  } else {
    // if (request.url !== '/classes/messages') {
    // response.statusCode = 404;
    response.writeHead(404);
    response.end();
    // }
    // // console.log('request--->', request);

    // // The outgoing status.
    // var statusCode = 200;

    // // See the note below about CORS headers.
    // var headers = defaultCorsHeaders;

    // // Tell the client we are sending them plain text.
    // //
    // // You will need to change this if you are sending something
    // // other than plain text, like JSON or HTML.
    // headers['Content-Type'] = 'text/plain';

    // // .writeHead() writes to the request line and headers of the response,
    // // which includes the status and all headers.
    // response.writeHead(statusCode, headers);

    // // Make sure to always call response.end() - Node may not send
    // // anything back to the client until you do. The string you pass to
    // // response.end() will be the body of the response - i.e. what shows
    // // up in the browser.
    // //
    // // Calling .end "flushes" the response's internal buffer, forcing
    // // node to actually send all the data over to the client.
    // response.end('Hello World!');
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
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

exports.requestHandler = requestHandler;

