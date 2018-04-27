import _ from 'lodash';

export default {
  namespace: 'global',

  state: {
    time: 0,
    count: 0,
  },

  reducers: {
    setGlobal(state, action) {
      const data = action.payload;
      if (data.time) localStorage.setItem('time', data.time);
      if (data.count) localStorage.setItem('count', data.count);
      return { ...state, ...data };
    },
  },

  effects: {
    *start(action, { put }) {
      const time = localStorage.getItem('time');
      if (!_.isNull(time)) yield put({ type: 'setGlobal', payload: { time } });
    },
  },
};
