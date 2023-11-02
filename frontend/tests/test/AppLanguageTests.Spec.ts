import { expect, test } from '@playwright/test';
import MenuPage from '../pages/MenuPage';
import HomePage from '../pages/HomePage';
import { leftMenu } from '../Enums/Enums';
import AppLanguagePage from '../pages/AppLanguagePage';

test('Verify that user is navigated to select app language page after clicking on the app language button from the left nav menu', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const leftMenuPage = new MenuPage(page);
  const appLanguagePage = new AppLanguagePage(page);

  //Navigate to the URL
  await page.goto('/US/en/1/home');

  //Expand the menu and click on app language
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.AppLanguage);

  //verify setting page title is displayed
  expect(await appLanguagePage.isAppLanguagePageTitleVisible()).toBeTruthy();
});

test('Verify that the app language popup appeared when user clicks on the App Language button from the left nav menu', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const leftMenuPage = new MenuPage(page);
  const appLanguagePage = new AppLanguagePage(page);

  //Navigate to the URL
  await page.goto('/US/en/1/home');

  //Expand the menu and click on app language
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.AppLanguage);

  //verify setting page title is displayed
  expect(await appLanguagePage.isAppLanguagePageTitleVisible()).toBeTruthy();
});
