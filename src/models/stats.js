import request from '../utils/request';

export default {
  namespace: 'stats',

  state: {},

  reducers: {
    queryStatsSuccess(state, action) {
      const stats = action.payload.Data;
      return { ...state, stats };
    },
  },

  effects: {
    *queryStats(action, { call, put }) {
      try {
        const Data = yield call(() => request('/api/stats'));
        yield put({ type: 'queryStatsSuccess', payload: { Data } });
      } catch (e) {
        console.log('data error', e);
      }
    },
  },
};
