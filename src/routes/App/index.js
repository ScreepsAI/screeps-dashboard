import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';
import { Spin, Progress } from 'antd';
import { View, Header, Badge, Box } from '../../components';

const State = ({ memory, graph, loading }) => {
  return {
    memory,
    graph,
    loading: loading.global || !memory.tick || !graph.cpu,
  };
};

class App extends Component {
  componentWillMount() {
    this.props.dispatch({ type: 'badge/queryBadge' });
    this.props.dispatch({ type: 'graph/queryGraph' });
    this.props.dispatch({ type: 'memory/queryMemory' });
  }

  body = () => {
    const { memory, graph } = this.props;
    return (
      <View.body>
        <div className={style.showcase}>
          <div className={style.left}>
            <Badge className={style.badge} size="60" />
            <div className={style.avatarContent}>
              <div className={style.username}>{USERNAME}</div>
              <div className={style.progress}>
                <Progress
                  percent={(memory.gcl.progress / memory.gcl.progressTotal * 100).toFixed(1)}
                />
                <span>{}</span>
              </div>
            </div>
          </div>
          <div className={style.right}>
            <Box title="gcl" value={memory.gcl.level} color={['#baffe1', '#62e6ac']} circle />
            <Box title="credits" value={memory.market.credits} color={['#ffe3b1', '#ffc96b']} />
            <Box title="power" value={memory.gcl.power} color={['#FF9A9A', '#C54444']} />
          </div>
        </div>
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
