const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (req.method === 'GET' && parsedUrl.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><body>');
    res.write('<h1>Write a Message</h1>');
    res.write('<form method="post" action="/msg">');
    res.write('<input type="text" name="message" placeholder="Enter your message" />');
    res.write('<button type="submit">Submit</button>');
    res.write('</form>');
    res.write('</body></html>');
    res.end();
  } else if (req.method === 'POST' && parsedUrl.pathname === '/msg') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const postData = qs.parse(body);
      const message = postData.message.trim();

      if (message) {
        // Append message to a file (optional)
        fs.appendFile('messages.txt', `${message}\n`, err => {
          if (err) {
            console.error('Error appending to file:', err);
          }
        });

        // Redirect to /msg with the message as a query parameter
        res.writeHead(302, { 'Location': `/msg?message=${encodeURIComponent(message)}` });
        res.end();
      } else {
        // If no message provided, redirect back to form
        res.writeHead(302, { 'Location': '/' });
        res.end();
      }
    });
  } else if (req.method === 'GET' && parsedUrl.pathname === '/msg') {
    const message = parsedUrl.query.message || 'No message';
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><body>');
    res.write(`<h1>${message}</h1>`);
    res.write('</body></html>');
    res.end();
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page Not Found');
  }
});

server.listen(4000, () => {
  console.log('Server is running on port 4000');
});
