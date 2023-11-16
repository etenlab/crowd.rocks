import { expect, test } from '@playwright/test';
import MenuPage from '../pages/MenuPage';
import HomePage from '../pages/HomePage';
import { language, leftMenu } from '../enums/Enums';
import AppLanguagePage from '../pages/AppLanguagePage';
import AppLanguageData from '../data-factory/AppLanguageData';

test('1: Verify that the user is navigated to App Language page & able to change the app language', async ({
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

  //Verify setting page title is displayed
  expect(await appLanguagePage.isAppLanguagePopUpTitleVisible()).toBeTruthy();

  //Verify that by default English language is selected
  expect(await appLanguagePage.isAppLanguageChecked(language.English)).toEqual(
    '#476FFF',
  );

  //select the particular language and click on confirm button
  await appLanguagePage.clickOnAppLanguageName(language.Hindi);
  await appLanguagePage.clickOnConfirmButton();

  //verify that preselected language is displayed
  expect(await homePage.getHomePageTitle()).toEqual('मिडिया');
});

test('2: Verify that user can check the different available lanugages', async ({
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

  //Verify setting page title is displayed
  expect(await appLanguagePage.isAppLanguagePopUpTitleVisible()).toBeTruthy();

  //Verifying that user can select all languages
  for (const lang of AppLanguageData.allLanguages()) {
    await appLanguagePage.clickOnAppLanguageName(lang);
    expect(await appLanguagePage.isAppLanguageChecked(lang)).toEqual('#476FFF');
  }
});

test('3: Verify that the default selected language remains selected when user changes the language and click on the cancel button', async ({
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

  //Verify setting page title is displayed
  expect(await appLanguagePage.isAppLanguagePopUpTitleVisible()).toBeTruthy();

  //Verify that by default English language is selected
  expect(await appLanguagePage.isAppLanguageChecked(language.English)).toEqual(
    '#476FFF',
  );

  //Select the particular language and click on confirm button
  await appLanguagePage.clickOnAppLanguageName(language.Hindi);
  await appLanguagePage.clickOnCancelButton();

  //Expand the menu and click on app language
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.AppLanguage);

  //Verify that preselected language is displayed
  expect(await appLanguagePage.isAppLanguageChecked(language.English)).toEqual(
    '#476FFF',
  );
});
