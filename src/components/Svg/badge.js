import _ from 'lodash';
import style from './index.scss';
import classnames from 'classnames';

export default ({ className, content, size = 100, scale = 1, svg = true }) => {
  const badgePaths = getBadgePaths();
  const colors = getColors();
  let path1;
  let path2;
  if (_.isNumber(content.color1) && colors[content.color1])
    content.color1 = colors[content.color1].rgb || '#FF0000';
  if (_.isNumber(content.color2) && colors[content.color2])
    content.color2 = colors[content.color2].rgb || '#FF0000';
  if (_.isNumber(content.color3) && colors[content.color3])
    content.color3 = colors[content.color3].rgb || '#FF0000';
  if (_.isNumber(content.type)) {
    const bp = badgePaths[content.type];
    bp.calc(content.param);
    path1 = bp.path1;
    path2 = bp.path2;
  } else {
    path1 = content.type.path1;
    path2 = content.type.path2;
  }

  const inner = [
    <circle key="path0" cx="50" cy="50" r="50" fill={content.color1} />,
    <path key="path1" d={path1} fill={content.color2} />,
    <path key="path2" d={path2} fill={content.color3} />,
  ];

  if (svg) {
    return (
      <div className={classnames(style.badgeBox, className)} style={{ width: size, height: size }}>
        <svg height={size} width={size} viewBox="0 0 100 100">
          <g
            transform={`translate(${size / 2 * (1 - scale)}, ${size /
              2 *
              (1 - scale)}) scale(${scale})`}
          >
            {inner}
          </g>
        </svg>
      </div>
    );
  } else {
    return inner;
  }
};

