const request = require('request')
const moment   = require('moment');
const _        = require('lodash');
const FileSync = require('lowdb/adapters/FileSync');
const lowdb    = require('lowdb');
const db       = lowdb(new FileSync('server/db.json'));
const config       = require('./config.json');

module.exports = function (data) {
	pushGrafana(data)

	const {population, rooms, flags, tasks, power, leaderboard, stats} = data.stats;
	const {tick, cpu, gcl, market}                                     = stats;

	_.forEach(population, creep => {
		const homeRoom = rooms[creep.homeRoom];
		if (!homeRoom) return;
		if (!homeRoom.creeps) homeRoom.creeps = {};
		if (!homeRoom.creeps[creep.creepType]) homeRoom.creeps[creep.creepType] = [];
		homeRoom.creeps[creep.creepType].push(creep);
	});

	_.merge(rooms, stats.rooms);
	_.assign(gcl, {power});

	const statsData = {tick, rooms, flags, tasks, gcl, leaderboard, market};

	const cpuGraph = {
		limit : cpu.limit,
		used  : buildGarph('cpu.used', cpu.used),
		bucket: buildGarph('cpu.bucket', cpu.bucket)
	};

	const graphData = {
		cpu  : cpuGraph,
		rooms: {}
	};

	_.forEach(rooms, (room, roomName) => {
		if (!room.RCL || !room.controller) return delete rooms[roomName];
		const controller                = room.controller;
		graphData.rooms[roomName]       = {};
		graphData.rooms[roomName].level = controller.level;
		if (controller.level === 8) return;
		graphData.rooms[roomName].progressTotal = controller.progressTotal;
		graphData.rooms[roomName].progress      = controller.progress;
		const oldProgress                       = db.get(`graph.rooms.${roomName}.progress`).value() || controller.progress;
		const delta                             = controller.progress - oldProgress;
		graphData.rooms[roomName].deltas        = buildGarph(`rooms.${roomName}.deltas`, delta);
	});

	db.defaults({stats: {}, graph: {}, count: 0})
	  .write();

	db.set('stats', statsData)
	  .write();

	db.set('graph', graphData)
	  .write();

	db.update('count', n => n + 1)
	  .write();

	console.log(`[${moment().format('hh:mm:ss')}]`, 'save memory data');
};

function buildGarph(path, value) {
	value        = Math.floor(value);
	let oldValue = db.get(`graph.${path}`).value();
	if (!oldValue) {
		oldValue = [value];
	} else {
		if (oldValue.length > 180) oldValue.shift();
		oldValue.push(value);
	}
	return oldValue;
}

function pushGrafana(data) {
	let {type, stats} = data
	if (!stats) return console.log('No stats found, is Memory.stats defined?')
	console.log('Pushing stats')
	if (type == 'application/json') stats = JSON.stringify(stats)
	request({
		        method: 'POST',
		        url: 'https://screepspl.us/api/stats/submit',
		        auth: {
			        user: 'token',
			        pass: config.grafana
		        },
		        headers: {
			        'content-type': type
		        },
		        body: stats
	        }, (err, res, data) => {
		if (res && res.statusCode == 413) {
			let len = Math.round(JSON.stringify(stats).length / 1024)
			console.log(`stats size: ${len}kb`)
			console.log(`stats limit: 10mb (As of Mar 28, 2017) (If you hit this limit, you are probably doing something wrong)`)
			console.error(`It appears your stats data is too large, please check to make sure you are not submitting unneeded stats, such as old rooms. \n If you legitimately need to submit stats this large, contact ags131 on slack for a limit bump`)
		}
		console.log('Result:', data)
		if (err) console.error(err)
	})
}