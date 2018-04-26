const { ScreepsAPI } = require('screeps-api');
const handleLowdb = require('./handleLowdb');
const config = require('./config.json');
const api = new ScreepsAPI({
  token: config.token,
  protocol: 'https',
  hostname: 'screeps.com',
  port: 443,
  path: '/',
});

start();
async function start() {
  const shards = [].concat(config.shard);
  shards.forEach(shard => {
    tick(shard);
    setInterval(() => {
      tick(shard);
    }, 60000);
  });
}

function tick(shard) {
  Promise.resolve()
    .then(() => console.log('Fetching Stats (' + shard + ')'))
    .then(() => api.memory.get('', shard || 'shard0').then(r => r.data))
    .then(processStats)
    .catch(err => console.error(err));
}

async function processStats(data) {
  data = await formatStats(data);
  await addProfileData(data);
  await addLeaderboardData(data);
  handleLowdb(data);
}

function formatStats(data) {
  if (data[0] === '{') data = JSON.parse(data);
  if (typeof data === 'object') {
    return {
      type: 'application/json',
      stats: data,
    };
  }
  let [type, tick, time, ...stats] = data.split('\n');
  if (type.startsWith('text')) stats = stats.map(s => `${s} ${time}`).join('\n') + '\n';
  if (type === 'application/json') stats = JSON.parse(stats);
  return Promise.resolve({ type, tick, time, stats });
}

function addProfileData(stats) {
  return api.me().then(res => {
    let credits = res.money || 0;
    let power = res.power || 0;
    if (stats.type === 'application/json') {
      stats.stats.credits = credits;
      stats.stats.power = power;
    }
    if (stats.type === 'text/grafana') {
      stats.stats += `credits ${credits} ${Date.now()}\n`;
      stats.stats += `power ${power} ${Date.now()}\n`;
    }
    if (stats.type === 'text/influxdb') {
      stats.stats += `profile,user=${
        api.user.username
      } credits=${credits},power=${power} ${Date.now()}\n`;
    }
    return stats;
  });
}

function addLeaderboardData(stats) {
  return api.leaderboard.find(api.user.username, 'world').then(res => {
    let { rank, score } = res.list.slice(-1)[0];
    if (stats.type === 'application/json') {
      stats.stats.leaderboard = { rank, score };
    }
    if (stats.type === 'text/grafana') {
      stats.stats += `leaderboard.rank ${rank} ${Date.now()}\n`;
      stats.stats += `leaderboard.score ${score} ${Date.now()}\n`;
    }
    if (stats.type === 'text/influxdb') {
      stats.stats += `leaderboard,user=${
        api.user.username
      } rank=${rank},score=${score} ${Date.now()}\n`;
    }
    return stats;
  });
}
