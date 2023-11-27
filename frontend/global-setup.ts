import { chromium, type FullConfig } from '@playwright/test';
import RegistrationPage from './tests/pages/RegistrationPage';
import RegisterData from './tests/data-factory/RegisterData';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const validRegisterData = RegisterData.validRegisterData();
  const { baseURL, storageState } = config.projects[0].use;

  //Register User
  await page.goto(baseURL + 'US/en/1/register');
  await registerPage.fillRegistrationForm(validRegisterData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(5000);
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}
export default globalSetup;
