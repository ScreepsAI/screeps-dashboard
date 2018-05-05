import style from './index.scss';
import Badge from './badge';

export default ({
  content = {
    level: 1,
    progress: 50,
    progressTotal: 200,
  },
  badge,
  size = 60,
  scale = 1,
}) => {
  const _size = size;
  size = size * scale;
  const START_X = 80 * Math.cos(Math.PI / 8);
  const START_Y = 80 * Math.sin(Math.PI / 8);

  const DEST_A_X = 80 * Math.cos(Math.PI / 8 + Math.PI / 4);
  const DEST_A_Y = 80 * Math.sin(Math.PI / 8 + Math.PI / 4);

  const DEST_B_X = 80 * Math.cos(Math.PI / 8 + 2 * Math.PI / 4);
  const DEST_B_Y = 80 * Math.sin(Math.PI / 8 + 2 * Math.PI / 4);

  const DEST_C_X = 80 * Math.cos(Math.PI / 8 + 3 * Math.PI / 4);
  const DEST_C_Y = 80 * Math.sin(Math.PI / 8 + 3 * Math.PI / 4);

  const DEST_D_X = 80 * Math.cos(Math.PI / 8 + 4 * Math.PI / 4);
  const DEST_D_Y = 80 * Math.sin(Math.PI / 8 + 4 * Math.PI / 4);

  const DEST_E_X = 80 * Math.cos(Math.PI / 8 + 5 * Math.PI / 4);
  const DEST_E_Y = 80 * Math.sin(Math.PI / 8 + 5 * Math.PI / 4);

  const DEST_F_X = 80 * Math.cos(Math.PI / 8 + 6 * Math.PI / 4);
  const DEST_F_Y = 80 * Math.sin(Math.PI / 8 + 6 * Math.PI / 4);

  const DEST_G_X = 80 * Math.cos(Math.PI / 8 + 7 * Math.PI / 4);
  const DEST_G_Y = 80 * Math.sin(Math.PI / 8 + 7 * Math.PI / 4);

  const DEST = [
    DEST_A_X,
    DEST_A_Y,
    DEST_B_X,
    DEST_B_Y,
    DEST_C_X,
    DEST_C_Y,
    DEST_D_X,
    DEST_D_Y,
    DEST_E_X,
    DEST_E_Y,
    DEST_F_X,
    DEST_F_Y,
    DEST_G_X,
    DEST_G_Y,
  ].join(' ');

  let innerSvg;
  if (content.level < 8) {
    const LARGE_ARC_FLAG = content.progress < content.progressTotal / 2 ? 0 : 1;
    const END_X =
      19 *
      Math.cos(-Math.PI * 2 * (content.progressTotal - content.progress) / content.progressTotal);
    const END_Y =
      19 *
      Math.sin(-Math.PI * 2 * (content.progressTotal - content.progress) / content.progressTotal);
    innerSvg = (
      <path
        fill="transparent"
        strokeOpacity="0.4"
        strokeWidth="38"
        stroke="#FFFFFF"
        transform="rotate(-90)"
        d={`M 19 0 A 19 19 0 ${LARGE_ARC_FLAG} 1 ${END_X} ${END_Y}`}
      />
    );
  }
  const BADGE_SCALE = 0.8;
  if (content.level < 8) {
  }
  return (
    <div className={style.box} style={{ width: _size, height: _size }}>
      <svg height={size} width={size} viewBox="0 0 200 200">
        <g transform="translate(100,100)">
          <path
            fill="#FFFFFF"
            fillOpacity="0.1"
            transform="scale(1.2 1.2)"
            d={`M ${START_X} ${START_Y} L ${DEST} Z`}
          />
          <path fill="#0A0A0A" d={`M ${START_X} ${START_Y} L ${DEST} Z`} />
          <path
            fill="#CCCCCC"
            paintOrder="fill"
            strokeWidth="6"
            stroke="#0A0A0A"
            d={getLevelsPath(content.level)}
          />
          <ellipse cx="0" cy="0" fill="#222222" rx="37" ry="37" />
          <ellipse
            cx="0"
            cy="0"
            fill="transparent"
            rx="40"
            ry="40"
            strokeWidth="10"
            stroke="#080808"
          />
          <g
            transform={`translate(${-50 * BADGE_SCALE}, ${-50 *
              BADGE_SCALE}) scale(${BADGE_SCALE})`}
          >
            <Badge content={badge} svg={false} />
          </g>
          {innerSvg}
        </g>
      </svg>
    </div>
  );
};

function getLevelsPath(level) {
  const initial = 'M 0 0 L -28.70125742738173 -69.2909649383465';
  const segments = [
    'L 28.701257427381737 -69.2909649383465 Z',
    'M 0 0 L 28.701257427381737 -69.2909649383465 L 69.2909649383465 -28.701257427381734 Z',
    'M 0 0 L 69.2909649383465 -28.701257427381734 L 69.2909649383465 28.701257427381734 Z',
    'M 0 0 L 69.2909649383465 28.701257427381734 L 28.701257427381737 69.2909649383465 Z',
    'M 0 0 L 28.701257427381737 69.2909649383465 L -28.70125742738173 69.2909649383465 Z',
    'M 0 0 L -28.70125742738173 69.2909649383465 L -69.2909649383465 28.70125742738174 Z',
    'M 0 0 L -69.2909649383465 28.70125742738174 L -69.29096493834652 -28.701257427381726 Z',
    'M 0 0 L -69.29096493834652 -28.701257427381726 L -28.701257427381776 -69.29096493834649 Z',
  ];
  let path = initial + ' ';
  for (let i = 0; i < level; i++) {
    path += segments[i] + ' ';
  }
  return path;
}
