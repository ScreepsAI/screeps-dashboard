import { Component } from 'react';
import style from './index.scss';
import { Svg, Box, LineChart, Resource, View } from '../../components';
import { updateDate, shortNumber, formatNumber } from '../../utils';
import { Progress, Tooltip } from 'antd';
import _ from 'lodash';
import moment from 'moment';

export class Room extends Component {
  constructor(props) {
    super();
    this.name = props.name;
    this.memory = props.memory;
    this.graph = props.graph;
    this.badge = props.badge;
    this.send = props.send;
  }

  rcl = () => {
    const { controller, mineralType, RBL, RDL, walls, ramparts } = this.memory;
    const controllerSvg = (
      <Svg.controller
        badge={this.badge}
        content={{
          level: controller.level,
          progress: controller.progress,
          progressTotal: controller.progressTotal,
          deltas: this.graph.deltas,
        }}
      />
    );
    const roomName = (
      <a
        className={style.roomTitle}
        href={`https://screeps.com/a/#!/room/shard2/${this.name}`}
        target="_blank"
        name={this.name}
      >
        <Resource type={mineralType} />
        {this.name}
      </a>
    );
    const tooltipText = [
      <div key="rbl">
        RBL / RDL: {RBL} / {RDL}
      </div>,
    ];

    let desc = `Rampart: ${shortNumber(ramparts.avg)} / Wall: ${shortNumber(walls.avg)}`;
    if (this.graph.level < 8) {
      const rclProgress = controller.progress / controller.progressTotal * 100;
      const rclTime = updateDate(this.graph.deltas, this.graph.progress, this.graph.progressTotal);
      const speed = `${Math.floor(
        _.sum(this.graph.deltas) / this.graph.deltas.length / 60 * 3
      )} e/tick`;
      tooltipText.unshift(
        <div key="progress">
          Progress:{' '}
          <span>
            {[formatNumber(controller.progress, 0), formatNumber(controller.progressTotal, 0)].join(
              ' / '
            )}
          </span>
        </div>
      );
      tooltipText.unshift(
        <div key="speed">
          Speed: <span>{speed}</span>
        </div>
      );
      desc = [
        <Progress key="progress" percent={rclProgress} showInfo={false} />,
        <div key="progress-time" className={style.desc}>
          {rclProgress.toFixed(1)}% lvlup {rclTime} ({speed})
        </div>,
      ];
    }

    return (
      <Tooltip title={<div className={style.tooltip}>{tooltipText}</div>}>
        <div>
          <View.boxHeader svg={controllerSvg} title={roomName} desc={desc} />
        </div>
      </Tooltip>
    );
  };

  rclChart = () => {
    const { deltas } = this.graph;
    if (deltas.length === 0) return null;
    const data = [];
    const avg = 6;
    const newDeltas = [];
    let newDelta = 0;
    _.forEach(deltas, (value, index) => {
      newDelta += value;
      if ((index + 1) % avg === 0 && newDelta > 0) {
        newDeltas.push(Math.floor(newDelta / (60 * avg) * 3));
        newDelta = 0;
      }
    });
    _.forEach(newDeltas, (y, x) => data.push({ x, y }));
    return (
      <LineChart
        className={style.rclChart}
        data={data}
        width={120}
        color={['rgb(98, 230, 172)', 'rgba(98, 230, 172, .5)']}
        small
      />
    );
  };

  storage = () => {
    const { storage } = this.memory;
    if (!storage || !storage.store) return null;
    const List = [];
    const energy = [];
    const res = [];

    _.forEach(storage.resources, (value, type) => {
      if (_.includes(['energy'], type)) {
        energy.push({ type, value });
      } else {
        res.push({ type, value });
      }
    });
    const buildList = res => {
      let color = '#999';
      if (res.value > 10000) color = '#eee';
      if (res.type === 'energy') {
        color = res.value > 100000 ? '#fee476' : '#f92672';
      }
      List.push(
        <div key={res.type} className={style.resCell}>
          <div className={style.type}>
            <Resource type={res.type} />
          </div>
          <div className={style.value} style={{ color: color }}>
            {shortNumber(res.value)}
          </div>
        </div>
      );
    };

    _.forEach(_.sortBy(res, 'value').reverse(), buildList);
    _.forEach(energy, buildList);

    const titleColor = storage.store > 900000 ? '#f92672' : '#eee';
    const boxHeader = (
      <View.boxHeader
        svg={<Svg.storage content={storage.resources} />}
        title={
          <span style={{ color: titleColor }}>STORAGE {Math.floor(storage.store / 10000)}%</span>
        }
        desc={`${formatNumber(storage.store)} ( ${shortNumber(storage.store)} / 1M )`}
      />
    );
    return <View.box left={boxHeader} right={<div>{List}</div>} />;
  };

