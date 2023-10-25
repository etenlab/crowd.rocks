import { test, expect } from '@playwright/test';
import RegisterData from '../data-factory/RegisterData';
import RegisterPO from '../pages/RegistrationPage';
import LoginPO from '../pages/LoginPage';
import HomePO from '../pages/HomePage';
import MenuPO from '../pages/MenuPage';
import LoginDTO from '../data-objects/LoginDto';

test('1: Verify that user is register/logout and login again successfully', async ({
  page,
}) => {
  const registerPage = new RegisterPO(page);
  const loginPage = new LoginPO(page);
  const homePage = new HomePO(page);
  const leftMenu = new MenuPO(page);
  const registerData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Verify the login header text
  expect(await loginPage.isLoginPageTitleVisible()).toBeTruthy();

  //Click on the 'Register' button
  await loginPage.goToRegisterPage();

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(registerData);
  await registerPage.clickOnRegisterButton();

  //logout from the app
  await homePage.clickOnExpandMenu();
  await leftMenu.clickOnLogout();

  //Login to the app with registered data
  await homePage.clickOnExpandMenu();
  await leftMenu.clickOnLoginButton();

  const loginData = LoginDTO;
  loginData.email = registerData.email;
  loginData.password = registerData.password;

  //Login with valid credentials
  await loginPage.loginToApp(loginData);

  //Verify user is logged in
  expect(await homePage.isHomePageVisible()).toBeTruthy();
});

test('2: Verify that email field is mandatory', async ({ page }) => {
  const registerPage = new RegisterPO(page);
  const loginPage = new LoginPO(page);
  const registerData = RegisterData.registerDataWithoutEmail();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Verify the login header text
  expect(await loginPage.isLoginPageTitleVisible()).toBeTruthy();

  //Click on the 'Register' button on login page
  await loginPage.goToRegisterPage();

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill the register form without email
  await registerPage.fillRegistrationForm(registerData);

  //click on register button
  await registerPage.clickOnRegisterButton();

  //verify the validation message is displayed for email
  await expect(page).toHaveScreenshot('emailErrorMessage.png');
});

test('3: Verify that username field is mandatory', async ({ page }) => {
  const registerPage = new RegisterPO(page);
  const loginPage = new LoginPO(page);
  const registerData = RegisterData.registerDataWithoutUserName();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Verify the login header text
  expect(await loginPage.isLoginPageTitleVisible()).toBeTruthy();

  //Click on the 'Register' button on login page
  await loginPage.goToRegisterPage();

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill the register form withoutusername
  await registerPage.fillRegistrationForm(registerData);

  //click on register button
  await registerPage.clickOnRegisterButton();

  //verify the validation message is displayed for username
  await expect(page).toHaveScreenshot('usernameErrorMessage.png', {
    threshold: 0.2,
  });
});

test('4: Verify that password field is mandatory', async ({ page }) => {
  const registerPage = new RegisterPO(page);
  const loginPage = new LoginPO(page);
  const registerData = RegisterData.registerDataWithoutPassword();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Verify the login header text
  expect(await loginPage.isLoginPageTitleVisible()).toBeTruthy();

  //Click on the 'Register' button on login page
  await loginPage.goToRegisterPage();

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill the register form without password
  await registerPage.fillRegistrationForm(registerData);

  //click on register button
  await registerPage.clickOnRegisterButton();

  //verify the validation message is displayed for password
  await expect(page).toHaveScreenshot('passwordErrorMessage.png');
});

test('5: Verify that validation shown for invalid email format', async ({
  page,
}) => {
  const registerPage = new RegisterPO(page);
  const loginPage = new LoginPO(page);
  const registerData = RegisterData.registerDataWithInvalidEmailFormat();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Verify the login header text
  expect(await loginPage.isLoginPageTitleVisible()).toBeTruthy();

  //Click on the 'Register' button on login page
  await loginPage.goToRegisterPage();

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form with invalid email format
  await registerPage.fillRegistrationForm(registerData);

  //click on register button
  await registerPage.clickOnRegisterButton();

  //Verify validation message is displayed for invalid email
  await expect(page).toHaveScreenshot('invalidEmailErrorMessage.png');
});
