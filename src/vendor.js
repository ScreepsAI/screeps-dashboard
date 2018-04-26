import { concat } from 'lodash';

const react = ['react', 'react-dom'];

const dva = ['dva', 'dva/router', 'dva/fetch', 'dva/dynamic', 'dva-loading'];

const style = ['classnames'];

const utils = ['path', 'moment', 'moment/locale/zh-cn'];

export default concat(react, dva, style, utils);
