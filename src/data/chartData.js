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

const buildVsData = (entries, isTotal, smaPeriod, dateRange) => {
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
    labels.push(date);
  });
  const sliceIndice = [0, dates.length];
  if (dateRange && dateRange.length === 2) {
    const minDate = new Date(dateRange[0]);
    sliceIndice[0] = dates
      .findIndex((date) => new Date(date) >= minDate);
    if (sliceIndice[0] === -1) {
      sliceIndice[0] = dates.length;
    } else {
      const maxDate = new Date(dateRange[1]);
      maxDate.setDate(maxDate.getDate() + 1);
      sliceIndice[1] = dates
        .findIndex((date) => new Date(date) >= maxDate);
      if (sliceIndice[1] === -1) {
        sliceIndice[1] = dates.length;
      } else {
        sliceIndice[1] += 1;
      }
    }
  }
  return {
    labels: labels.slice(...sliceIndice),
    russia: russia.slice(...sliceIndice),
    ukraine: ukraine.slice(...sliceIndice),
    rusSma: sma(russia, smaPeriod).slice(...sliceIndice),
    ukrSma: sma(ukraine, smaPeriod).slice(...sliceIndice),
  };
};

const breakDownEntries = (entries, key) => {
  const breakdown = {};
  entries.forEach((e) => {
    const val = e[key];
    if (!breakdown[val]) breakdown[val] = [];
    breakdown[val].push(e);
  });
  return breakdown;
};

export { buildVsData, breakDownEntries };
