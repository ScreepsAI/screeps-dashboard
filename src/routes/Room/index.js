import { Component } from 'react';
import style from './index.scss';
import { Svg, Box } from '../../components';
import { updateDate } from '../../utils';
import { Progress } from 'antd';
import createF2 from 'f2react';
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
      const data = [];
      _.forEach(this.graph.deltas, (value, index) => data.push({ x: index, y: value }));
      const Line = createF2(chart => {
        chart.line().position('x*y');
        chart.axis(false);
        chart.render();
      });

      chart = <Line width={200} height={72} data={data} />;

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
      <div className={style.rcl}>
        <Svg.controller
          content={{
            level: controller.level,
            progress: controller.progress,
            progressTotal: controller.progressTotal,
          }}
        />
        <div className={style.progress}>
          <a href={`https://screeps.com/a/#!/room/shard2/${this.name}`} target="_blank">
            {this.name}
          </a>
          {progress}
        </div>
        {chart}
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
            {this.memory.storage.store > 0 ? (
              <Box
                title="storage"
                value={this.memory.storage.store}
                color={['rgb(255, 201, 107)', 'rgba(255, 201, 107, .5)']}
                small
              />
            ) : (
              ''
            )}
            {this.memory.terminal.store > 0 ? (
              <Box
                title="terminal"
                value={this.memory.terminal.store}
                color={['rgb(174, 129, 255)', 'rgba(174, 129, 255, .5)']}
                small
              />
            ) : (
              ''
            )}
          </div>
        </div>
        <div className={style.body} />
      </div>
    );
  }
}
