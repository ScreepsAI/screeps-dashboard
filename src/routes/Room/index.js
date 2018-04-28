import { Component } from 'react';
import style from './index.scss';
import { Svg, Box, LineChart, Resource } from '../../components';
import { updateDate, shortNumber, formatNumber } from '../../utils';
import { Progress } from 'antd';
import _ from 'lodash';

export class Room extends Component {
  constructor(props) {
    super();
    this.name = props.name;
    this.memory = props.memory;
    this.graph = props.graph;
  }

  rcl = () => {
    const { controller } = this.memory;
    let progress;
    let chart;
    if (this.graph.level < 8) {
      const rclProgress = controller.progress / controller.progressTotal * 100;
      const rclTime = updateDate(this.graph.deltas, this.graph.progress, this.graph.progressTotal);
      progress = [
        <Progress key="progress" percent={rclProgress} showInfo={false} />,
        <div key="progress-time" className={style.desc}>
          {rclProgress.toFixed(1)}% Next level {rclTime}
        </div>,
      ];
    }
    return (
      <div className={style.left}>
        <Svg.controller
          content={{
            level: controller.level,
            progress: controller.progress,
            progressTotal: controller.progressTotal,
            deltas: this.graph.deltas,
          }}
        />
        <div className={style.content}>
          <a
            className={style.title}
            href={`https://screeps.com/a/#!/room/shard2/${this.name}`}
            target="_blank"
          >
            {this.name}
          </a>
          {progress}
        </div>
        {chart}
      </div>
    );
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
        <div className={style.resCell}>
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
        <div className={style.resCell}>
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
    let reaction = 'none';
    let order = 'none';
    let offer = 'none';

    const reactionData = resources.reactions ? resources.reactions.orders : [];
    const orderData = resources.orders || [];
    const offerData = resources.offers || [];

    const buildList = data => {
      let list = [];
      _.forEach(data, o =>
        list.push(
          <div>
            <Resource type={o.type} />
            <span>{formatNumber(o.amount, 0)}</span>
          </div>
        )
      );
      return list;
    };

    if (reactionData.length > 0) reaction = buildList(reactionData);
    if (orderData.length > 0) order = buildList(orderData);
    if (offerData.length > 0) offer = buildList(offerData);

    return (
      <div className={style.order}>
        <div>
          <div className={style.title}>REACTION</div>
          <div className={style.orderList}>{reaction}</div>
        </div>
        <div>
          <div className={style.title}>ORDER</div>
          <div className={style.orderList}>{order}</div>
        </div>
        <div>
          <div className={style.title}>OFFER</div>
          <div className={style.orderList}>{offer}</div>
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
    const handleCreep = (creep, creepName) => {
      list[creep.creepType].push(
        <div>
          <Svg.creep content={creep} />
        </div>
      );
    };
    _.forEach(creeps, handleRole);
    _.forEach(list, (l, title) =>
      List.push(
        <div className={style.roleBox}>
          <div className={style.title}>{title.toUpperCase()}</div>
          <div className={style.creepBox}>{l}</div>
        </div>
      )
    );
    return <div className={style.creep}>{List}</div>;
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
          {this.creep()}
        </div>
      </div>
    );
  }
}
