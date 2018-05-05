import style from './index.scss';
import { Logo, Menu } from '../';

export default ({ badge }) => {
  return [
    <Logo key="logo" />,
    <div key="menu">
      <div className={style.content}>
        <div>Screeps Dashboard</div>
        <div className={style.username}>{USERNAME}</div>
      </div>
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
