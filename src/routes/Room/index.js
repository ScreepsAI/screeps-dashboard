import { Component } from 'react';
import style from './index.scss';
import { Svg, Box, LineChart, Resource } from '../../components';
import { updateDate, shortNumber, formatNumber } from '../../utils';
import { Progress, Tooltip } from 'antd';
import _ from 'lodash';

export class Room extends Component {
  constructor(props) {
    super();
    this.name = props.name;
    this.memory = props.memory;
    this.graph = props.graph;
    this.badge = props.badge;
  }

  rcl = () => {
    const { controller } = this.memory;
    let controllerSvg = (
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
        className={style.title}
        href={`https://screeps.com/a/#!/room/shard2/${this.name}`}
        target="_blank"
      >
        {this.name}
      </a>
    );
    if (this.graph.level < 8) {
      const rclProgress = controller.progress / controller.progressTotal * 100;
      const rclTime = updateDate(this.graph.deltas, this.graph.progress, this.graph.progressTotal);
      const tooltipText = (
        <div className={style.tooltip}>
          <div>
            Progress:{' '}
            <span>
              {[
                formatNumber(controller.progress, 0),
                formatNumber(controller.progressTotal, 0),
              ].join(' / ')}
            </span>
          </div>
          <div>
            Speed:{' '}
            <span>
              {Math.floor(_.sum(this.graph.deltas) / this.graph.deltas.length / 60 * 3)} E/Tick
            </span>
          </div>
        </div>
      );
      const progress = [
        <Progress key="progress" percent={rclProgress} showInfo={false} />,
        <div key="progress-time" className={style.desc}>
          {rclProgress.toFixed(1)}% Next level {rclTime}
        </div>,
      ];
      return (
        <Tooltip title={tooltipText}>
          <div className={style.left}>
            {controllerSvg}
            <div className={style.content}>
              {roomName}
              {progress}
            </div>
          </div>
        </Tooltip>
      );
    } else {
      return (
        <div className={style.left}>
          {controllerSvg}
          <div className={style.content}>{roomName}</div>
        </div>
      );
    }
  };

  rclChart = () => {
    const data = [];
    const avg = 6;
    const newDeltas = [];
    let newDelta = 0;
    _.forEach(this.graph.deltas, (value, index) => {
      newDelta += value;
      if ((index + 1) % avg === 0 && newDelta > 0) {
        newDeltas.push(Math.floor(newDelta / (60 * avg) * 3));
        newDelta = 0;
      }
    });
    _.forEach(newDeltas, (value, index) => data.push({ x: index, y: value }));
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
        color = res.value > 100000 ? '#fee476' : '#FF7A7A';
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

    let titleColor = storage.store > 900000 ? '#FF7A7A' : '#eee';

    return (
      <div className={style.storage}>
        <div className={style.left}>
          <Svg.storage content={storage.resources} />
          <div className={style.content}>
            <div className={style.title} style={{ color: titleColor }}>
              STORAGE {Math.floor(storage.store / 10000)}%
            </div>
            <div className={style.desc}>
              {' '}
              {formatNumber(storage.store)} ( {shortNumber(storage.store)} / 1M )
            </div>
          </div>
        </div>
        <div className={style.list}>{List}</div>
      </div>
    );
  };

  terminal = () => {
    const { terminal } = this.memory;
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
        color = res.value > 90000 ? '#fee476' : '#FF7A7A';
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

    let titleColor = terminal.store > 250000 ? '#FF7A7A' : '#eee';

    return (
      <div className={style.storage}>
        <div className={style.left}>
          <Svg.terminal content={terminal.resources} />
          <div className={style.content}>
            <div className={style.title} style={{ color: titleColor }}>
              STORAGE {Math.floor(terminal.store / 3000)}%
            </div>
            <div className={style.desc}>
              {' '}
              {formatNumber(terminal.store)} ( {shortNumber(terminal.store)} / 300k)
            </div>
          </div>
        </div>
        <div className={style.list}>{List}</div>
      </div>
    );
  };

  order = () => {
    const { resources } = this.memory;
    const reactionData = resources.reactions ? resources.reactions.orders : [];
    const orderData = resources.orders || [];
    const offerData = resources.offers || [];
    const hide = reactionData.length === 0 && orderData.length === 0 && offerData.length === 0;
    const buildList = data => {
      if (data.length === 0) return 'none';
      let list = [];
      _.forEach(data, o =>
        list.push(
          <div key={o.type}>
            <Resource type={o.type} />
            <span>{formatNumber(o.amount, 0)}</span>
          </div>
        )
      );
      return list;
    };
    if (hide) return null;
    return (
      <div className={style.order}>
        <div>
          <div className={style.title}>REACTION</div>
          <div className={style.orderList}>{buildList(reactionData)}</div>
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
      _.forEach(role, handleCreep);
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
    const { spawnQueueLow, spawnQueueMedium, spawnQueueHigh } = this.memory;
    const hide =
      spawnQueueLow.length === 0 && spawnQueueMedium.length === 0 && spawnQueueHigh.length === 0;
    const buildList = queue => {
      if (queue.length === 0) return 'none';
      const list = [];
      _.forEach(queue, creep => {
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
          <Tooltip key={creep.name} title={tooltipText}>
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
    if (hide) return null;
    return (
      <div className={style.order}>
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

  render() {
    return (
      <div className={style.roomView}>
        <div className={style.header}>
          {this.rcl()}
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
        </div>
        <div className={style.body}>
          {this.memory.storage.store > 0 ? this.storage() : null}
          {this.memory.terminal.store > 0 ? this.terminal() : null}
          {this.memory.resources ? this.order() : null}
          {this.spawn()}
          {this.creep()}
        </div>
      </div>
    );
  }
}
