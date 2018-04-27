import style from './index.scss';
import classnames from 'classnames/bind';
import { shortNumber } from '../../utils';

export default ({
  title,
  value,
  color = ['#fff', '#fff'],
  circle = false,
  small = false,
  fixWidth = false,
}) => {
  const classname = classnames.bind(style)('box', { circle, small, fixWidth });
  return (
    <div style={{ borderColor: color[1] }} className={classname}>
      <div style={{ color: color[0] }} className={style.title}>
        {title.toUpperCase()}
      </div>
      <div style={{ color: color[0] }} className={style.value}>
        {shortNumber(value)}
      </div>
    </div>
  );
};
