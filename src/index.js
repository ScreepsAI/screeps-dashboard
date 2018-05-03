import { message } from 'antd';
import dva from 'dva';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';
import router from './router';
import './index.scss';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
  history: createHistory(),
  onError(e) {
    message.error(e.message, ERROR_MSG_DURATION);
  },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('./models/global').default);
app.model(require('./models/memory').default);
app.model(require('./models/graph').default);
app.model(require('./models/badge').default);
app.model(require('./models/market').default);
// 4. Router
app.router(router);

// 5. Start
app.start('#root');
