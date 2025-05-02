const express = require('express');
const fs = require('fs');
const path = require('path');
const mustache = require('mustache');

const app = express();
const port = 3000;

const staticServe = express.static(`${__dirname}/build`, {
  immutable: true,
  maxAge: '1y',
});

const serveGzipped = contentType => (req, res, next) => {
  const acceptedEncodings = req.acceptsEncodings();
  if (acceptedEncodings.indexOf('gzip') === -1 || !fs.existsSync(`./build/${req.url}.gz`)) {
    next();
    return;
  }

  // update request's url
  req.url = `${req.url}.gz`;

  // set correct headers
  res.set('Content-Encoding', 'gzip');
  res.set('Content-Type', contentType);

  // let express.static take care of the updated request
  next();
};

app.get('*.js', serveGzipped('text/javascript'));

app.get('*.css', serveGzipped('text/css'));

app.get('/robots.txt', (req, res) => {
  res.status(200).sendFile('robots.txt', {
    root: path.join(__dirname, '/build/public'),
    headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
  });
});

app.use(staticServe);

// This route is used to serve the application.
app.get('/app/:stream', (req, res) => {
  let data = req.query;
  const { stream } = req.params;
  data = { ...data, stream };

  const indexPage = fs.readFileSync('build/index.html').toString();
  const newIndex = mustache.render(indexPage, data);

  res.set('Content-Type', 'text/html');
  res.send(newIndex);
});

// This route is used to serve the application to the Hootsuite dashboard.
app.post('/app/:stream', (req, res) => {
  let data = req.query;
  const { stream } = req.params;
  data = { ...data, stream };

  const indexPage = fs.readFileSync('build/index.html').toString();
  const newIndex = mustache.render(indexPage, data);

  res.set('Content-Type', 'text/html');
  res.send(newIndex);
});

// This route is for serving the Add New Post and Edit Post modal content
app.get('/modal', (req, res) => {
  let data = req.query;
  data = { ...data };

  const indexPage = fs.readFileSync('build/modal_index.html').toString();
  const newIndex = mustache.render(indexPage, data);

  res.set('Content-Type', 'text/html');
  res.send(newIndex);
});

app.get('/*', (req, res) => {
  let data = req.query;
  data = { ...data };
  const indexPage = fs.readFileSync('build/index.html').toString();
  const newIndex = mustache.render(indexPage, data);

  res.set('Content-Type', 'text/html');
  res.send(newIndex);
});

app.listen(port, () => console.log('Server running'));