  terminal = () => {
    const { terminal } = this.memory;
    if (!terminal || !terminal.store) return null;
    const List = [];
    const energy = [];
    const res = [];

    _.forEach(terminal.resources, (value, type) => {
      if (_.includes(['energy'], type)) {
        energy.push({ type, value });
      } else {
        res.push({ type, value });
      }
    });
    const buildList = res => {
      let color = '#999';
      if (res.value > 10000) color = '#eee';
      if (res.type === 'energy') {
        color = res.value > 90000 ? '#fee476' : '#f92672';
      }
      List.push(
        <div key={res.type} className={style.resCell}>
          <div className={style.type}>
            <Resource type={res.type} />
          </div>
          <div className={style.value} style={{ color: color }}>
            {shortNumber(res.value)}
          </div>
        </div>
      );
    };

    _.forEach(_.sortBy(res, 'value').reverse(), buildList);
    _.forEach(energy, buildList);

    const titleColor = terminal.store > 250000 ? '#f92672' : '#eee';
    const boxHeader = (
      <View.boxHeader
        svg={<Svg.terminal content={terminal.resources} />}
        title={
          <span style={{ color: titleColor }}>TERMINAL {Math.floor(terminal.store / 3000)}%</span>
        }
        desc={`${formatNumber(terminal.store)} ( ${shortNumber(terminal.store)} / 300,000 )`}
      />
    );
    return <View.box left={boxHeader} right={<div>{List}</div>} />;
  };

  order = () => {
    const { resources } = this.memory;
    if (!resources) return null;
    const sendData = this.send || [];
    const orderData = resources.orders || [];
    const offerData = resources.offers || [];
    const hide =
      !sendData ||
      !orderData ||
      !offerData ||
      (sendData.length === 0 && orderData.length === 0 && offerData.length === 0);
    if (hide) return null;
    const buildList = data => {
      if (data.length === 0) return 'none';
      let list = [];
      _.forEach(data, (o, i) => {
        if (o.from) {
          const isFrom = o.from === this.name;
          const color = isFrom ? '#f92672' : '#a6e22e';
          const room = isFrom ? o.to : o.from;
          list.push(
            <div key={i} className={style.send}>
              <span style={{ color: '#555' }}>[{moment(o.time).format('hh:mm')}]</span>
              <Resource type={o.type} />
              <span style={{ color }}>
                {isFrom ? '-' : '+'}
                {formatNumber(o.amount, 0)}
              </span>
              {isFrom ? 'to' : 'from'}
              <a href={`#${room}`}>{room}</a>
            </div>
          );
        } else {
          list.push(
            <div key={i}>
              <Resource type={o.type} />
              <span>{formatNumber(o.amount, 0)}</span>
            </div>
          );
        }
      });
      return list;
    };
    return (
      <div className={style.order}>
        <div>
          <div className={style.title}>HISTORY</div>
          <div className={style.orderList}>{buildList(sendData)}</div>
        </div>
        <div>
          <div className={style.title}>ORDER</div>
          <div className={style.orderList}>{buildList(orderData)}</div>
        </div>
        <div>
          <div className={style.title}>OFFER</div>
          <div className={style.orderList}>{buildList(offerData)}</div>
        </div>
      </div>
    );
  };

