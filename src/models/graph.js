import request from '../utils/request';

export default {
  namespace: 'graph',

  state: {},

  reducers: {
    queryGraphSuccess(state, action) {
      const graph = action.payload.Data;
      return graph;
    },
  },

  effects: {
    *queryGraph(action, { call, put }) {
      try {
        let Data = yield call(() => request('/api/graph'));
        Data = Data.data.data;
        yield put({ type: 'queryGraphSuccess', payload: { Data } });
      } catch (e) {
        console.log('data error', e);
      }
    },
  },
};
