import { expect, test } from '@playwright/test';
import LoginPO from '../pages/LoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import HomePO from '../pages/HomePage';
import LoginData from '../data-factory/LoginData';
import { leftMenu } from '../enums/Enums';
import MenuPage from '../pages/MenuPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterData from '../data-factory/RegisterData';

test('1: Verify that user is navigated to Profile page successfully', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const profilePage = new ProfilePage(page);
  const validLoginData = LoginData.validLoginData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login with valid credentials
  await loginPage.loginToApp(validLoginData);

  //Verify user is navigated to home page
  expect(await homePage.isHomePageVisible()).toBeTruthy();

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();
});

test('2: Verify that user can edit username on my profile page', async ({
  page,
}) => {
  const registerPage = new RegistrationPage(page);
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const profilePage = new ProfilePage(page);
  const validRegisterData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/US/en/1/register');

  //Register user with valid register data
  await registerPage.fillRegistrationForm(validRegisterData);
  await registerPage.clickOnRegisterButton();

  //Verify user is navigated to home page
  expect(await homePage.isHomePageVisible()).toBeTruthy();

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();

  //Verify the username is equal to register username
  expect(await profilePage.getUsernameText()).toEqual(
    validRegisterData.username,
  );

  //Edit the username and click on submit button
  await profilePage.editUsername('AutomationUser2');
  await profilePage.clickOnSubmitButton();
  await profilePage.clickOnUsernameText();
  await profilePage.clickOnSubmitButton();

  //Verify the username is equal to the 'AutomationUser2'
  expect(await profilePage.getUsernameText()).toEqual('AutomationUser2');
});

test('3: Verify that username is not changed after clicking on the cancel button ', async ({
  page,
}) => {
  const registerPage = new RegistrationPage(page);
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const profilePage = new ProfilePage(page);
  const validRegisterData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/US/en/1/register');

  //Register the new user
  await registerPage.fillRegistrationForm(validRegisterData);
  await registerPage.clickOnRegisterButton();

  //Verify user is navigated to home page
  expect(await homePage.isHomePageVisible()).toBeTruthy();

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();

  //Verify the username is equal to the register username
  expect(await profilePage.getUsernameText()).toEqual(
    validRegisterData.username,
  );

  //Edit the username and click on cancel button
  await profilePage.editUsername('AutomationUser2');
  await profilePage.clickOnCancelButton();

  //Click on username and cancel button and verify the username doesn't updated
  await profilePage.clickOnUsernameText();
  await profilePage.clickOnCancelButton();
  expect(await profilePage.getUsernameText()).toEqual(
    validRegisterData.username,
  );
});

test('4: Verify that user is naviagted to reset a password page ', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const profilePage = new ProfilePage(page);
  const validLoginData = LoginData.validLoginData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login with valid credentials
  await loginPage.loginToApp(validLoginData);

  //Verify user is navigated to home page
  expect(await homePage.isHomePageVisible()).toBeTruthy();

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();

  //Click on reset password button and verify the forgot password page title
  await profilePage.clickOnResetPasswordButton();
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();
});