function getBadgePaths() {
  return {
    1: {
      calc: function(param) {
        let vert = 0;
        let hor = 0;
        if (param > 0) {
          vert = param * 30 / 100;
        }
        if (param < 0) {
          hor = -param * 30 / 100;
        }
        this.path1 = 'M 50 ' + (100 - vert) + ' L ' + hor + ' 50 H ' + (100 - hor) + ' Z';
        this.path2 = 'M ' + hor + ' 50 H ' + (100 - hor) + ' L 50 ' + vert + ' Z';
      },
    },
    2: {
      calc: function(param) {
        let x = 0;
        let y = 0;
        if (param > 0) {
          x = param * 30 / 100;
        }
        if (param < 0) {
          y = -param * 30 / 100;
        }
        this.path1 = 'M ' + x + ' ' + y + ' L 50 50 L ' + (100 - x) + ' ' + y + ' V -1 H -1 Z';
        this.path2 =
          'M ' +
          x +
          ' ' +
          (100 - y) +
          ' L 50 50 L ' +
          (100 - x) +
          ' ' +
          (100 - y) +
          ' V 101 H -1 Z';
      },
    },
    3: {
      calc: function(param) {
        let angle = Math.PI / 4 + Math.PI / 4 * (param + 100) / 200;
        let angle1 = -Math.PI / 2;
        let angle2 = Math.PI / 2 + Math.PI / 3;
        let angle3 = Math.PI / 2 - Math.PI / 3;
        this.path1 =
          'M 50 50 L ' +
          (50 + 100 * Math.cos(angle1 - angle / 2)) +
          ' ' +
          (50 + 100 * Math.sin(angle1 - angle / 2)) +
          ' L ' +
          (50 + 100 * Math.cos(angle1 + angle / 2)) +
          ' ' +
          (50 + 100 * Math.sin(angle1 + angle / 2)) +
          ' Z';
        this.path2 =
          'M 50 50 L ' +
          (50 + 100 * Math.cos(angle2 - angle / 2)) +
          ' ' +
          (50 + 100 * Math.sin(angle2 - angle / 2)) +
          ' L ' +
          (50 + 100 * Math.cos(angle2 + angle / 2)) +
          ' ' +
          (50 + 100 * Math.sin(angle2 + angle / 2)) +
          ' Z\n                          M 50 50 L ' +
          (50 + 100 * Math.cos(angle3 - angle / 2)) +
          ' ' +
          (50 + 100 * Math.sin(angle3 - angle / 2)) +
          ' L ' +
          (50 + 100 * Math.cos(angle3 + angle / 2)) +
          ' ' +
          (50 + 100 * Math.sin(angle3 + angle / 2));
      },
      flip: 'rotate180',
    },
    4: {
      calc: function(param) {
        param += 100;
        let y1 = 50 - param * 30 / 200;
        let y2 = 50 + param * 30 / 200;
        this.path1 = 'M 0 ' + y2 + ' H 100 V 100 H 0 Z';
        this.path2 = param > 0 ? 'M 0 ' + y1 + ' H 100 V ' + y2 + ' H 0 Z' : '';
      },
      flip: 'rotate90',
    },
    5: {
      calc: function(param) {
        param += 100;
        let x1 = 50 - param * 10 / 200 - 10;
        let x2 = 50 + param * 10 / 200 + 10;
        this.path1 = 'M ' + x1 + ' 0 H ' + x2 + ' V 100 H ' + x1 + ' Z';
        this.path2 = 'M 0 ' + x1 + ' H 100 V ' + x2 + ' H 0 Z';
      },
      flip: 'rotate45',
    },
    6: {
      calc: function(param) {
        let width = 5 + (param + 100) * 8 / 200;
        let x1 = 50;
        let x2 = 20;
        let x3 = 80;
        this.path1 = 'M ' + (x1 - width) + ' 0 H ' + (x1 + width) + ' V 100 H ' + (x1 - width);
        this.path2 =
          'M ' +
          (x2 - width) +
          ' 0 H ' +
          (x2 + width) +
          ' V 100 H ' +
          (x2 - width) +
          ' Z\n                          M ' +
          (x3 - width) +
          ' 0 H ' +
          (x3 + width) +
          ' V 100 H ' +
          (x3 - width) +
          ' Z';
      },
      flip: 'rotate90',
    },
    7: {
      calc: function(param) {
        let w = 20 + param * 10 / 100;
        this.path1 = 'M 0 50 Q 25 30 50 50 T 100 50 V 100 H 0 Z';
        this.path2 =
          'M 0 ' +
          (50 - w) +
          ' Q 25 ' +
          (30 - w) +
          ' 50 ' +
          (50 - w) +
          ' T 100 ' +
          (50 - w) +
          '\n                            V ' +
          (50 + w) +
          ' Q 75 ' +
          (70 + w) +
          ' 50 ' +
          (50 + w) +
          ' T 0 ' +
          (50 + w) +
          ' Z';
      },
      flip: 'rotate90',
    },
    8: {
      calc: function(param) {
        let y = param * 20 / 100;
        this.path1 = 'M 0 50 H 100 V 100 H 0 Z';
        this.path2 = 'M 0 50 Q 50 ' + y + ' 100 50 Q 50 ' + (100 - y) + ' 0 50 Z';
      },
      flip: 'rotate90',
    },
    9: {
      calc: function(param) {
        let y1 = 0;
        let y2 = 50;
        let h = 70;
        if (param > 0) y1 += param / 100 * 20;
        if (param < 0) y2 += param / 100 * 30;
        this.path1 = 'M 50 ' + y1 + ' L 100 ' + (y1 + h) + ' V 101 H 0 V ' + (y1 + h) + ' Z';
        this.path2 =
          'M 50 ' + (y1 + y2) + ' L 100 ' + (y1 + y2 + h) + ' V 101 H 0 V ' + (y1 + y2 + h) + ' Z';
      },
      flip: 'rotate180',
    },
    10: {
      calc: function(param) {
        let r = 30;
        let d = 7;
        if (param > 0) r += param * 50 / 100;
        if (param < 0) d -= param * 20 / 100;
        this.path1 =
          'M ' +
          (50 + d + r) +
          ' ' +
          (50 - r) +
          ' A ' +
          r +
          ' ' +
          r +
          ' 0 0 0 ' +
          (50 + d + r) +
          ' ' +
          (50 + r) +
          ' H 101 V ' +
          (50 - r) +
          ' Z';
        this.path2 =
          'M ' +
          (50 - d - r) +
          ' ' +
          (50 - r) +
          ' A ' +
          r +
          ' ' +
          r +
          ' 0 0 1 ' +
          (50 - d - r) +
          ' ' +
          (50 + r) +
          ' H -1 V ' +
          (50 - r) +
          ' Z';
      },
      flip: 'rotate90',
    },
    11: {
      calc: function(param) {
        let a1 = 30;
        let a2 = 30;
        let x = 50 - 50 * Math.cos(Math.PI / 4);
        let y = 50 - 50 * Math.sin(Math.PI / 4);
        if (param > 0) {
          a1 += param * 25 / 100;
          a2 += param * 25 / 100;
        }
        if (param < 0) {
          a2 -= param * 50 / 100;
        }
        this.path1 =
          'M ' +
          x +
          ' ' +
          y +
          ' Q ' +
          a1 +
          ' 50 ' +
          x +
          ' ' +
          (100 - y) +
          ' H 0 V ' +
          y +
          ' Z\n                          M ' +
          (100 - x) +
          ' ' +
          y +
          ' Q ' +
          (100 - a1) +
          ' 50 ' +
          (100 - x) +
          ' ' +
          (100 - y) +
          ' H 100 V ' +
          y +
          ' Z';
        this.path2 =
          'M ' +
          x +
          ' ' +
          y +
          ' Q 50 ' +
          a2 +
          ' ' +
          (100 - x) +
          ' ' +
          y +
          ' V 0 H ' +
          x +
          ' Z\n                          M ' +
          x +
          ' ' +
          (100 - y) +
          ' Q 50 ' +
          (100 - a2) +
          ' ' +
          (100 - x) +
          ' ' +
          (100 - y) +
          ' V 100 H ' +
          x +
          ' Z';
      },
      flip: 'rotate90',
    },
    12: {
      calc: function(param) {
        let a1 = 30;
        let a2 = 35;
        if (param > 0) a1 += param * 30 / 100;
        if (param < 0) a2 += param * 15 / 100;
        this.path1 = 'M 0 ' + a1 + ' H 100 V 100 H 0 Z';
        this.path2 =
          'M 0 ' +
          a1 +
          ' H ' +
          a2 +
          ' V 100 H 0 Z\n                          M 100 ' +
          a1 +
          ' H ' +
          (100 - a2) +
          ' V 100 H 100 Z';
      },
      flip: 'rotate180',
    },
    13: {
      calc: function(param) {
        let r = 30;
        let d = 0;
        if (param > 0) r += param * 50 / 100;
        if (param < 0) d -= param * 20 / 100;
        this.path1 = 'M 0 0 H 50 V 100 H 0 Z';
        this.path2 =
          'M ' +
          (50 - r) +
          ' ' +
          (50 - d - r) +
          ' A ' +
          r +
          ' ' +
          r +
          ' 0 0 0 ' +
          (50 + r) +
          ' ' +
          (50 - r - d) +
          ' V 0 H ' +
          (50 - r) +
          ' Z';
      },
      flip: 'rotate180',
    },
    14: {
      calc: function(param) {
        let a = Math.PI / 4;
        let d = 0;
        a += param * Math.PI / 4 / 100;
        this.path1 =
          'M 50 0 Q 50 ' +
          (50 + d) +
          ' ' +
          (50 + 50 * Math.cos(a)) +
          ' ' +
          (50 + 50 * Math.sin(a)) +
          ' H 100 V 0 H 50 Z';
        this.path2 =
          'M 50 0 Q 50 ' +
          (50 + d) +
          ' ' +
          (50 - 50 * Math.cos(a)) +
          ' ' +
          (50 + 50 * Math.sin(a)) +
          ' H 0 V 0 H 50 Z';
      },
      flip: 'rotate180',
    },
    15: {
      calc: function(param) {
        let w = 13 + param * 6 / 100;
        let r1 = 80;
        let r2 = 45;
        let d = 10;
        this.path1 =
          'M ' +
          (50 - r1 - w) +
          ' ' +
          (100 + d) +
          ' A ' +
          (r1 + w) +
          ' ' +
          (r1 + w) +
          ' 0 0 1 ' +
          (50 + r1 + w) +
          ' ' +
          (100 + d) +
          '\n                                   H ' +
          (50 + r1 - w) +
          ' A ' +
          (r1 - w) +
          ' ' +
          (r1 - w) +
          ' 0 1 0 ' +
          (50 - r1 + w) +
          ' ' +
          (100 + d);
        this.path2 =
          'M ' +
          (50 - r2 - w) +
          ' ' +
          (100 + d) +
          ' A ' +
          (r2 + w) +
          ' ' +
          (r2 + w) +
          ' 0 0 1 ' +
          (50 + r2 + w) +
          ' ' +
          (100 + d) +
          '\n                                   H ' +
          (50 + r2 - w) +
          ' A ' +
          (r2 - w) +
          ' ' +
          (r2 - w) +
          ' 0 1 0 ' +
          (50 - r2 + w) +
          ' ' +
          (100 + d);
      },
      flip: 'rotate180',
    },
    16: {
      calc: function(param) {
        let a = 30 * Math.PI / 180;
        let d = 25;
        if (param > 0) {
          a += 30 * Math.PI / 180 * param / 100;
        }
        if (param < 0) {
          d += param * 25 / 100;
        }
        this.path1 = '';
        for (let i = 0; i < 3; i++) {
          let angle1 = i * Math.PI * 2 / 3 + a / 2 - Math.PI / 2;
          let angle2 = i * Math.PI * 2 / 3 - a / 2 - Math.PI / 2;
          this.path1 +=
            'M ' +
            (50 + 100 * Math.cos(angle1)) +
            ' ' +
            (50 + 100 * Math.sin(angle1)) +
            '\n                               L ' +
            (50 + 100 * Math.cos(angle2)) +
            ' ' +
            (50 + 100 * Math.sin(angle2)) +
            '\n                               L ' +
            (50 + d * Math.cos(angle2)) +
            ' ' +
            (50 + d * Math.sin(angle2)) +
            '\n                               A ' +
            d +
            ' ' +
            d +
            ' 0 0 1 ' +
            (50 + d * Math.cos(angle1)) +
            ' ' +
            (50 + d * Math.sin(angle1)) +
            ' Z';
        }
        this.path2 = '';
        for (let i = 0; i < 3; i++) {
          let angle1 = i * Math.PI * 2 / 3 + a / 2 + Math.PI / 2;
          let angle2 = i * Math.PI * 2 / 3 - a / 2 + Math.PI / 2;
          this.path2 +=
            'M ' +
            (50 + 100 * Math.cos(angle1)) +
            ' ' +
            (50 + 100 * Math.sin(angle1)) +
            '\n                               L ' +
            (50 + 100 * Math.cos(angle2)) +
            ' ' +
            (50 + 100 * Math.sin(angle2)) +
            '\n                               L ' +
            (50 + d * Math.cos(angle2)) +
            ' ' +
            (50 + d * Math.sin(angle2)) +
            '\n                               A ' +
            d +
            ' ' +
            d +
            ' 0 0 1 ' +
            (50 + d * Math.cos(angle1)) +
            ' ' +
            (50 + d * Math.sin(angle1)) +
            ' Z';
        }
      },
    },
    17: {
      calc: function(param) {
        let w = 35;
        let h = 45;
        if (param > 0) {
          w += param * 20 / 100;
        }
        if (param < 0) {
          h -= param * 30 / 100;
        }
        this.path1 = 'M 50 45 L ' + (50 - w) + ' ' + (h + 45) + ' H ' + (50 + w) + ' Z';
        this.path2 = 'M 50 0 L ' + (50 - w) + ' ' + h + ' H ' + (50 + w) + ' Z';
      },
    },
    18: {
      calc: function(param) {
        let a = 90 * Math.PI / 180;
        let d = 10;
        if (param > 0) {
          a -= 60 / 180 * Math.PI * param / 100;
        }
        if (param < 0) {
          d -= param * 15 / 100;
        }
        this.path1 = '';
        this.path2 = '';
        for (let i = 0; i < 3; i++) {
          let angle1 = Math.PI * 2 / 3 * i + a / 2 - Math.PI / 2;
          let angle2 = Math.PI * 2 / 3 * i - a / 2 - Math.PI / 2;
          let path =
            'M ' +
            (50 + 100 * Math.cos(angle1)) +
            ' ' +
            (50 + 100 * Math.sin(angle1)) +
            '\n                            L ' +
            (50 + 100 * Math.cos(angle2)) +
            ' ' +
            (50 + 100 * Math.sin(angle2)) +
            '\n                            L ' +
            (50 + d * Math.cos((angle1 + angle2) / 2)) +
            ' ' +
            (50 + d * Math.sin((angle1 + angle2) / 2)) +
            ' Z';
          if (!i) {
            this.path1 += path;
          } else {
            this.path2 += path;
          }
        }
      },
      flip: 'rotate180',
    },
    19: {
      calc: function(param) {
        let w2 = 20;
        let w1 = 60;
        w1 += param * 20 / 100;
        w2 += param * 20 / 100;
        this.path1 = 'M 50 -10 L ' + (50 - w1) + ' 100 H ' + (50 + w1) + ' Z';
        this.path2 = '';
        if (w2 > 0) {
          this.path2 = 'M 50 0 L ' + (50 - w2) + ' 100 H ' + (50 + w2) + ' Z';
        }
      },
      flip: 'rotate180',
    },
    20: {
      calc: function(param) {
        let w = 10;
        let h = 20;
        if (param > 0) w += param * 20 / 100;
        if (param < 0) h += param * 40 / 100;
        this.path1 = 'M 0 ' + (50 - h) + ' H ' + (50 - w) + ' V 100 H 0 Z';
        this.path2 = 'M ' + (50 + w) + ' 0 V ' + (50 + h) + ' H 100 V 0 Z';
      },
      flip: 'rotate90',
    },
    21: {
      calc: function(param) {
        let w = 40;
        let h = 50;
        if (param > 0) w -= param * 20 / 100;
        if (param < 0) h += param * 20 / 100;
        this.path1 =
          'M 50 ' +
          h +
          ' Q ' +
          (50 + w) +
          ' 0 50 0 T 50 ' +
          h +
          ' Z\n                          M 50 ' +
          (100 - h) +
          ' Q ' +
          (50 + w) +
          ' 100 50 100 T 50 ' +
          (100 - h) +
          ' Z';
        this.path2 =
          'M ' +
          h +
          ' 50 Q 0 ' +
          (50 + w) +
          ' 0 50 T ' +
          h +
          ' 50 Z\n                          M ' +
          (100 - h) +
          ' 50 Q 100 ' +
          (50 + w) +
          ' 100 50 T ' +
          (100 - h) +
          ' 50 Z';
      },
      flip: 'rotate45',
    },
    22: {
      calc: function(param) {
        let w = 20;
        w += param * 10 / 100;
        this.path1 =
          'M ' +
          (50 - w) +
          ' ' +
          (50 - w) +
          ' H ' +
          (50 + w) +
          ' V ' +
          (50 + w) +
          ' H ' +
          (50 - w) +
          ' Z';
        this.path2 = '';
        for (let i = -4; i < 4; i++) {
          for (let j = -4; j < 4; j++) {
            let a = (i + j) % 2;
            this.path2 +=
              'M ' +
              (50 - w - w * 2 * i) +
              ' ' +
              (50 - w - w * 2 * (j + a)) +
              ' h ' +
              -w * 2 +
              ' v ' +
              w * 2 +
              ' h ' +
              w * 2 +
              ' Z';
          }
        }
      },
      flip: 'rotate45',
    },
    23: {
      calc: function(param) {
        let w = 17;
        let h = 25;
        if (param > 0) w += param * 35 / 100;
        if (param < 0) h -= param * 23 / 100;
        this.path1 = '';
        for (let i = -4; i <= 4; i++) {
          this.path1 +=
            'M ' +
            (50 - w * i * 2) +
            ' ' +
            (50 - h) +
            ' l ' +
            -w +
            ' ' +
            -h +
            ' l ' +
            -w +
            ' ' +
            h +
            ' l ' +
            w +
            ' ' +
            h +
            ' Z';
        }
        this.path2 = '';
        for (let i = -4; i <= 4; i++) {
          this.path2 +=
            'M ' +
            (50 - w * i * 2) +
            ' ' +
            (50 + h) +
            ' l ' +
            -w +
            ' ' +
            -h +
            ' l ' +
            -w +
            ' ' +
            h +
            ' l ' +
            w +
            ' ' +
            h +
            ' Z';
        }
      },
      flip: 'rotate90',
    },
    24: {
      calc: function(param) {
        let w = 50;
        let h = 45;
        if (param > 0) w += param * 60 / 100;
        if (param < 0) h += param * 30 / 100;
        this.path1 = 'M 0 ' + h + ' L 50 70 L 100 ' + h + ' V 100 H 0 Z';
        this.path2 =
          'M 50 0 L ' +
          (50 + w) +
          ' 100 H 100 V ' +
          h +
          ' L 50 70 L 0 ' +
          h +
          ' V 100 H ' +
          (50 - w) +
          ' Z';
      },
      flip: 'rotate180',
    },
  };
}

