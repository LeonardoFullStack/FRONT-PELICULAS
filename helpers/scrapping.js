const puppeteer = require("puppeteer");
async function recogerCajas(url,browser){
  const page = await browser.newPage();
  await page.goto(url);
  const opinion={}
  opinion.titulo=await page.$eval('.review-container a.title', (title) => title.innerText)
  opinion.opiniones=await page.$eval('.content .text', (title) => title.innerText)
  return opinion
}
async function searchGoogle(titulo) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.imdb.com");
  await page.type("#suggestion-search",`${titulo}`);
  const searchResultSelector = '#react-autowhatever-1--item-0';
  await page.waitForSelector(searchResultSelector);
  await page.click(searchResultSelector);
  await page.waitForNavigation();
  await page.click(".label");
  await page.waitForNavigation();
const urls = await page.$$eval('.lister-item-content a.title', (link) =>link.map((link) => link.href));
 const arrayOpiniones=[];
for (let i = 0; i < 4; i++) {
  const data=await recogerCajas(urls[i],browser)
  arrayOpiniones.push(data)
}
 return arrayOpiniones;
}
module.exports={
  searchGoogle
}