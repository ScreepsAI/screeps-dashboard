export function formatNumber(num, cent = 2) {
  return num.toFixed(cent).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
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
