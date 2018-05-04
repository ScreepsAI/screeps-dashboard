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

View.footer = ({ children, className }) => (
  <div className={classnames(style.footer, className)}>{children}</div>
);

View.box = ({ left, right, className }) => (
  <div className={classnames(style.box, className)}>
    {left}
    {right}
  </div>
);

View.boxHeader = ({ svg, title, desc, className }) => (
  <div className={classnames(style.boxHeader, className)}>
    {svg}
    <div className={style.content}>
      <div className={style.title}>{title}</div>
      <div className={style.desc}>{desc}</div>
    </div>
  </div>
);

export default View;
