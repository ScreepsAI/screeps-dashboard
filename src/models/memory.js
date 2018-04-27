import request from '../utils/request';
import _ from 'lodash';

export default {
  namespace: 'memory',

  state: {},

  reducers: {
    queryMemorySuccess(state, action) {
      const stats = action.payload;
      return stats;
    },
  },

  effects: {
    *queryMemory(action, { call, put, select }) {
      const time = yield select(state => state.global.time);
      const local = localStorage.getItem('memory');
      if (_.isNull(local) || (time > 0 && Date.now() - time > 60000)) {
        try {
          let Data = yield call(() => request('/api/stats'));
          Data = Data.data;
          localStorage.setItem('memory', JSON.stringify(Data.data));
          yield put({ type: 'global/setGlobal', payload: { time: Data.time, count: Data.count } });
          yield put({ type: 'queryMemorySuccess', payload: Data.data });
          console.log('querry new memory');
        } catch (e) {
          console.log('data error', e);
        }
      } else {
        console.log('load local memory');
        yield put({ type: 'queryMemorySuccess', payload: JSON.parse(local) });
      }
    },
  },
};
