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

const findSliceIndice = (dates, dateRange) => {
  const sliceIndice = [0, dates.length];
  if (!dateRange) return sliceIndice;
  if (dateRange && dateRange.length === 2) {
    const minDate = new Date(dateRange[0]);
    sliceIndice[0] = dates
      .findIndex((date) => new Date(date) >= minDate);
    if (sliceIndice[0] === -1) {
      sliceIndice[0] = dates.length;
    } else {
      const maxDate = new Date(dateRange[1]);
      sliceIndice[1] = dates
        .findIndex((date) => new Date(date) >= maxDate);
      if (sliceIndice[1] === -1) {
        sliceIndice[1] = dates.length;
      } else {
        sliceIndice[1] += 1;
      }
    }
  }
  return sliceIndice;
};

const buildVsEntry = (data, label, isTotal) => {
  const dataset = {
    label,
    data,
    type: 'line',
    cubicInterpolationMode: 'monotone',
    tension: 0.4,
  };
  if (label === 'Russia') {
    dataset.borderColor = '#db0d20';
    dataset.backgroundColor = '#db0d20';
    if (!isTotal) dataset.type = 'bar';
  } else if (label === 'Ukraine') {
    dataset.borderColor = '#005BBB';
    dataset.backgroundColor = '#005BBB';
    if (!isTotal) dataset.type = 'bar';
  } else if (label === 'Rus-SMA') {
    dataset.borderColor = '#f99fa8';
    dataset.borderDash = [5, 5];
  } else {
    dataset.borderColor = '#66b0ff';
    dataset.borderDash = [5, 5];
  }
  return dataset;
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
  const sliceIndice = findSliceIndice(dates, dateRange);
  const datasets = [];
  if (!isTotal) {
    datasets.push(
      buildVsEntry(sma(russia, smaPeriod).slice(...sliceIndice), 'Rus-SMA'),
    );
    datasets.push(
      buildVsEntry(sma(ukraine, smaPeriod).slice(...sliceIndice), 'Ukr-SMA'),
    );
  }
  datasets.push(
    buildVsEntry(russia.slice(...sliceIndice), 'Russia', isTotal),
  );
  datasets.push(
    buildVsEntry(ukraine.slice(...sliceIndice), 'Ukraine', isTotal),
  );
  return {
    labels: labels.slice(...sliceIndice).map((d) => d.split('-').slice(1).join('-')),
    datasets,
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

const findDates = (entries) => {
  const dates = [];
  entries.forEach(({ date }) => {
    if (!dates.includes(date)) dates.push(date);
  });
  dates.sort((a, b) => new Date(a) - new Date(b));
  return dates;
};

const buildDateDataset = (entries, dates, label, color, isTotal = true) => {
  const data = [];
  dates.forEach((date, i) => {
    let total = 0;
    if (i > 0 && isTotal) total += data[i - 1];
    const dateEntries = entries.filter((e) => e.date === date);
    if (dateEntries) total += dateEntries.length;
    data.push(total);
  });
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color,
    fill: true,
    cubicInterpolationMode: 'monotone',
    tension: 0.4,
    type: isTotal ? undefined : 'bar',
  };
};

const colors = [
  '#FFD500',
  '#0d40d9',
  '#0dd940',
  '#730dd9',
  '#0dd9d9',
  '#db0d20',
];

const rangeDates = (dates, dateRange) => {
  const [minDate, maxDate] = dateRange.map((d) => new Date(d));
  if (!minDate || !maxDate) return dates;
  maxDate.setDate(maxDate.getDate() + 1);
  return dates.filter((d) => new Date(d) >= minDate && new Date(d) <= maxDate);
};

const buildBreakdownData = (entries, key, n, dateRange, isPercent, isTotal) => {
  const dates = rangeDates(findDates(entries), dateRange);
  const breakdown = breakDownEntries(entries, key);
  const datasets = [];
  const keyVals = Object.keys(breakdown).filter((val) => !val.includes('(unknown)'));
  keyVals.sort((a, b) => breakdown[b].length - breakdown[a].length);
  if (keyVals.length > n) {
    const keyEntries = [];
    while (keyVals.length > n) {
      keyVals.pop();
    }
    keyEntries.push(...entries.filter((e) => !keyVals.includes(e[key])));
    const dataset = buildDateDataset(keyEntries, dates, 'others', colors[n], isTotal);
    datasets.push(dataset);
  }
  keyVals.forEach((keyVal, i) => {
    const dataset = buildDateDataset(breakdown[keyVal], dates, keyVal, colors[i], isTotal);
    datasets.push(dataset);
  });
  if (isPercent) {
    const dateTotals = [];
    datasets.forEach(({ data }) => {
      data.forEach((count, i) => {
        if (!dateTotals[i]) {
          dateTotals[i] = count;
        } else {
          dateTotals[i] += count;
        }
      });
    });
    for (let i = 0; i < datasets.length; i += 1) {
      const set = datasets[i];
      set.data = set.data
        .map((count, j) => Math.round((count / dateTotals[j]) * 100));
    }
  }
  return {
    labels: dates.map((d) => d.split('-').slice(1).join('-')),
    datasets,
  };
};

export { buildVsData, breakDownEntries, buildBreakdownData };
