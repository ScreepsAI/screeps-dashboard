import style from './index.scss';

export default ({
  content = {
    energy: 300,
    spawning: true,
    remainingTime: 5,
    needTime: 10,
  },
  size = 60,
  scale = 0.8,
}) => {
  const _size = size;
  size = size * scale;
  let spawning;
  let animation;
  if (content.spawning) {
    const LARGE_ARC_FLAG = content.remainingTime + 0.01 > content.needTime / 2 ? 0 : 1;
    const END_X = 50 * Math.cos(-Math.PI * 2 * (content.remainingTime + 0.01) / content.needTime);
    const END_Y = 50 * Math.sin(-Math.PI * 2 * (content.remainingTime + 0.01) / content.needTime);
    spawning = (
      <path
        fill="transparent"
        d={`M 50 0 A 50 50 0 ${LARGE_ARC_FLAG} 1 ${END_X} ${END_Y}`}
        strokeWidth="15"
        stroke="#AAAAAA"
        transform="rotate(-90)"
      />
    );
    animation = (
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        dur="2s"
        keyTimes="0;0.25;1"
        repeatCount="indefinite"
        type="scale"
        values="1 1;1.24 1.24;1 1"
        calcMode="linear"
      />
    );
  }
  let energy;
  if (content.energy > 0) {
    const RADIUS = 38 * Math.min(content.energy / 300);
    energy = <ellipse rx={RADIUS} ry={RADIUS} cx="0" cy="0" fill="#FFE56D" />;
  }
  return (
    <div className={style.box} style={{ width: _size, height: _size }}>
      <svg viewBox="0 0 180 180" height={size} width={size}>
        <g transform="translate(90,90)">
          <g>
            <ellipse rx="70" ry="70" cx="0" cy="0" fill="#CCCCCC" />
            <ellipse rx="59" ry="59" cx="0" cy="0" fill="#181818" />
            <ellipse rx="37" ry="37" cx="0" cy="0" fill="#555555" />
            {spawning}
            {energy}
            {animation}
          </g>
        </g>
      </svg>
    </div>
  );
};