  creep = () => {
    const { creeps } = this.memory;
    const list = {};
    const List = [];
    const handleRole = (role, roleName) => {
      if (!list[roleName]) list[roleName] = [];
      _.forEach(_.filter(role, c => c.spawned), handleCreep);
    };
    const handleCreep = (creep, index) => {
      const tooltipText = (
        <div className={style.creepTooltip}>
          <div className={style.name}>
            Name: <span>{creep.creepName}</span>
          </div>
          <div className={style.room}>
            Room: <span>{creep.roomName}</span>
          </div>
          <div className={style.home}>
            Home: <span>{creep.homeRoom}</span>
          </div>
          <div>
            TTL: <span>{creep.ttl}</span>
          </div>
          <div>
            Weight: <span>{creep.weight}</span>
          </div>
          <Svg.creep content={creep} bodyBox />
        </div>
      );
      list[creep.creepType].push(
        <Tooltip key={index} title={tooltipText}>
          <div>
            <Svg.creep content={creep} badge={this.badge} />
          </div>
        </Tooltip>
      );
    };
    _.forEach(creeps, handleRole);
    _.forEach(list, (l, title) =>
      List.push(
        <div key={title} className={style.roleBox}>
          <div className={style.title}>{title.toUpperCase()}</div>
          <div className={style.creepBox}>{l}</div>
        </div>
      )
    );
    return <div className={style.creep}>{List}</div>;
  };

  spawn = () => {
    let { spawns, energy } = this.memory;
    if (!spawns || _.size(spawns) === 0) return null;
    spawns = Object.values(spawns) || [];
    const spawning = _.filter(spawns, s => s.spawning);
    const spawn = spawning.length > 0 ? spawning[0] : spawns[0];

    const boxHeader = (
      <View.boxHeader
        svg={<Svg.spawn content={spawn} />}
        title={
          spawning.length > 0
            ? `SPAWING ${Math.floor((1 - spawning[0].remainingTime / spawning[0].needTime) * 100)}%`
            : `SPAWN`
        }
        desc={`Energy: ${formatNumber(energy.available)} / ${formatNumber(
          energy.capacityAvailable
        )}`}
      />
    );

    return <View.box left={boxHeader} />;
  };

  queue = () => {
    let { spawns } = this.memory;
    spawns = _.filter(Object.values(spawns), s => s.spawning) || [];
    const { spawnQueueHigh, spawnQueueMedium, spawnQueueLow } = this.memory;
    if (
      !spawns ||
      !spawnQueueHigh ||
      !spawnQueueMedium ||
      !spawnQueueLow ||
      (spawns.length === 0 &&
        spawnQueueHigh.length === 0 &&
        spawnQueueMedium.length === 0 &&
        spawnQueueLow.length === 0)
    )
      return null;
    const spawning = [];
    _.forEach(this.memory.creeps, role => {
      _.forEach(role, c => {
        if (c.spawned) return;
        let parts = [];
        _.forEach(c.body, (v, k) => {
          if (k !== 'carry') parts = parts.concat(_.fill(Array(v), k));
        });
        spawning.push({
          ...c,
          name: c.creepName,
          parts,
        });
      });
    });
    const buildList = queue => {
      if (queue.length === 0) return 'none';
      const list = [];
      _.forEach(queue, (creep, i) => {
        let destiny;
        if (creep.destiny && creep.destiny.targetName) {
          destiny = [
            <div key="room" className={style.room}>
              Room: <span>{creep.destiny.room}</span>
            </div>,
            <div key="target" className={style.home}>
              Target: <span>{creep.destiny.targetName}</span>
            </div>,
            <div key="task">
              Task: <span>{creep.destiny.task}</span>
            </div>,
          ];
        }
        const tooltipText = (
          <div className={style.creepTooltip}>
            <div className={style.name}>
              Name: <span>{creep.name}</span>
            </div>
            {destiny}
            <Svg.creep content={{ body: creep.parts }} array bodyBox />
          </div>
        );
        const Name = creep.name.split('-');
        list.push(
          <Tooltip key={i} title={tooltipText}>
            <div className={style.queueBox}>
              <Svg.creep content={{ body: creep.parts }} badge={this.badge} array />
              <span>
                <div className={style.behaviour}>{Name[0]}</div>
                <div className={style.target}>{Name[1]}</div>
              </span>
            </div>
          </Tooltip>
        );
      });
      return list;
    };
    return (
      <div className={style.order}>
        <div>
          <div className={style.title}>SPAWNING</div>
          <div className={style.orderList}>{buildList(spawning)}</div>
        </div>
        <div>
          <div className={style.title}>HIGH</div>
          <div className={style.orderList}>{buildList(spawnQueueHigh)}</div>
        </div>
        <div>
          <div className={style.title}>MEDIUM</div>
          <div className={style.orderList}>{buildList(spawnQueueMedium)}</div>
        </div>
        <div>
          <div className={style.title}>LOW</div>
          <div className={style.orderList}>{buildList(spawnQueueLow)}</div>
        </div>
      </div>
    );
  };

