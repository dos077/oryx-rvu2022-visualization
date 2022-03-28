const fs = require('fs');

const indexJson = JSON.parse(fs.readFileSync('./src/oryxdata/index.json'));

const statuses = ['destroyed', 'damaged', 'captured', 'abandoned'];

const checkCounts = (index) => {
  ['Russia', 'Ukraine'].forEach((side) => {
    Object.keys(index[side]).forEach((category) => {
      index[side][category].forEach((entry) => {
        const imgs = [];
        statuses.forEach((s) => {
          if (entry[s]) imgs.push(...entry[s]);
        });
        if (parseInt(entry.n, 10) !== imgs.length) {
          console.log('count and imgs not match', side, category, entry.model);
          console.log(entry.n, imgs.length);
        }
      });
    });
  });
};

checkCounts(indexJson);

const ocrDates = JSON.parse(fs.readFileSync('./src/oryxdata/ocrDates.json'));
const ndDates = JSON.parse(fs.readFileSync('./src/oryxdata/noDates.json'));
const startDate = new Date('2/23/2022');
const today = new Date();

const checkDate = ({ url, date }) => {
  let parsedDate = null;
  if (date.toString().includes('.')) {
    const drr = date.split('.').reverse();
    if (drr[0] === '22') drr[0] = '2022';
    parsedDate = new Date(drr.join('-'));
  } else if (date.toString().includes('/')) {
    const drr = date.split('/').reverse();
    if (drr[0] === '22') drr[0] = '2022';
    parsedDate = new Date(drr.join('-'));
  }
  if (!parsedDate || !parsedDate.getDate() || parsedDate < startDate || parsedDate > today) {
    console.log('invalid date: ', url, date);
  }
};

console.log('checking ocr dates');

ocrDates.forEach(checkDate);

console.log('checking manual entries');

ndDates.forEach(checkDate);
