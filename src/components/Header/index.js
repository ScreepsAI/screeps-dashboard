import style from './index.scss';
import { Logo, Svg } from '../';

export default ({ badge }) => {
  return [
    <Logo key="header-left" />,
    <a
      key="header-right"
      className={style.right}
      href={`https://screeps.com/a/#!/profile/${USERNAME}`}
      target="_blank"
    >
      <div className={style.content}>
        <div>Screeps Dashboard</div>
        <div className={style.username}>{USERNAME}</div>
      </div>
      <Svg.badge className={style.avatar} content={badge} size="38" />
    </a>,
  ];
};
