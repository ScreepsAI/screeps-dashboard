import _ from 'lodash';
import style from './index.scss';
export default ({ type = 'O', size = 16 }) => {
  let finalWidth = size;
  let content;
  if (type === 'energy') {
    content = <circle cx={size / 2} cy={size / 2} r={size / 4} style={{ fill: '#fee476' }} />;
  } else if (type === 'energy') {
    content = <circle cx={size / 2} cy={size / 2} r={size / 4} style={{ fill: '#f1243a' }} />;
  } else {
    const BASE_MINERALS = {
      H: { back: `#4D4D4D`, front: `#CCCCCC` },
      O: { back: `#4D4D4D`, front: `#CCCCCC` },
      U: { back: `#1B617F`, front: `#88D6F7` },
      L: { back: `#3F6147`, front: `#89F4A5` },
      K: { back: `#331A80`, front: `#9370FF` },
      Z: { back: `#594D33`, front: `#F2D28B` },
      X: { back: `#4F2626`, front: `#FF7A7A` },
    };

    const COMPOUNDS = {
      U: { back: `#58D7F7`, front: `#157694` },
      L: { back: `#29F4A5`, front: `#22815A` },
      K: { back: `#9F76FC`, front: `#482794` },
      Z: { back: `#FCD28D`, front: `#7F6944` },
      G: { back: `#FFFFFF`, front: `#767676` },
      OTHER: { back: `#b4b4b4`, front: `#666666` },
    };

    let colours = BASE_MINERALS[type];

    if (colours) {
      content = [
        <circle
          key="circle"
          cx={size / 2}
          cy={size / 2}
          r={size / 2.2}
          style={{ strokeWidth: 2, stroke: colours.front, fill: colours.back }}
        />,
        <text
          key="text"
          x={size / 2}
          y={size / 2 + +size / 15}
          fontFamily="Verdana"
          fontSize={size / 1.5}
          alignmentBaseline="middle"
          textAnchor="middle"
          style={{
            fill: colours.front,
            fontWeight: 'bold',
          }}
        >
          {type === undefined ? '?' : type}
        </text>,
      ];
    } else {
      let compoundType = type[0] === 'X' ? type[1] : type[0];
      if (_.includes(['OH', 'ZK', 'UL'], type)) compoundType = 'OTHER';
      colours = COMPOUNDS[compoundType];
      if (colours) {
        let width = size + (type.length - 1) * size / 2;
        finalWidth = width;
        content = [
          <rect
            key="rect"
            x="0"
            y="0"
            width={width}
            height={size}
            style={{ fill: colours.back }}
          />,
          <text
            key="text"
            x={width / 2.0}
            y={size / 2 + size / 15}
            fontFamily="Verdana"
            fontSize={size / 1.5}
            alignmentBaseline="middle"
            textAnchor="middle"
            style={{ fill: colours.front, fontWeight: 'bold' }}
          >
            {type}
          </text>,
        ];
      }
    }
  }

  return (
    <div className={style.resource}>
      <svg width={finalWidth} height={size}>
        {content}
      </svg>
    </div>
  );
};
