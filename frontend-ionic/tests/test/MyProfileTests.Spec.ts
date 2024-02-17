import { chromium, expect, test } from '@playwright/test';
import HomePO from '../pages/HomePage';
import { leftMenu } from '../enums/Enums';
import pageUrls from '../constants/PageUrls';
import MenuPage from '../pages/MenuPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterData from '../data-factory/RegisterData';
import RegistrationPage from '../pages/RegistrationPage';
import LoginPage from '../pages/LoginPage';
const updatedUsername = 'UpdatedUsername' + Math.floor(Math.random() * 10);
const registerData = RegisterData.validRegisterData();
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.RegisterPage);

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(registerData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(4000);
});

test('1: Verify that user can navigate to profile page and able to edit username on profile page', async ({
  page,
}) => {
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();

  //Verify the username is equal to register username
  expect(await profilePage.getUsernameText()).toEqual(registerData.username);

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
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);
  expect(await profilePage.isPageTitlePresent()).toBeTruthy();

  //Edit the username and click on cancel button
  await profilePage.editUsername(registerData.username);
  await profilePage.clickOnCancelButton();

  //Click on username and cancel button and verify the username doesn't updated
  await profilePage.clickOnUsernameText();
  await profilePage.clickOnCancelButton();
  expect(await profilePage.getUsernameText()).toEqual(updatedUsername);
});

test('3: Verify that user is naviagted to reset a password page ', async ({
  page,
}) => {
  const homePage = new HomePO(page);
  const leftMenuPage = new MenuPage(page);
  const loginPage = new LoginPage(page);
  const profilePage = new ProfilePage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on left menu for myprofile and verify the page title
  await homePage.clickOnExpandMenu();
  await leftMenuPage.clickOnLeftMenufeatureButton(leftMenu.MyProfile);

  //Click on reset password button and verify the forgot password page title
  await profilePage.clickOnResetPasswordButton();
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();
});
