const express = require('express');
const app = express();
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  res.set(
    'Access-Control-Allow-Headers',
    'Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With'
  );
  next();
});
app.use('/', require('./router'));
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

const server = app.listen(9000, () => {
  var host = server.address().address;
  var port = server.address().port;
  console.log('example app listening at http://%s:%s', host, port);
});
