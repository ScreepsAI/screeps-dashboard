import style from './index.scss';
import _ from 'lodash';

export default ({ content = {}, size = 60, scale = 0.8 }) => {
  const _size = size;
  size = size * scale;
  const MINERAL_TRANSFORM = content.mineralAmount / content.mineralCapacity;
  const ENERGY_WIDTH = 72 * (content.energy / content.energyCapacity);
  const ENERGY_X = -36 * (content.energy / content.energyCapacity);
  return (
    <div className={style.box} style={{ width: _size, height: _size }}>
      <svg viewBox="0 0 120 120" height={size} width={size}>
        <g transform="translate(60,55)">
          <path
            d="M 50 40 A 60 60 0 1 0 -50 40 V 63 H 50 Z"
            fill="#181818"
            stroke="#8FBB93"
            strokeWidth="5"
          />
          <path d="M 36 33 A 46 43 0 1 0 -36 33 Z" fill="#555" />
          <path
            d="M 36 33 A 46 43 0 1 0 -36 33 Z"
            fill="#FFF"
            transform={`matrix(${MINERAL_TRANSFORM},0,0,${MINERAL_TRANSFORM},0,${33 *
              (1 - MINERAL_TRANSFORM)})`}
          />
          <rect fill="#ffe56d" height="10" y="43" width={ENERGY_WIDTH} x={ENERGY_X} />
        </g>
      </svg>
    </div>
  );
};
