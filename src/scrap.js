/* eslint-disable no-loop-func */
/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
const puppeteer = require('puppeteer');
const fs = require('fs');

const rusUrl = 'https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-equipment.html';

const ukrUrl = 'https://www.oryxspioenkop.com/2022/02/attack-on-europe-documenting-ukrainian.html';

const sides = ['Russia', 'Ukraine'];
const categories = [
  'Tanks',
  'Armoured Fighting Vehicles',
  'Infantry Fighting Vehicles',
  'Armoured Personnel Carriers',
  'Mine-Resistant Ambush Protected (MRAP) Vehicles',
  'Infantry Mobility Vehicles',
  'Communications Stations',
  'Engineering Vehicles',
  'Anti-Tank Guided Missiles',
  'Man-Portable Air Defence Systems',
  'Heavy Mortars',
  'Towed Artillery',
  'Self-Propelled Artillery',
  'Multiple Rocket Launchers',
  'Anti-Aircraft Guns',
  'Self-Propelled Anti-Aircraft Guns',
  'Surface-To-Air Missile Systems',
  'Radars',
  'Jammers And Deception Systems',
  'Aircraft',
  'Unmanned Aerial Vehicles',
  'Helicopters',
  'Naval Ships',
  'Logistics Trains',
  'Trucks, Vehicles and Jeeps',
];

const indexPath = './src/oryxdata/index.json';

const saveData = (db) => {
  const updated = new Date();
  fs.writeFileSync(indexPath, JSON.stringify({ ...db, updated }));
};

/* const loadData = () => (fs.existsSync(indexPath)
  ? JSON.parse(fs.readFileSync(indexPath))
  : {}); */

const scrap = async (page) => {
  const h3s = await page.$$('div.post-body h3');
  const db = {};
  let ulIndex = 0;
  for (let i = 1; i < h3s.length; i += 1) {
    const txt = await h3s[i].evaluate((el) => el.textContent);
    const category = categories
      .find((catStr) => txt.toLowerCase().includes(catStr.toLocaleLowerCase()));
    if (!category) continue;
    if (!db[category]) db[category] = [];
    const lis = await (await page.$$('div.post-body ul'))[ulIndex].$$('li');
    for (let j = 0; j < lis.length; j += 1) {
      const li = lis[j];
      const liStr = await li.evaluate((el) => el.textContent);
      const mrr = liStr.split(':')[0].split(' ');
      const n = mrr[1];
      let model = mrr[2];
      if (model.toLowerCase().includes('unknown')) {
        model = `${category}(unknown)`;
      } else if (model.match(/\d+mm$/)) model += `_${mrr[3]}`;
      const entry = { n, model };
      const arr = await li.$$('a');
      let count = 1;
      for (let k = 0; k < arr.length; k += 1) {
        const link = await arr[k].evaluate(({ textContent, href }) => ({ textContent: textContent.replace('Bayraktar TB2', ''), href }));
        let status = ['destroyed', 'damaged', 'captured', 'abandoned'].find((s) => link.textContent.includes(s));
        if (!status) status = 'destroyed';
        if (!entry[status]) entry[status] = [];
        while (link.textContent.includes(`${count},`) || link.textContent.includes(`${count} `)) {
          count += 1;
          entry[status].push(link.href);
        }
      }
      db[category].push(entry);
    }
    ulIndex += 1;
  }
  return db;
};

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
  );
  const db = {};
  await page.goto(rusUrl);
  db[sides[0]] = await scrap(page);
  await page.goto(ukrUrl);
  db[sides[1]] = await scrap(page);

  saveData(db);

  await browser.close();
};

main();
