import request from '../utils/request';

export default {
  namespace: 'badge',

  state: {},

  reducers: {
    queryBadgeSuccess(state, action) {
      const badge = action.payload.Data;
      return badge;
    },
  },

  effects: {
    *queryBadge(action, { call, put }) {
      try {
        let Data = yield call(() => request(`https://screepspl.us/api/badge/${USERNAME}.json`));
        Data = Data.data;
        yield put({ type: 'queryBadgeSuccess', payload: { Data } });
      } catch (e) {
        console.log('data error', e);
      }
    },
  },
};
