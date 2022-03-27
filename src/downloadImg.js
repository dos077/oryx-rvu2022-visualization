const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');

const postimgBase = 'https://i.postimg.cc/';
const twitterBase = 'https://twitter.com/';

const oryxIndex = JSON.parse(fs.readFileSync('./src/oryxdata/index.json'));
const twitterPath = './src/oryxdata/twitterTime.json';
const postImgPath = './src/oryxdata/postImgFiles.json';

const saveTwitterDb = (db) => {
  fs.writeFileSync(twitterPath, JSON.stringify(db));
};

const loadTwitterDb = () => (fs.existsSync(twitterPath)
  ? JSON.parse(fs.readFileSync(twitterPath))
  : []);

const findTwitterTime = async () => {
  const db = loadTwitterDb();
  const urls = [];
  ['Russia', 'Ukraine'].forEach((side) => {
    Object.keys(oryxIndex[side]).forEach((category) => {
      oryxIndex[side][category].forEach(({ imgs }) => {
        imgs.forEach((url) => {
          if (url.includes(twitterBase) && !urls.includes(url)) urls.push(url);
        });
      });
    });
  });

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto('https://twitter.com');
  await new Promise((r) => setTimeout(r, 60000));

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    if (db.some((entry) => entry.url === url)) continue;
    await page.goto(url);
    await new Promise((r) => setTimeout(r, 2500));
    const spans = await page.$$('div[dir="auto"] a[role="link"] span');
    let date = null;
    console.log('checking twitter page: ', url);
    for (let j = 0; j < spans.length; j++) {
      const spanTxt = await spans[j].evaluate((el) => el.textContent);
      console.log(spanTxt);
      if (spanTxt.match(/\s\d{4}$/)) {
        date = spanTxt.split(' · ')[1];
        break;
      }
    }
    if (date) db.push({ url, date });
  }

  await browser.close();

  saveTwitterDb(db);
};

const imgDownloader = async ({
  page, side, category, url,
}, waitMs = 5000) => {
  console.log('going url: ', url);
  await page.goto(url);
  console.log('url loaded');
  await new Promise((r) => setTimeout(r, 2000));
  const img = await page.$('#main-image');
  const srcArr = (await img.evaluate((el) => el.src)).split('/');
  const fileName = srcArr[srcArr.length - 1];
  const filePath = `./src/oryxdata/${side}/${category}`;
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: path.resolve(filePath),
  });
  const saveButton = await page.$('#download');
  saveButton.click();
  await new Promise((r) => setTimeout(r, waitMs));
  return { fileName, filePath };
};

const savePostimgDb = (db) => {
  fs.writeFileSync(postImgPath, JSON.stringify(db));
};

const loadPostimgDb = () => (fs.existsSync(postImgPath)
  ? JSON.parse(fs.readFileSync(postImgPath))
  : []);

const downloadPostimg = async () => {
  const db = loadPostimgDb();
  const urls = [];
  ['Russia', 'Ukraine'].forEach((side) => {
    Object.keys(oryxIndex[side]).forEach((category) => {
      oryxIndex[side][category].forEach(({ imgs }) => {
        imgs.forEach((url) => {
          if (url.includes(postimgBase) && !urls.some((entry) => entry.url === url)) urls.push({ side, category, url });
        });
      });
    });
  });

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium-browser',
    headless: false,
  });
  const page = await browser.newPage();

  for (let i = 0; i < urls.length; i++) {
    const { side, category, url } = urls[i];
    if (!db.some((entry) => entry.url === url)) {
      const { fileName, filePath } = await imgDownloader({
        page, side, category, url,
      });
      db.push({ url, fileName, filePath });
      savePostimgDb(db);
    } else {
      const { filePath, fileName } = db.find((e) => e.url === url);
      const imagePath = `${filePath}/${fileName}`;
      if (!fs.existsSync(imagePath)) {
        console.log('missing file', imagePath);
        await imgDownloader({
          page, side, category, url,
        }, 10000);
      }
    }
  }

  await browser.close();
};

const main = async () => {
  // await findTwitterTime();
  await downloadPostimg();
};

main();
