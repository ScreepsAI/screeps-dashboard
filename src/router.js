import { Route, Router } from 'dva/router';
import App from './routes/App';

export default ({ history }) => {
  history.listen(() => window.scrollTo(0, 0));
  return (
    <Router history={history}>
      <Route path="/" component={App} />
    </Router>
  );
};
