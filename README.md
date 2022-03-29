# oryx_vis


## Scraper setup

### Required Python/Node.js package
```
opencv-python
pytesseract
puppeteer (included in package.json)
chromium-browser
```

### Scrapping
```
npm run getdata
# getting an index of all the equipment loss links
npm run getimgs
# downloading the images and scraping twitter for tweet times
npm run ocr
# ocr for dates on images
npm run validate
# check for issue in data. OCR is under 90% accurate, dates must be fixed manually
```

## NPM Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```


### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
