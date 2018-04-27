import style from './index.scss';
import classnames from 'classnames';

const View = ({ children, className }) => (
  <div className={classnames(style.view, className)}>{children}</div>
);
View.header = ({ children, className }) => (
  <div className={classnames(style.header, className)}>{children}</div>
);
View.body = ({ children, className }) => (
  <div className={classnames(style.body, className)}>{children}</div>
);

export default View;
