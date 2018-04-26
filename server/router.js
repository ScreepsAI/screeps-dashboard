const express = require('express');
const router = express.Router();
const FileSync = require('lowdb/adapters/FileSync');
const lowdb = require('lowdb');
const path = require('path');
const db = lowdb(new FileSync(path.resolve('db.json')));

router.get('(/api)?/', function(req, res, next) {
  const all = db.get('count').value();
  res.json({
    err: 0,
    msg: '',
    data: all,
  });
});

router.get('(/api)?/stats', (req, res, next) => {
  res.json({
    err: 0,
    msg: '',
    data: db.get('stats').value(),
  });
});

router.get('(/api)?/stats/*', (req, res, next) => {
  const url = req.url
    .toString()
    .replace(/^\//, '')
    .replace(/\//g, '.');
  res.json({
    err: 0,
    msg: '',
    data: db.get(url).value(),
  });
});

router.get('(/api)?/graph', (req, res, next) => {
  res.json({
    err: 0,
    msg: '',
    data: db.get('graph').value(),
  });
});

router.get('(/api)?/graph/*', (req, res, next) => {
  const url = req.url
    .toString()
    .replace(/^\//, '')
    .replace(/\//g, '.');
  res.json({
    err: 0,
    msg: '',
    data: db.get(url).value(),
  });
});

module.exports = router;
