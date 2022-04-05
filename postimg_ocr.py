import pytesseract
import numpy as np
import matplotlib.pyplot as plt
import cv2
import json
import re
from os.path import exists

index_file = open('./src/oryxdata/postImgFiles.json')

index = json.load(index_file)

ocr_path = './src/oryxdata/ocrDates.json'
nd_path = './src/oryxdata/noDates.json'

def load_ocr_dates():
  if not exists(ocr_path):
    return []
  file = open(ocr_path)
  return json.load(file)

def save_ocr_dates(data):
  file = open(ocr_path, 'w')
  file.write(json.dumps(data))

def load_no_dates():
  if not exists(nd_path):
    return []
  file = open(nd_path)
  return json.load(file)

def save_no_dates(data):
  file = open(nd_path, 'w')
  file.write(json.dumps(data))

ocr_data = load_ocr_dates()
nd_data = load_no_dates()

def match_url(arr, url):
  for entry in arr:
    if entry.get('url') == url:
      return True
  return False

def search_date(image):
  text = pytesseract.image_to_string(image).replace('\n', '')
  match = re.search("\d{1,2}\W\d{1,2}\W2022", text, re.M)
  if not match: match = re.search("\d{1,2}\W\d{1,2}\W22", text, re.M)
  return match

def second_pass(image):
  match = False
  gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
  blurred = cv2.GaussianBlur(gray, (5, 5), 0)
  wide = cv2.Canny(blurred, 10, 200)
  match = search_date(wide)
  if match: return match
  mid = cv2.Canny(blurred, 30, 150)
  match = search_date(mid)
  if match: return match
  tight = cv2.Canny(blurred, 240, 250)
  match = search_date(tight)
  return match

def first_pass(image_path):
  match = False
  for th in [11, 33, 66]:
    image = cv2.imread(image_path)
    height, width, _ = image.shape
    for x in range(height):
      for y in range(width):
        if image[x, y].sum() < th:
          image[x, y] = [255, 255, 255]
        else:
          image[x, y] = [0, 0 ,0]
    match = search_date(image)
    if match: break
    image = cv2.imread(image_path)
    for x in range(height):
      for y in range(width):
        if image[x, y].sum() > 765 - th:
          image[x, y] = [255, 255, 255]
        else:
          image[x, y] = [0, 0 ,0]
    match = search_date(image)
    if match: break
    image = cv2.imread(image_path)
    for x in range(height):
      for y in range(width):
        if image[x, y].sum() < th or image[x, y].sum() > 765 - th:
          image[x, y] = [255, 255, 255]
        else:
          image[x, y] = [0, 0 ,0]
    match = search_date(image)
    if match: break
    # else: match = second_pass(image)
    # if match: break
  return match

for i in range(len(index)):
  image_path = index[i].get('filePath') + '/' + index[i].get('fileName')
  url = index[i].get('url')
  if match_url(ocr_data, url) or match_url(nd_data, url):
    continue
  print('scanning index: ', i)
  match = first_pass(image_path)
  if match:
    date = match.group(0)
    ocr_data.append({ 'url': url, 'date': date })
    save_ocr_dates(ocr_data)
  else:
    print('!ocr failed', image_path)
    nd_data.append({ 'url': url, 'imagePath': image_path, 'date': '' })
    save_no_dates(nd_data)
