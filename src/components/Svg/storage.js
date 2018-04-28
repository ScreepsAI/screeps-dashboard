import style from './index.scss';
import _ from 'lodash';

export default ({
  content = {
    energy: 100,
    power: 100,
    K: 100,
  },
  size = 60,
  scale = 0.8,
}) => {
  const _size = size;
  size = size * scale;
  const CAPACITY = 1000000;
  const ENERGY = content.energy;
  const POWER = content.power || 0;
  const TOTAL = _.sum(Object.values(content));
  const OTHER = TOTAL - POWER - ENERGY;

  const HEIGHT = 120;
  const START_Y = 60;

  const ENERGY_HEIGHT = ENERGY * HEIGHT / CAPACITY;
  const POWER_HEIGHT = (POWER + ENERGY) * HEIGHT / CAPACITY;
  const OTHER_HEIGHT = TOTAL * HEIGHT / CAPACITY;

  const POWER_Y = START_Y - POWER_HEIGHT;
  const ENERGY_Y = START_Y - ENERGY_HEIGHT;
  const MINERAL_Y = START_Y - OTHER_HEIGHT;

  return (
    <div className={style.box} style={{ width: _size, height: _size }}>
      <svg height={size} width={size * (5 / 6)} viewBox="0 0 40 180">
        <g transform="translate(20,90)">
          <path
            d="M -60 -70 A 120 120 0 0 1 60 -70 A 300 300 0 0 1 60 70 A 120 120 0 0 1 -60 70 A 300 300 0 0 1 -60 -70 Z"
            fill="#181818"
            stroke="#8FBB93"
            strokeWidth="5"
          />
          <rect fill="#555" height="120" width="100" x="-50" y="-60" />
          {OTHER > 0 ? (
            <rect x="-50" y={MINERAL_Y} width="100" height={OTHER_HEIGHT} fill="#FFFFFF" />
          ) : null}
          {POWER > 0 ? (
            <rect x="-50" y={POWER_Y} width="100" height={POWER_HEIGHT} fill="#F41F33" />
          ) : null}
          {ENERGY > 0 ? (
            <rect x="-50" y={ENERGY_Y} width="100" height={ENERGY_HEIGHT} fill="#FFE56D" />
          ) : null}
        </g>
      </svg>
    </div>
  );
};
