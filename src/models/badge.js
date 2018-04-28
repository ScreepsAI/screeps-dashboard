import request from '../utils/request';
import _ from 'lodash';

export default {
  namespace: 'badge',

  state: {},

  reducers: {
    queryBadgeSuccess(state, action) {
      const badge = action.payload;
      return badge;
    },
  },

  effects: {
    *queryBadge(action, { select, call, put }) {
      const time = yield select(state => state.global.time);
      const local = localStorage.getItem('badge');
      if (_.isNull(local) || (time > 0 && Date.now() - time > 3600000)) {
        try {
          let Data = yield call(() => request(`https://screepspl.us/api/badge/${USERNAME}.json`));
          Data = Data.data;
          localStorage.setItem('badge', JSON.stringify(Data));
          yield put({ type: 'queryBadgeSuccess', payload: Data });
          console.log('querry new badge');
        } catch (e) {
          console.log('data error', e);
        }
      } else {
        console.log('load local badge');
        yield put({ type: 'queryBadgeSuccess', payload: JSON.parse(local) });
      }
    },
  },
};
