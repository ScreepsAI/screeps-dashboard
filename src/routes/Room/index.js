import { Component } from 'react';
import style from './index.scss';
import { Svg, Box } from '../../components';
import { updateDate } from '../../utils';
import { Progress } from 'antd';

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
      </div>
    );
  };

  render() {
    return (
      <div className={style.roomView}>
        <div className={style.header}>
          {this.rcl()}
          <div className={style.right}>
            <Box title="rcl" value={this.memory.RCL} color={['#baffe1', '#62e6ac']} circle small />
            {this.memory.storage.store > 0 ? (
              <Box
                title="storage"
                value={this.memory.storage.store}
                color={['#ffe3b1', '#ffc96b']}
                fixWidth
                small
              />
            ) : (
              ''
            )}
            {this.memory.terminal.store > 0 ? (
              <Box
                title="terminal"
                value={this.memory.terminal.store}
                color={['#ae81ff', '#ae81ff']}
                fixWidth
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
