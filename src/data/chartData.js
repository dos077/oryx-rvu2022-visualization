/* eslint-disable import/prefer-default-export */

const sma = (data, t) => {
  if (data.length < t || t < 2) return [];
  const avgs = [];
  for (let i = 0; i < t - 1; i += 1) {
    avgs.push(NaN);
  }
  for (let i = 0; i <= data.length - t; i += 1) {
    const avg = data.slice(i, i + t).reduce((a, b) => a + b) / t;
    avgs.push(avg);
  }
  return avgs;
};

const buildVsData = (entries, isTotal, smaPeriod) => {
  const dates = [];
  ['Russia', 'Ukraine'].forEach((side) => {
    Object.keys(entries[side]).forEach((date) => {
      if (!dates.includes(date)) dates.push(date);
    });
  });
  dates.sort((a, b) => (new Date(a)) - (new Date(b)));
  const russia = [];
  const ukraine = [];
  const labels = [];
  dates.forEach((date, i) => {
    let rusVal = 0;
    let ukrVal = 0;
    if (isTotal && i > 0) {
      rusVal += russia[i - 1];
      ukrVal += ukraine[i - 1];
    }
    if (entries.Russia[date]) {
      rusVal += entries.Russia[date].length;
    }
    if (entries.Ukraine[date]) {
      ukrVal += entries.Ukraine[date].length;
    }
    russia.push(rusVal);
    ukraine.push(ukrVal);
    labels.push(date.split('-').slice(1).join('-'));
  });
  return {
    labels,
    russia,
    ukraine,
    rusSma: sma(russia, smaPeriod),
    ukrSma: sma(ukraine, smaPeriod),
  };
};

export { buildVsData };
