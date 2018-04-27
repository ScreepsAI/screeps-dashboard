import style from './index.scss';
import { Logo, Badge } from '../';

export default () => {
  return [
    <Logo key="header-left" />,
    <div key="header-right" className={style.right}>
      <div className={style.content}>
        <div>Screeps Dashboard</div>
        <div className={style.username}>{USERNAME}</div>
      </div>
      <a href={`https://screeps.com/a/#!/profile/${USERNAME}`} target="_blank">
        <Badge className={style.avatar} size="38" />
      </a>
    </div>,
  ];
};
