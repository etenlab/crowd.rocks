import { expect, test } from '@playwright/test';
import MenuPage from '../pages/MenuPage';
import HomePage from '../pages/HomePage';
import SettingsPage from '../pages/SettingsPage';
import SettingsData from '../data-factory/SettingsData';

test('Verify that user is navigated to settings page after clicking on the setting button from the left nav menu', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const leftMenu = new MenuPage(page);
  const settingsPage = new SettingsPage(page);

  //Navigate to the URL
  await page.goto('/US/en/1/home');

  //Expand the menu and click on settings
  await homePage.clickOnExpandMenu();
  await leftMenu.clickOnSettingButton();

  //verify setting page title is displayed
  expect(await settingsPage.isSettingPageTitleVisible()).toBeTruthy();
});

test('Verify that all the settings options are available on the setting page', async ({
  page,
}) => {
  const homePage = new HomePage(page);
  const leftMenu = new MenuPage(page);
  const settingsPage = new SettingsPage(page);
  const settingsDataList = SettingsData.settingsNameList();

  //Navigate to the URL
  await page.goto('/US/en/1/home');

  //Expand the menu and click on settings
  await homePage.clickOnExpandMenu();
  await leftMenu.clickOnSettingButton();

  const lists = await settingsPage.getTheSettingPageList();
  await expect(lists).toEqual(expect.arrayContaining(settingsDataList));
});
