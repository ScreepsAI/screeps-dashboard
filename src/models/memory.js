import request from '../utils/request';

export default {
  namespace: 'memory',

  state: {},

  reducers: {
    queryMemorySuccess(state, action) {
      const stats = action.payload.Data;
      return stats;
    },
  },

  effects: {
    *queryMemory(action, { call, put }) {
      try {
        let Data = yield call(() => request('/api/stats'));
        Data = Data.data.data;
        yield put({ type: 'queryMemorySuccess', payload: { Data } });
      } catch (e) {
        console.log('data error', e);
      }
    },
  },
};
