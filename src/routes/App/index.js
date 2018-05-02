import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';
import { Spin, Progress, Tooltip } from 'antd';
import { View, Header, Box, Svg } from '../../components';
import _ from 'lodash';
import { updateDate, shortNumber } from '../../utils';
import { Room } from '../Room';

const State = ({ badge, memory, graph, global }) => {
  return {
    time: global.time,
    badge,
    memory,
    graph,
    loading: !_.get(memory, 'tick') || !_.get(graph, 'cpu') || !_.get(badge, 'type'),
    loadingBadge: !_.get(badge, 'type'),
  };
};

class App extends Component {
  componentWillMount() {
    const fetchData = () => {
      this.props.dispatch({ type: 'global/start' });
      this.props.dispatch({ type: 'badge/queryBadge' });
      this.props.dispatch({ type: 'graph/queryGraph' });
      this.props.dispatch({ type: 'memory/queryMemory' });
    };
    fetchData();
    setInterval(fetchData, 61000);
  }

  body = () => {
    const { badge, memory, graph, time } = this.props;
    const { gcl } = graph;
    const gclProgress = gcl.progress / gcl.progressTotal * 100;
    const gclTime = updateDate(gcl.deltas, gcl.progress, gcl.progressTotal);
    const tooltipText = (
      <div className={style.tooltip}>
        <div>
          Progress:{' '}
          <span>
            {[shortNumber(gcl.progress, 2), shortNumber(gcl.progressTotal, 2)].join(' / ')}
          </span>
        </div>
        <div>
          Speed: <span>{Math.floor(_.sum(gcl.deltas) / gcl.deltas.length / 60 * 3)} E/Tick</span>
        </div>
      </div>
    );
    let RoomView = [];
    _.forEach(memory.rooms, (roomMemory, roomName) =>
      RoomView.push(
        <Room
          key={roomName}
          name={roomName}
          memory={roomMemory}
          graph={graph.rooms[roomName]}
          badge={badge}
        />
      )
    );
    return (
      <View.body key={time}>
        <div className={style.showcase}>
          <Tooltip title={tooltipText}>
            <Svg.badge className={style.badge} content={badge} size="60" />
            <div className={style.avatarContent}>
              <a
                className={style.username}
                href={`https://screeps.com/a/#!/profile/${USERNAME}`}
                target="_blank"
              >
                {USERNAME}
              </a>
              <div className={style.progress}>
                <Progress percent={gclProgress} showInfo={false} />
                <div className={style.desc}>
                  {gclProgress.toFixed(1)}% Next level {gclTime}
                </div>
              </div>
            </div>
          </Tooltip>
          <div className={style.right}>
            <Box title="gcl" value={memory.gcl.level} color={['#baffe1', '#62e6ac']} circle />
            <Box title="credits" value={memory.market.credits} color={['#ffe3b1', '#ffc96b']} />
            <Box title="power" value={memory.gcl.power} color={['#FF9A9A', '#C54444']} />
          </div>
        </div>
        <div>{RoomView.reverse()}</div>
      </View.body>
    );
  };

  render() {
    const { loading, loadingBadge, badge } = this.props;
    return (
      <View>
        {loadingBadge ? (
          <View.body className={style.loadingBadge}>
            <Spin size="large" />
          </View.body>
        ) : (
          <View.header>
            <Header badge={badge} />
          </View.header>
        )}
        {loading ? (
          <View.body className={style.loading}>
            <Spin size="large" />
          </View.body>
        ) : (
          this.body()
        )}
        <View.footer>
          <div className={style.footerLeft}>
            © Develop by{' '}
            <a href="https://canisminor.cc" target="__blank">
              CanisMinor
            </a>{' '}
            2018
          </div>
          <div className={style.footerRight}>
            View on{' '}
            <a href="https://github.com/canisminor1990/screeps-dashboard" target="__blank">
              Github
            </a>{' '}
            MIT.
          </div>
        </View.footer>
      </View>
    );
  }
}

export default connect(State)(App);
