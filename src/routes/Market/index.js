import style from './index.scss';
import { Component } from 'react';
import { connect } from 'dva';
import { Spin, Tooltip } from 'antd';
import { View, Resource } from '../../components';
import _ from 'lodash';
import { formatNumber } from '../../utils';
import moment from 'moment';

const State = ({ market, memory, global }) => {
  return {
    time: global.time,
    send: memory.send,
    market,
    loading: !_.get(market, 'history') || !_.get(memory, 'send'),
  };
};

class Market extends Component {
  fetchData = () => {
    this.props.dispatch({ type: 'memory/queryMemory' });
    this.props.dispatch({ type: 'market/queryMarket' });
  };

  componentWillMount() {
    this.fetchData();
    window.clearInterval(window.fetchData);
    window.fetchData = self.setInterval(this.fetchData, 61000);
  }

  orders = () => {
    const { orders } = this.props.market;
    const list = [];
    _.forEach(_.sortBy(orders, ['active', 'type', 'remainingAmount']).reverse(), (o, i) => {
      const extendOrder = (
        <span className={style.extend}>{`Game.market.extendOrder('${o._id}',1000)`}</span>
      );
      const changePrice = (
        <span className={style.extend}>{`Game.market.changeOrderPrice('${o._id}',${
          o.price
        })`}</span>
      );
      const cancleOrder = (
        <span className={style.extend}>{`Game.market.cancelOrder('${o._id}')`}</span>
      );
      list.push(
        <tr key={i}>
          <td>
            <a
              href={`https://screeps.com/a/#!/market/all/shard2/${o.resourceType}`}
              target="__blank"
            >
              <Resource type={o.resourceType} />
            </a>
          </td>
          <td style={{ color: o.type === 'buy' ? '#fd971f' : '#66d9ef' }}>{o.type}</td>
          <td style={{ color: o.active ? '#a6e22e' : '#f92672' }}>
            <Tooltip title={cancleOrder}>{o.active.toString()}</Tooltip>
          </td>
          <td>
            <Tooltip title={changePrice}>{formatNumber(o.price)}</Tooltip>
          </td>
          <td className={style.right}>
            {formatNumber(o.amount, 0)}
            <span style={{ color: '#999' }}> / {formatNumber(o.remainingAmount, 0)}</span>
          </td>
          <td className={style.right}>
            {formatNumber(o.totalAmount, 0)}
            <Tooltip title={extendOrder}>
              <a className={style.btn}>+</a>
            </Tooltip>
          </td>
          <td className={style.right}>
            <a href={`https://screeps.com/a/#!/room/shard2/${o.roomName}`} target="__blank">
              {o.roomName}
            </a>
          </td>
        </tr>
      );
    });
    return (
      <table className={style.table}>
        <tbody>
          <tr className={style.header}>
            <th>Res</th>
            <th>Type</th>
            <th>Active</th>
            <th>Price</th>
            <th className={style.right}>Remaining</th>
            <th className={style.right}>Total</th>
            <th className={style.right}>Room</th>
          </tr>
          {list}
        </tbody>
      </table>
    );
  };

  history = () => {
    const { history } = this.props.market;
    const list = [];
    _.forEach(history, (o, i) => {
      o.type = o.type.replace('market.', '');
      const isBuy = o.type === 'buy';
      list.push(
        <tr key={i}>
          <td style={{ color: '#999' }}>{moment(o.date).format('MM/DD hh:mm')}</td>
          <td>
            <Resource type={o.market.resourceType} />
          </td>
          <td style={{ color: isBuy ? '#fd971f' : '#66d9ef' }}>{o.type}</td>
          <td>{formatNumber(o.market.price)}</td>
          <td className={style.right}>{formatNumber(o.market.amount, 0)}</td>
          <td style={{ color: isBuy ? '#f92672' : '#a6e22e' }} className={style.right}>
            {isBuy ? '-' : '+'}
            {formatNumber(o.change)}
            <span style={{ color: '#999' }}> / {formatNumber(o.balance)}</span>
          </td>
          <th className={style.right}>
            <a
              href={`https://screeps.com/a/#!/room/shard2/${o.market.targetRoomName}`}
              target="__blank"
            >
              {o.market.targetRoomName}
            </a>
          </th>
          <th className={style.right}>
            <a href={`https://screeps.com/a/#!/room/shard2/${o.market.roomName}`} target="__blank">
              {o.market.roomName}
            </a>
          </th>
        </tr>
      );
    });
    return (
      <table className={style.table}>
        <tbody>
          <tr className={style.header}>
            <th>Date</th>
            <th>Res</th>
            <th>Type</th>
            <th>Price</th>
            <th className={style.right}>Amount</th>
            <th className={style.right}>Change</th>
            <th className={style.right}>Target</th>
            <th className={style.right}>Room</th>
          </tr>
          {list}
        </tbody>
      </table>
    );
  };

  send = () => {
    const { send } = this.props;
    const list = [];
    _.forEach(send, (o, i) => {
      list.push(
        <tr key={i}>
          <td style={{ color: '#999' }}>{moment(o.time).format('MM/DD hh:mm')}</td>
          <td>
            <Resource type={o.type} />
          </td>
          <td className={style.right}>{formatNumber(o.amount, 0)}</td>
          <th className={style.right}>
            <a href={`https://screeps.com/a/#!/room/shard2/${o.from}`} target="__blank">
              {o.from}
            </a>
          </th>
          <th className={style.right}>
            <a href={`https://screeps.com/a/#!/room/shard2/${o.to}`} target="__blank">
              {o.to}
            </a>
          </th>
        </tr>
      );
    });
    return (
      <table className={style.table}>
        <tbody>
          <tr className={style.header}>
            <th>Date</th>
            <th>Res</th>
            <th className={style.right}>Amount</th>
            <th className={style.right}>From</th>
            <th className={style.right}>To</th>
          </tr>
          {list}
        </tbody>
      </table>
    );
  };

  body = () => {
    const { time } = this.props;
    return (
      <View.body key={time}>
        <div className={style.card}>
          <div className={style.title}>MARKET HISTORY</div>
          <div className={style.tableBox}>{this.history()}</div>
        </div>
        <div className={style.card}>
          <div className={style.title}>SEND HISTORY</div>
          <div className={style.tableBox}>{this.send()}</div>
        </div>
        <div className={style.card}>
          <div className={style.title}>MY ORDERS</div>
          <div className={style.tableBox}>{this.orders()}</div>
        </div>
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

export default connect(State)(Market);