  lab = () => {
    const { labs, resources } = this.memory;
    if (!labs || _.size(labs) === 0) return null;
    if (!resources || !resources.reactions) return null;
    const { seed_a, seed_b } = resources.reactions;
    if (!seed_a || !seed_b) return null;
    const order = resources.reactions.orders[0];
    if (!order || !order.type) return null;
    const labListA = [];
    const labListB = [];
    const energy = [];
    const mineral = [];
    const seedMineral = [];
    let seedType = [];
    _.forEach(labs, (l, i) => {
      if (_.includes([seed_a, seed_b], i)) {
        seedType.push(l.mineralType);
        seedMineral.push(l.mineralAmount);
        labListA.push(
          <div key={i} className={style.labBox}>
            <Svg.lab content={l} size={40} />
          </div>
        );
      } else {
        energy.push(l.energy);
        mineral.push(l.mineralAmount);
        labListB.push(<Svg.lab key={i} content={l} size={40} scale={1} />);
      }
    });
    const isStop = _.includes(seedType, null);
    const color = isStop ? '#f92672' : '#fff';
    const tilte = isStop ? 'LABS STOPED' : 'LABS PRODUCTING';

    const boxHeader = (
      <View.boxHeader
        svg={
          <Svg.lab
            content={{
              energy: _.sum(energy) / energy.length,
              mineralAmount: _.sum(mineral) / mineral.length,
            }}
            size={60}
            scale={0.9}
          />
        }
        title={<span style={{ color }}>{tilte}</span>}
        desc={`${seedType[0]} + ${seedType[1]} => ${order.type} ( ${shortNumber(order.amount)} )`}
      />
    );
    return (
      <View.box
        left={boxHeader}
        right={
          <div className={style.right}>
            <div className={style.labList}>
              <div className={style.icon}>{labListA[0]}</div>
              <div className={style.value}>
                <Resource type={seedType[0]} /> {shortNumber(seedMineral[0])}
              </div>
            </div>
            <div className={style.labList}>
              <div className={style.icon}>{labListA[1]}</div>
              <div className={style.value}>
                <Resource type={seedType[1]} /> {shortNumber(seedMineral[1])}
              </div>
            </div>
            <div className={style.labList}>
              <div className={style.icon}>{labListB}</div>
              <div className={style.value}>
                <Resource type={order.type} /> {formatNumber(_.sum(mineral), 0)}
              </div>
            </div>
          </div>
        }
      />
    );
  };

  render() {
    return (
      <div className={style.roomView} id={this.name}>
        <View.box
          className={style.header}
          left={this.rcl()}
          right={
            <div className={style.right}>
              <Box
                title="rcl"
                value={this.memory.RCL}
                color={['rgb(98, 230, 172)', 'rgba(98, 230, 172, .5)']}
                circle
                small
              />
              {this.graph.level < 8 ? this.rclChart() : null}
              {this.memory.storage.store > 0 ? (
                <Box
                  title="storage"
                  value={this.memory.storage.store}
                  color={['rgb(255, 201, 107)', 'rgba(255, 201, 107, .5)']}
                  small
                />
              ) : null}
              {this.memory.terminal.store > 0 ? (
                <Box
                  title="terminal"
                  value={this.memory.terminal.store}
                  color={['rgb(174, 129, 255)', 'rgba(174, 129, 255, .5)']}
                  small
                />
              ) : null}
            </div>
          }
        />
        <div className={style.body}>
          {this.spawn()}
          {this.queue()}
          {this.storage()}
          {this.terminal()}
          {this.order()}
          {this.lab()}
          {this.creep()}
        </div>
      </div>
    );
  }
}
