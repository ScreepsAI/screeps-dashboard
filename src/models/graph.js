import request from '../utils/request';
import _ from 'lodash';

export default {
  namespace: 'graph',

  state: {},

  reducers: {
    queryGraphSuccess(state, action) {
      const graph = action.payload;
      return graph;
    },
  },

  effects: {
    *queryGraph(action, { call, put, select }) {
      const time = yield select(state => state.global.time);
      const local = localStorage.getItem('graph');
      if (_.isNull(local) || (time > 0 && Date.now() - time > 60000)) {
        try {
          let Data = yield call(() => request('/api/graph'));
          Data = Data.data;
          localStorage.setItem('graph', JSON.stringify(Data.data));
          yield put({ type: 'global/setGlobal', payload: { time: Data.time, count: Data.count } });
          yield put({ type: 'queryGraphSuccess', payload: Data.data });
          console.log('querry new graph');
        } catch (e) {
          console.log('data error', e);
        }
      } else {
        console.log('load local graph');
        yield put({ type: 'queryGraphSuccess', payload: JSON.parse(local) });
      }
    },
  },
};
