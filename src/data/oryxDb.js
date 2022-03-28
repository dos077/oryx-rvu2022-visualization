const indexJson = require('../oryxdata/index.json');
const twitterTimeJson = require('../oryxdata/twitterTime.json');
const ocrDatesJson = require('../oryxdata/ocrDates.json');
const noDatesJson = require('../oryxdata/noDates.json');

const statuses = ['destroyed', 'damaged', 'captured', 'abandoned'];

const loadIndex = (json) => {
  const sides = ['Russia', 'Ukraine'];
  const arr = [];
  sides.forEach((side) => {
    Object.keys(json[side]).forEach((category) => {
      json[side][category].forEach((entry) => {
        const { model } = entry;
        statuses.forEach((status) => {
          if (entry[status]) {
            entry[status].forEach((url) => {
              arr.push({
                side, category, model, url, status,
              });
            });
          }
        });
      });
    });
  });
  return arr;
};

const loadTime = (dateDb, lossDb) => {
  const arr = [];
  lossDb.forEach((entry) => {
    const dateEntry = dateDb.find((e) => entry.url === e.url);
    if (!dateEntry) return;
    const drr = dateEntry.date.includes('.')
      ? dateEntry.date.split('.')
      : dateEntry.date.split('/');
    drr[2] = '2022';
    arr.push({ ...entry, date: drr.map((n) => parseInt(n, 10)).reverse().join('-') });
  });
  return arr.filter((entry) => entry.date);
};

const loadDb = () => {
  const indexArr = loadIndex(indexJson);
  const twitterTimeParsed = twitterTimeJson.map((e) => {
    const jsDate = new Date(e.date);
    const date = `${jsDate.getUTCDate()}.${jsDate.getUTCMonth() + 1}.${jsDate.getFullYear()}`;
    return { ...e, date };
  });
  const dateArr = twitterTimeParsed;
  dateArr.push(...ocrDatesJson);
  dateArr.push(...noDatesJson);
  return loadTime(dateArr, indexArr);
};

const oryxDb = loadDb();

const { updated } = indexJson;

const sides = ['Russia', 'Ukraine'];

const getCategories = (side) => {
  const categories = [];
  const entries = side
    ? oryxDb.filter((e) => e.side === side)
    : oryxDb;
  entries.forEach(({ category }) => {
    if (!categories.includes(category)) categories.push(category);
  });
  return categories;
};

const getModels = (side, category) => {
  const models = [];
  let entries = [...oryxDb];
  if (side) entries = entries.filter((e) => e.side === side);
  if (category) entries = entries.filter((e) => e.category === category);
  entries.forEach(({ model }) => {
    if (!models.includes(model)) models.push(model);
  });
  return models;
};

const mapSideDates = (entries) => {
  const mapped = { Russia: {}, Ukraine: {} };
  entries.forEach(({
    side, date, category, model, url,
  }) => {
    if (!mapped[side][date]) mapped[side][date] = [];
    mapped[side][date].push({ category, model, url });
  });
  return mapped;
};

export default oryxDb;

export {
  sides, getCategories, getModels, mapSideDates, updated,
};
