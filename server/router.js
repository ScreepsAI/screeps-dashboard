const express = require('express');
const router = express.Router();
const FileSync = require('lowdb/adapters/FileSync');
const lowdb = require('lowdb');
const path = require('path');

router.get('(/api)?/', function(req, res, next) {
  const db = lowdb(new FileSync(path.resolve('db.json')));
  res.json({
    err: 0,
    msg: '',
    data: db.get('count').value(),
  });
});

router.get('(/api)?/stats', (req, res, next) => {
  const db = lowdb(new FileSync(path.resolve('db.json')));
  res.json({
    err: 0,
    msg: '',
    data: db.get('stats').value(),
  });
});

router.get('(/api)?/stats/*', (req, res, next) => {
  const db = lowdb(new FileSync(path.resolve('db.json')));
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
  const db = lowdb(new FileSync(path.resolve('db.json')));
  res.json({
    err: 0,
    msg: '',
    data: db.get('graph').value(),
  });
});

router.get('(/api)?/graph/*', (req, res, next) => {
  const db = lowdb(new FileSync(path.resolve('db.json')));
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
