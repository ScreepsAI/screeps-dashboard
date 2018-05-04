import style from './index.scss';
import Badge from './badge';
import _ from 'lodash';

export default ({
  content = {
    body: { move: 1 },
  },
  badge,
  size = 32,
  scale = 0.8,
  bodyBox = false,
  array = false,
}) => {
  const _size = size;
  size = size * scale;

  let parts = [];
  if (!array) {
    _.forEach(content.body, (v, k) => {
      if (k !== 'carry') parts = parts.concat(_.fill(Array(v), k));
    });
  } else {
    parts = _.filter(content.body, v => v !== 'carry');
  }

  const PART_COLOURS = {
    carry: undefined,
    move: '#A9B7C6',
    work: '#FFE56D',
    claim: '#B99CFB',
    attack: '#F93842',
    ranged_attack: '#5D80B2',
    heal: '#65FD62',
    tough: '#858585',
  };

  if (bodyBox) {
    const Body = [];
    _.forEach(parts, (p, i) => Body.push(<div key={i} style={{ background: PART_COLOURS[p] }} />));
    return <div className={style.bodybox}>{Body}</div>;
  }

  const BORDER_COLOUR = '#202020';
  const INTERNAL_COLOUR = '#555555';

  const BORDER_WIDTH = 8;
  const CENTER_X = 25;
  const CENTER_Y = 25;
  const RADIUS = 15;

  const TOUGH_EXTRA_RADIUS = 8;

  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
  }

  function partsArc(partType, partCount, prevPartCount) {
    if (partType === 'carry') {
      return null;
    }

    const centerAngle = partType === 'move' ? 180 : 0;

    const arcLength = (prevPartCount + partCount) / 50 * 360;
    const startAngle = centerAngle - arcLength / 2;
    const endAngle = centerAngle + arcLength / 2;
    return (
      <path
        key={partType}
        d={describeArc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle)}
        fill="none"
        stroke={PART_COLOURS[partType]}
        strokeWidth={BORDER_WIDTH}
      />
    );
  }

  const partCounts = _.countBy(parts);

  const TOUGH_OPACITY = (partCounts.tough || 0) / 50;

  const arcs = [];

  const PRIO = {
    carry: 0,
    move: 0,
    work: 1,
    claim: 5,
    attack: 2,
    ranged_attack: 3,
    heal: 4,
    tough: 0,
  };

  const keys = Object.keys(partCounts).sort(
    (a, b) => partCounts[b] - partCounts[a] || PRIO[b] - PRIO[a]
  );
  keys.reverse().reduce((partsTotal, type) => {
    if (type !== 'tough') {
      if (type === 'move') {
        arcs.push(partsArc(type, partCounts[type], 0));
        return partsTotal;
      } else {
        arcs.push(partsArc(type, partCounts[type], partsTotal));
        partsTotal += partCounts[type];
      }
    }
    return partsTotal;
  }, 0);

  let partsRender = [];
  arcs.reverse().forEach(arc => partsRender.push(arc));

  const BADGE_SCALE = 0.23;
  return (
    <div className={style.box} style={{ width: _size, height: _size }}>
      <svg width={size} height={size} viewBox="0 0 48 48">
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS + TOUGH_EXTRA_RADIUS}
          fill={PART_COLOURS.tough}
          fillOpacity={TOUGH_OPACITY}
        />
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RADIUS}
          fill={INTERNAL_COLOUR}
          stroke={BORDER_COLOUR}
          strokeWidth={BORDER_WIDTH}
        />
        <g
          transform={`translate(${24 - 48 * BADGE_SCALE}, ${24 -
            48 * BADGE_SCALE}) scale(${BADGE_SCALE})`}
        >
          <Badge content={badge} svg={false} />
        </g>
        {partsRender}
      </svg>
    </div>
  );
};
