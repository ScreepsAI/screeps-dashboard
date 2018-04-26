import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';

const State = ({ dispatch }) => {};

class App extends Component {
  render() {
    return <div>123</div>;
  }
}

export default connect(State)(App);
