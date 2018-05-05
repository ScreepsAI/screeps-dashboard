import style from './index.scss';
import { Logo, Menu, Svg } from '../';

export default ({ badge }) => {
  return [
    <a key="logo" href={`https://canisminor.cc`} target="_blank">
      <Logo />
    </a>,
    <div className={style.right} key="menu">
      <div className={style.content}>
        <div>Screeps Dashboard</div>
        <div className={style.username}>{USERNAME}</div>
      </div>
      <a key="header-right" href={`https://screeps.com/a/#!/profile/${USERNAME}`} target="_blank">
        <Svg.badge className={style.avatar} content={badge} size="38" />
      </a>
      <Menu
        content={[
          { title: 'Room', to: '/' },
          { title: 'Market', to: '/market' },
          { title: 'Cpu', to: '/cpu' },
        ]}
      />
    </div>,
  ];
};
