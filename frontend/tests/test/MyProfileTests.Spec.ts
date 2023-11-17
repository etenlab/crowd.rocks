import { expect, test } from '@playwright/test';
import LoginPO from '../pages/LoginPage';
import HomePO from '../pages/HomePage';
import { leftMenu } from '../enums/Enums';
import MenuPage from '../pages/MenuPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterData from '../data-factory/RegisterData';
const updatedUsername = 'UpdatedUsername' + Math.floor(Math.random() * 10);

test('1: Verify that user can navigate to profile page and able to edit username on profile page', async ({
  page,
}) => {
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const profilePage = new ProfilePage(page);
  const validRegisterData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/US/en/1/home');

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();

  //Verify the username is equal to register username
  expect(await profilePage.getUsernameText()).toEqual(
    validRegisterData.username,
  );

  //Edit the username and click on submit button
  await profilePage.editUsername(updatedUsername);
  await profilePage.clickOnSubmitButton();
  await profilePage.clickOnUsernameText();
  await profilePage.clickOnSubmitButton();

  //Verify the username is equal to the 'AutomationUser2'
  expect(await profilePage.getUsernameText()).toEqual(updatedUsername);
});

test('2: Verify that username is not changed after clicking on the cancel button ', async ({
  page,
}) => {
  const profilePage = new ProfilePage(page);
  const validRegisterData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/US/en/1/profile');

  //Edit the username and click on cancel button
  await profilePage.editUsername(updatedUsername);
  await profilePage.clickOnCancelButton();

  //Click on username and cancel button and verify the username doesn't updated
  await profilePage.clickOnUsernameText();
  await profilePage.clickOnCancelButton();
  expect(await profilePage.getUsernameText()).toEqual(
    validRegisterData.username,
  );
});

test('3: Verify that user is naviagted to reset a password page ', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const profilePage = new ProfilePage(page);

  //Navigate to the URL
  await page.goto('/US/en/1/profile');

  //Click on reset password button and verify the forgot password page title
  await profilePage.clickOnResetPasswordButton();
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();
});
