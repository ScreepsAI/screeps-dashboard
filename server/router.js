const express = require('express');
const router = express.Router();
const FileSync = require('lowdb/adapters/FileSync');
const lowdb = require('lowdb');
const path = require('path');
const db = lowdb(new FileSync(path.resolve('db.json')));

function read() {
  if (Date.now() - db.get('time').value() > 60000) db.read();
}

router.get('(/api)?/', function(req, res, next) {
  read();
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
  });
});

router.get('(/api)?/stats', (req, res, next) => {
  read();
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get('stats').value(),
  });
});

router.get('(/api)?/stats/*', (req, res, next) => {
  read();
  const url = req.url
    .toString()
    .replace(/^\//, '')
    .replace(/\//g, '.');
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get(url).value(),
  });
});

router.get('(/api)?/graph', (req, res, next) => {
  read();
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get('graph').value(),
  });
});

router.get('(/api)?/graph/*', (req, res, next) => {
  read();
  const url = req.url
    .toString()
    .replace(/^\//, '')
    .replace(/\//g, '.');
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get(url).value(),
  });
});

router.get('(/api)?/username', (req, res, next) => {
  read();
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get('username').value(),
  });
});

router.get('(/api)?/badge', (req, res, next) => {
  read();
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get('badge').value(),
  });
});

router.get('(/api)?/market', (req, res, next) => {
  read();
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get('market').value(),
  });
});

router.get('(/api)?/market/*', (req, res, next) => {
  read();
  const url = req.url
    .toString()
    .replace(/^\//, '')
    .replace(/\//g, '.');
  res.json({
    count: db.get('count').value(),
    time: db.get('time').value(),
    data: db.get(url).value(),
  });
});

module.exports = router;
