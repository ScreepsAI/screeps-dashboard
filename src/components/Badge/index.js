import renderBadge from '../../utils/renderBadge';
import { connect } from 'dva';
import { Spin } from 'antd';

const State = ({ badge, loading }) => {
  return {
    badge,
    loading: loading.models.badge || !badge.url,
  };
};

export default connect(State)(({ size = 100, badge, loading, className }) => {
  let render = <Spin />;
  if (!loading) render = renderBadge(badge, size * 2).toDataURL('image/png');
  const style = {
    borderRadius: '50%',
    width: `${size}px`,
    height: `${size}px`,
    boxSizing: 'content-box',
  };
  const imgStyle = {
    zoom: '0.5',
  };
  return (
    <div className={className} style={style}>
      <img style={imgStyle} src={render} />
    </div>
  );
});
