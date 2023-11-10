import { expect, test } from '@playwright/test';
import LoginPO from '../pages/LoginPage';
import HomePO from '../pages/HomePage';
import RegisterPO from '../pages/RegistrationPage';
import LoginData from '../data-factory/LoginData';

test.skip('1: Verify that user is logged in with valid data', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const homePage = new HomePO(page);
  const validLoginData = LoginData.validLoginData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login with valid credentials
  await loginPage.loginToApp(validLoginData);

  //Verify user is navigated to home page
  expect(await homePage.isHomePageVisible()).toBeTruthy();
});

test('2: Verify that validation message is shown when try to login with invalid data in both field', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const invalidLoginData = LoginData.inValidLoginData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login with invalid credentials
  await loginPage.loginToApp(invalidLoginData);

  //Verify that validation message is displayed
  expect(await loginPage.getValidationMessage()).toContain(
    'Invalid email or password',
  );
});

test('3: Verify that validation message is shown for email when try to login with invalid email', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const invalidEmailData = LoginData.inValidEmailData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login with invalid email
  await loginPage.loginToApp(invalidEmailData);

  //Verify the validation message is displayed for invalid email
  expect(await loginPage.getValidationMessage()).toContain(
    'Invalid email or password',
  );
});

test('4: Verify that validation message is shown for password when try to login with invalid password', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const invalidPasswordData = LoginData.inValidPasswordData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login with invalid details
  await loginPage.loginToApp(invalidPasswordData);

  //Verify the validation message is displayed for invalid password
  expect(await loginPage.getValidationMessage()).toContain(
    'Invalid email or password',
  );
});

test.skip('5: Verify that email field is mandatory', async ({ page }) => {
  const loginPage = new LoginPO(page);
  const loginDataWithoutEmail = LoginData.withoutEmailData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login without email
  await loginPage.loginToApp(loginDataWithoutEmail);

  //Verify the validation message is displayed for email
  await expect(page).toHaveScreenshot('Login_emailErrorMessage.png');
});

test.skip('6: Verify that password field is mandatory', async ({ page }) => {
  const loginPage = new LoginPO(page);
  const loginDataWithoutPassword = LoginData.withoutPasswordData();

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Login without password
  await loginPage.loginToApp(loginDataWithoutPassword);

  //Verify the validation message is displayed for password
  await expect(page).toHaveScreenshot('Login_passwordErrorMessage.png');
});

test('7:Verify that user is redirected to the Register page after clicking on the Register button', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);
  const register = new RegisterPO(page);

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Navigate to register page
  await loginPage.goToRegisterPage();

  //Verify the title of the page
  expect(await register.isRegisterPageTitleVisible()).toBeTruthy();
});

test('8:Verify that user is redirected to the forgot password page after clicking on the forgot password button', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Click on the forgot password button
  await loginPage.clickOnForgotPasswordButton();

  //Verify that user is navigated to forgot password page
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();
});

test('9:Verify that validation message is display when user clicks on the "SEND PASSWORD RESET EMAIL" button after passing the valid email', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Click on the forgot password button
  await loginPage.clickOnForgotPasswordButton();

  //Verify that user is navigated to forgot password page
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();

  //Enter valid email address
  await loginPage.fillEmailIdForResetPassword(
    LoginData.validEmailForResetPassword(),
  );

  //Click on the "SEND PASSWORD RESET EMAIL" button
  await loginPage.clickOnSendResetPasswordEmailButton();

  //Verify the validation message is displayed for valid email
  expect(await loginPage.getForgotPasswordValidationMessage()).toContain(
    'If your email exists in our database a reset link has been sent.',
  );
});

test('10:Verify that validation message is display when user clicks on the "SEND PASSWORD RESET EMAIL" button after passing the email in wrong format', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Click on the forgot password button
  await loginPage.clickOnForgotPasswordButton();

  //Verify that user is navigated to forgot password page
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();

  //Enter valid email address
  await loginPage.fillEmailIdForResetPassword(
    LoginData.invalidEmailForResetPassword(),
  );

  //Click on the "SEND PASSWORD RESET EMAIL" button
  await loginPage.clickOnSendResetPasswordEmailButton();

  //Verify the validation message is displayed for valid email
  expect(await loginPage.getForgotPasswordValidationMessage()).toContain(
    'If your email exists in our database a reset link has been sent.',
  );
});

test.skip('11:Verify that validation message is shown when user clicks on the "SEND PASSWORD RESET EMAIL" button without entering the email', async ({
  page,
}) => {
  const loginPage = new LoginPO(page);

  //Navigate to the URL
  await page.goto('/US/en/1/login');

  //Click on the forgot password button
  await loginPage.clickOnForgotPasswordButton();

  //Verify that user is navigated to forgot password page
  expect(await loginPage.isForgotPasswordTitleVisible()).toBeTruthy();

  //Click on the "SEND PASSWORD RESET EMAIL" button
  await loginPage.clickOnSendResetPasswordEmailButton();

  //Verify the validation message is displayed for blank email
  await expect(page).toHaveScreenshot(
    'ForgotPasswordBlankEmailErrorMessage.png',
  );
});