function getColors() {
  let colors = [];
  let index = 0;
  colors.push({
    index: index++,
    rgb: '#' + hsl2rgb(0, 0, 0.8),
  });
  for (let i = 0; i < 19; i++) {
    colors.push({
      index: index++,
      rgb: '#' + hsl2rgb(i * 360 / 19, 0.6, 0.8),
    });
  }
  colors.push({
    index: index++,
    rgb: '#' + hsl2rgb(0, 0, 0.5),
  });
  for (let i = 0; i < 19; i++) {
    colors.push({
      index: index++,
      rgb: '#' + hsl2rgb(i * 360 / 19, 0.7, 0.5),
    });
  }
  colors.push({
    index: index++,
    rgb: '#' + hsl2rgb(0, 0, 0.3),
  });
  for (let i = 0; i < 19; i++) {
    colors.push({
      index: index++,
      rgb: '#' + hsl2rgb(i * 360 / 19, 0.4, 0.3),
    });
  }
  colors.push({
    index: index++,
    rgb: '#' + hsl2rgb(0, 0, 0.1),
  });
  for (let i = 0; i < 19; i++) {
    colors.push({
      index: index++,
      rgb: '#' + hsl2rgb(i * 360 / 19, 0.5, 0.1),
    });
  }
  return colors;
}

