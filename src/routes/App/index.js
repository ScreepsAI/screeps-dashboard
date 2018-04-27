import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';
import { Spin, Progress } from 'antd';
import { View, Header, Badge, Box } from '../../components';
import _ from 'lodash';
import { updateDate } from '../../utils';
import { Room } from '../Room';

const State = ({ memory, graph, loading, global }) => {
  return {
    time: global.time,
    memory,
    graph,
    loading: loading.global || !_.get(memory, 'tick') || !_.get(graph, 'cpu'),
  };
};

class App extends Component {
  componentWillMount() {
    this.props.dispatch({ type: 'global/start' });
    this.props.dispatch({ type: 'badge/queryBadge' });
    this.props.dispatch({ type: 'graph/queryGraph' });
    this.props.dispatch({ type: 'memory/queryMemory' });
  }

  body = () => {
    const { memory, graph, time } = this.props;
    const { gcl } = graph;
    const gclProgress = gcl.progress / gcl.progressTotal * 100;
    const gclTime = updateDate(gcl.deltas, gcl.progress, gcl.progressTotal);
    let RoomView = [];
    _.forEach(memory.rooms, (roomMemory, roomName) =>
      RoomView.push(
        <Room key={roomName} name={roomName} memory={roomMemory} graph={graph.rooms[roomName]} />
      )
    );
    return (
      <View.body key={time}>
        <div className={style.showcase}>
          <div className={style.left}>
            <Badge className={style.badge} size="60" />
            <div className={style.avatarContent}>
              <div className={style.username}>{USERNAME}</div>
              <div className={style.progress}>
                <Progress percent={gclProgress} showInfo={false} />
                <div className={style.desc}>
                  {gclProgress.toFixed(1)}% Next level {gclTime}
                </div>
              </div>
            </div>
          </div>
          <div className={style.right}>
            <Box title="gcl" value={memory.gcl.level} color={['#baffe1', '#62e6ac']} circle />
            <Box title="credits" value={memory.market.credits} color={['#ffe3b1', '#ffc96b']} />
            <Box title="power" value={memory.gcl.power} color={['#FF9A9A', '#C54444']} />
          </div>
        </div>
        <div>{RoomView}</div>
      </View.body>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <View>
        <View.header>
          <Header />
        </View.header>
        {loading ? (
          <View.body className={style.loading}>
            <Spin size="large" />
          </View.body>
        ) : (
          this.body()
        )}
      </View>
    );
  }
}

export default connect(State)(App);
