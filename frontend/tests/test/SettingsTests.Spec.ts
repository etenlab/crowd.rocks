import { expect, test } from '@playwright/test';
import MenuPage from '../pages/MenuPage';
import HomePage from '../pages/HomePage';
import SettingsPage from '../pages/SettingsPage';
import SettingsData from '../data-factory/SettingsData';
import { settings, leftMenu } from '../enums/Enums';
import pageUrls from '../constants/PageUrls';

test.skip('Verify that user is navigated to settings page & all the settings options are available on the setting page', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const leftMenuPage = new MenuPage(page);
  const settingsPage = new SettingsPage(page);
  const settingsDataList = SettingsData.allSettingsList();

  //Navigate to the URL
  await page.goto(pageUrls.HomePage);

  //Expand the menu and click on settings
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.Settings);

  //verify setting page title is displayed
  expect(await settingsPage.isSettingPageTitleVisible()).toBeTruthy();

  //Get the settings page lists and verify the settings name is displayed
  const lists = await settingsPage.getAllSettingFeaturesList();
  expect(lists).toEqual(expect.arrayContaining(settingsDataList));
});

test('Verify that all the Beta tools are displayed when user enable beta tools toggle button', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const settingsPage = new SettingsPage(page);
  const getSettingsList = SettingsData.allSettingsList();

  //Navigate to the URL
  await page.goto(pageUrls.SettingsPage);

  //Get the settings page list and verify the beta tools is displayed
  const lists = await settingsPage.getAllSettingFeaturesList();
  expect(lists).toContain(getSettingsList[0]);

  //Click on beta tools toggle button
  await settingsPage.clickOnToggleButton(settings.BetaTools, true);

  //Go to the home page and verify the language text is displayed
  await homePage.clickOnCrowdRocks();
  expect(await homePage.isLanguageTextVisible()).toBeTruthy();

  //Expand the menu and click on settings
  await page.goto(pageUrls.SettingsPage);

  //Click on beta toggle button
  await settingsPage.clickOnToggleButton(settings.BetaTools, false);

  //Go to the home page and verify the language text is hide
  await homePage.clickOnCrowdRocks();
  expect(await homePage.isLanguageTextVisible(false));
});

test('Verify that dark UI is display when user enable dark mode toggle button', async ({
  page,
}) => {
  const settingsPage = new SettingsPage(page);
  const getSettingsList = SettingsData.allSettingsList();

  //Navigate to the URL
  await page.goto(pageUrls.SettingsPage);

  //Get the settings page list and verify the beta tools is displayed
  const lists = await settingsPage.getAllSettingFeaturesList();
  expect(lists).toContain(getSettingsList[1]);

  //click on dark mode toggle button
  await settingsPage.clickOnToggleButton(settings.DarkMode, true);

  //verify that dark mode enabled
  expect(await settingsPage.isDarkModeEnabled()).toBeTruthy();
});

test('Verify that light UI is display when user disable dark mode toggle button', async ({
  page,
}) => {
  const settingsPage = new SettingsPage(page);
  const getSettingsList = SettingsData.allSettingsList();

  //Navigate to the URL
  await page.goto(pageUrls.SettingsPage);

  //Get the settings page list and verify the beta tools is displayed
  const lists = await settingsPage.getAllSettingFeaturesList();
  expect(lists).toContain(getSettingsList[1]);

  //click on dark mode toggle button
  await settingsPage.clickOnToggleButton(settings.DarkMode, false);

  //verify that dark mode enabled
  expect(await settingsPage.isLightModeEnabled()).toBeTruthy();
});