function hsl2rgb(H, S, L) {
  let C = (1 - Math.abs(2 * L - 1)) * S;
  let H_ = H / 60;
  let X = C * (1 - Math.abs(H_ % 2 - 1));
  let R1, G1, B1;
  if (H === undefined || isNaN(H) || H === null) {
    R1 = G1 = B1 = 0;
  } else {
    if (H_ >= 0 && H_ < 1) {
      R1 = C;
      G1 = X;
      B1 = 0;
    } else if (H_ >= 1 && H_ < 2) {
      R1 = X;
      G1 = C;
      B1 = 0;
    } else if (H_ >= 2 && H_ < 3) {
      R1 = 0;
      G1 = C;
      B1 = X;
    } else if (H_ >= 3 && H_ < 4) {
      R1 = 0;
      G1 = X;
      B1 = C;
    } else if (H_ >= 4 && H_ < 5) {
      R1 = X;
      G1 = 0;
      B1 = C;
    } else if (H_ >= 5 && H_ < 6) {
      R1 = C;
      G1 = 0;
      B1 = X;
    }
  }
  let m = L - C / 2;
  let R, G, B;
  R = (R1 + m) * 255;
  G = (G1 + m) * 255;
  B = (B1 + m) * 255;
  R = Math.round(R);
  G = Math.round(G);
  B = Math.round(B);

  function pad(v) {
    let hex = Number(v).toString(16);
    if (hex.length < 2) {
      hex = '0' + hex;
    }
    return hex;
  }

  return pad(R) + pad(G) + pad(B);
}
