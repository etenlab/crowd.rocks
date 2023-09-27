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
  const register = new RegisterPO(page);
  const login = new LoginPO(page);
  const home = new HomePO(page);
  const leftMenu = new MenuPO(page);
  const registerData = RegisterData.validRegisterData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Verify the current url
  const currentUrl = await page.url();
  console.log('Env url is: ' + currentUrl);

  //Verify the login header text
  expect(await login.isHeaderTextPresent()).toBeTruthy();

  //Click on the 'Register' button
  await login.goToRegisterPage();

  //Verify the title of the page
  expect(await register.isHeaderTextPresent()).toBeTruthy();

  //Fill and submit the register form
  await register.fillRegistrationForm(registerData);
  await register.clickOnRegisterButton();

  //Verify the header of the home page
  expect(await home.isHeaderTextPresent()).toBeTruthy();

  //logout to the app
  await home.clickOnExpandMenu();
  expect(await leftMenu.isheaderTextPresent()).toBeTruthy();
  await leftMenu.clickOnLogout();

  //Verify the user is redirected to the home page
  expect(await home.isHeaderTextPresent()).toBeTruthy();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login to the app with registered data
  const loginData = LoginDTO;
  loginData.email = registerData.email;
  loginData.password = registerData.password;

  await login.loginToApp(loginData);

  //Verify user is logged in
  expect(await home.isHeaderTextPresent()).toBeTruthy();

  //logout to the app
  await home.clickOnExpandMenu();
  expect(await leftMenu.isheaderTextPresent()).toBeTruthy();
  await leftMenu.clickOnLogout();

  //Verify the user is redirected to the home page
  expect(await home.isHeaderTextPresent()).toBeTruthy();
});
