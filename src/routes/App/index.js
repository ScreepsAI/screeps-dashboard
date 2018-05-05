import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';
import { Switch, Route } from 'dva/router';
import { View, Header } from '../../components';
import _ from 'lodash';
import Home from '../Home';
import Market from '../Market';
import Cpu from '../Cpu';
const State = ({ badge }) => {
  return {
    badge,
    loadingBadge: !_.get(badge, 'type'),
  };
};

class App extends Component {
  componentWillMount() {
    this.props.dispatch({ type: 'global/start' });
    this.props.dispatch({ type: 'badge/queryBadge' });
  }

  render() {
    const { loadingBadge, badge } = this.props;
    return (
      <View>
        {loadingBadge ? null : (
          <View.header>
            <Header badge={badge} />
          </View.header>
        )}
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/market" component={Market} />
          <Route exact path="/cpu" component={Cpu} />
        </Switch>
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
