import createF2 from 'f2react';
import _ from 'lodash';
import style from './index.scss';
import classnames from 'classnames/bind';

export const LineChart = (
  { data = [{ x: 0, y: 0 }], width, color = ['#fff', 'rgba(0,0,0,.5)'] },
  small = false
) => {
  if (_.isUndefined(data)) return null;
  const Line = createF2(chart => {
    chart.source(data, {
      y: {
        min: 0,
        max: 60,
      },
    });

    chart
      .line()
      .position('x*y')
      .color(color[0]);
    chart
      .area()
      .position('x*y')
      .color(color[1]);
    chart.tooltip(false);
    chart.axis(false);
    chart.render();
  });
  const classname = classnames.bind(style)('box', { small });
  return (
    <div style={{ borderColor: color[1], width }} className={classname}>
      <Line width={100} height={100} padding={[6, -6, 0, 0]} data={data} />
    </div>
  );
};
