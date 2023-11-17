import { chromium } from '@playwright/test';
import RegistrationPage from './tests/pages/RegistrationPage';
import RegisterData from './tests/data-factory/RegisterData';

async function globalSetup() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const validRegisterData = RegisterData.validRegisterData();

  await page.goto('http://localhost:3000/US/en/1/register');
  await registerPage.fillRegistrationForm(validRegisterData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(5000);
  await page.context().storageState({ path: './registerAuth.json' });
  await browser.close();
}
export default globalSetup;
