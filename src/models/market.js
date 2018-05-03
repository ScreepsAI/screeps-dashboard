import request from '../utils/request';
import _ from 'lodash';

export default {
  namespace: 'market',

  state: {},

  reducers: {
    queryMarketSuccess(state, action) {
      const market = action.payload;
      return market;
    },
  },

  effects: {
    *queryMarket(action, { call, put, select }) {
      const time = yield select(state => state.global.time);
      const local = localStorage.getItem('market');
      if (_.isNull(local) || (time > 0 && Date.now() - time > 60000)) {
        try {
          let Data = yield call(() => request('/api/market'));
          Data = Data.data;
          localStorage.setItem('market', JSON.stringify(Data.data));
          yield put({ type: 'global/setGlobal', payload: { time: Data.time, count: Data.count } });
          yield put({ type: 'queryGraphSuccess', payload: Data.data });
          console.log('querry new market');
        } catch (e) {
          console.log('data error', e);
        }
      } else {
        console.log('load local market');
        yield put({ type: 'queryMarketSuccess', payload: JSON.parse(local) });
      }
    },
  },
};
