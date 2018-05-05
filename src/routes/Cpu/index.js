import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import { View } from '../../components';
import _ from 'lodash';
import createF2 from 'f2react';

const State = ({ graph, global }) => {
  return {
    time: global.time,
    cpu: graph.cpu,
    loading: !_.get(graph, 'cpu'),
  };
};

class Cpu extends Component {
  fetchData = () => {
    this.props.dispatch({ type: 'graph/queryGraph' });
  };

  componentWillMount() {
    this.fetchData();
    window.clearInterval(window.fetchData);
    window.fetchData = self.setInterval(this.fetchData, 61000);
  }

  cpu = () => {
    const { used, limit } = this.props.cpu;
    const data = [];
    _.forEach(used, (y, x) => data.push({ x, y }));
    const Line = createF2(chart => {
      chart.source(data, {
        y: {
          min: 0,
          max: limit,
        },
      });
      chart.line().position('x*y');
      chart.area().position('x*y');
      chart.tooltip(false);
      chart.axis(false);
      chart.render();
    });
    return (
      <div className={style.chart}>
        <div className={style.title}>
          CPU {used[used.length - 1]} / {limit}
        </div>
        <div className={style.desc}>
          avg: {Math.floor(_.sum(used) / used.length)} / max: {_.max(used)} / min: {_.min(used)}
        </div>
        <Line width={1024} height={200} padding={[10, -100, 0, 0]} data={data} />
      </div>
    );
  };
  bucket = () => {
    const { bucket } = this.props.cpu;
    const data = [];
    _.forEach(bucket, (y, x) => data.push({ x, y }));
    const Line = createF2(chart => {
      chart.source(data, {
        y: {
          min: 0,
          max: 10000,
        },
      });
      chart.line().position('x*y');
      chart.area().position('x*y');
      chart.tooltip(false);
      chart.axis(false);
      chart.render();
    });
    return (
      <div className={style.chart}>
        <div className={style.title}>BUCKET {bucket[bucket.length - 1]}</div>
        <div className={style.desc}>
          avg: {Math.floor(_.sum(bucket) / bucket.length)} / max: {_.max(bucket)} / min:{' '}
          {_.min(bucket)}
        </div>
        <Line width={1024} height={200} padding={[10, -100, 0, 0]} data={data} />
      </div>
    );
  };
  body = () => {
    const { time } = this.props;
    return (
      <View.body key={time}>
        {this.cpu()}
        {this.bucket()}
      </View.body>
    );
  };

  render() {
    const { loading } = this.props;
    return loading ? (
      <View.body className={style.loading}>
        <Spin size="large" />
      </View.body>
    ) : (
      this.body()
    );
  }
}

export default connect(State)(Cpu);
