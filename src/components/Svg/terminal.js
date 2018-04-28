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
  const CAPACITY = 300000;
  const ENERGY = content.energy;
  const POWER = content.power || 0;
  const TOTAL = _.sum(Object.values(content));
  const OTHER = TOTAL - POWER - ENERGY;

  const OTHER_SCALE = Math.min(1, TOTAL / CAPACITY);
  const POWER_SCALE = Math.min(1, (POWER + ENERGY) / CAPACITY);
  const ENERGY_SCALE = Math.min(1, ENERGY / CAPACITY);

  return (
    <div className={style.box} style={{ width: _size, height: _size }}>
      <svg height={size} width={size * (5 / 6)} viewBox="0 0 175 175">
        <g transform="translate(87.5,87.5)">
          <path
            d="M 85 0 L 55 -55 L 0 -85 L -55 -55 L -85 0 L -55 55 L 0 85 L 55 55 Z"
            fill="#181818"
            stroke="#8FBB93"
            strokeWidth="5"
          />
          <path
            d="M 67 0 L 48 -35 V 35 L 67 0 Z M 0 -67 L -35 -48 H 35 Z M -67 0 L -48 -35 V 35 Z M 0 67 L -35 48 H 35 Z"
            fill="#AAA"
          />
          <rect fill="#181818" height="90" width="90" x="-45" y="-45" />
          <rect fill="#555555" height="76" width="76" x="-38" y="-38" />
          {OTHER > 0 ? (
            <rect
              fill="#FFF"
              height="76"
              width="76"
              x="-38"
              y="-38"
              transform={`scale(${OTHER_SCALE} ${OTHER_SCALE})`}
            />
          ) : null}
          {POWER > 0 ? (
            <rect
              fill="#F41F33"
              height="76"
              width="76"
              x="-38"
              y="-38"
              transform={`scale(${POWER_SCALE} ${POWER_SCALE})`}
            />
          ) : null}
          {ENERGY > 0 ? (
            <rect
              fill="#FFE56D"
              height="76"
              width="76"
              x="-38"
              y="-38"
              transform={`scale(${ENERGY_SCALE} ${ENERGY_SCALE})`}
            />
          ) : null}
        </g>
      </svg>
    </div>
  );
};
