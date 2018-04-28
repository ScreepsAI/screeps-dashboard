import _ from 'lodash';
import moment from 'moment';

export function formatNumber(num, cent = 2) {
  num = cent > 0 ? num.toFixed(cent) : num + '.';
  num = num.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  return cent > 0 ? num : num.replace(/\./g, '');
}

export function shortNumber(number, cent = 1) {
  if (!number) return 0;
  const ld = Math.log10(number) / 3;
  if (ld < 1) return number % 1 !== 0 ? number.toFixed(cent) : number;
  if (ld < 2) return (number / 1000).toFixed(cent) + 'k';
  if (ld < 3) return (number / 1000000).toFixed(cent) + 'M';
  if (ld < 4) return (number / 1000000000).toFixed(cent) + 'B';
  return number.toString();
}

export function updateDate(deltas, progress, progressTotal) {
  const NextTime =
    Math.floor((progressTotal - progress) / (_.sum(deltas) / deltas.length / 60) * 1000) +
    Date.now();
  return moment(NextTime).fromNow();
}
