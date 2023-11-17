import { chromium, expect } from '@playwright/test';
import RegistrationPage from './tests/pages/RegistrationPage';
import RegisterData from './tests/data-factory/RegisterData';
import HomePO from './tests/pages/HomePage';

async function globalSetup() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const validRegisterData = RegisterData.validRegisterData();
  const homePage = new HomePO(page);

  await page.goto('http://localhost:3000/US/en/1/register');
  await registerPage.fillRegistrationForm(validRegisterData);
  await registerPage.clickOnRegisterButton();
  expect(await homePage.isHomePageVisible()).toBeTruthy();

  await page.context().storageState({ path: './registerAuth.json' });
  await browser.close();
}
export default globalSetup;
