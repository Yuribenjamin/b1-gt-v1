import fs from 'fs';
import cuid from 'cuid';
import chalk from 'chalk';
import puppeteer from 'puppeteer';
import clipboardy from 'clipboardy';
import { clean, logErrorAndExit, saveScreenshot, sleep } from './helpers';
// test
// test

const userName: string = 'ibrahim.ragab@beyond-solution.com';
const password: string = 'Yuribenjamin!((@';
const url: string =
  'http://cs.beyond-solution.stag.s3-website.us-east-2.amazonaws.com/login';

/**
 * @param url
 * @param userName
 * @param password
 */
(async (url, userName, password) => {
  // ? check if the screenshot directory exists
  !fs.existsSync('./screenshot') ? fs.mkdirSync('./screenshot') : null;

  // ? start and cleaning
  console.log(chalk.bgBlue('Start cleaning Previous session Dir'));

  // ? cleaning previous session
  clean();

  // ? create seassion id
  const sessionId = cuid().substr(-7);
  console.log(chalk.green(`[1] Session created with ID: ----${sessionId}----`));

  // ? start browser
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: false,
  });
  console.log(chalk.green('[2] Browser launched successfully...'));

  // ? create page instance and navigate to url and wait for page to load completely
  const page = await browser.newPage();
  await page.goto(`${url}`, {
    waitUntil: 'domcontentloaded',
  });
  console.log(chalk.green('[3] Page loaded successfully'));

  // ? screenshot after page load
  const screenShotPageloading = await page.screenshot();
  console.log(chalk.green('[4] screenshot captured page loaded... \npath:'));
  saveScreenshot({
    suffix: '0001',
    screenshot: screenShotPageloading,
    sessionId,
  });

  // ? login to the application
  await page.click('.login-btn');
  console.log(chalk.green('[5] Login button was pressed'));

  // ? screenshot after login button pressed and wait for page to load completely
  const screenShotLogin = await page.screenshot();
  console.log(
    chalk.green(
      '[6] screenshot captured button pressed navigation done... \npath:',
    ),
  );
  saveScreenshot({ suffix: '0002', screenshot: screenShotLogin, sessionId });

  // ? login to the application fill username
  await sleep(1000);
  await page.type('.zHQkBf', `${userName}`, { delay: 100 });

  // ? screenshot after username filled
  const screenShotFillUserName = await page.screenshot();
  console.log(
    chalk.green('[7] screenshot captured username filled... \npath:'),
  );
  saveScreenshot({
    suffix: '0003',
    screenshot: screenShotFillUserName,
    sessionId,
  });

  // ? submit username and wait for page to load completely
  await page.click('.VfPpkd-Jh9lGc');
  await sleep(3000);

  // ? fill password
  await page.type('.zHQkBf', `${password}`, { delay: 100 });

  // ? screenshot after password filled
  const screenShotFillPassword = await page.screenshot();
  console.log(
    chalk.green('[8] screenshot captured password filled... \npath:'),
  );
  saveScreenshot({
    suffix: '0005',
    screenshot: screenShotFillPassword,
    sessionId,
  });

  // ? submit password
  await page.click('.VfPpkd-Jh9lGc');

  // ? wait for page to load completely
  await sleep(10000);

  // ? screenshot after successful login
  const screenShotLoginSuccess = await page.screenshot();
  console.log(chalk.green('[9] screenshot captured login success... \npath:'));
  saveScreenshot({
    suffix: '0006',
    screenshot: screenShotLoginSuccess,
    sessionId,
  });

  // ? get token from local storage
  const getToken: string | null = await page.evaluate(() =>
    localStorage.getItem('token'),
  );

  clipboardy.writeSync(getToken as string);

  console.log(
    chalk.green(
      `[10] Successfully get token from local storage... \n${getToken}\nYour token copied to clipboard 🚀🚀🚀\nHappy Hacking! bye bye 👋👋👋`,
    ),
  );
  await browser.close();
})(url, userName, password).catch(logErrorAndExit);
