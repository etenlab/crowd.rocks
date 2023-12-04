import { Page, chromium, expect, test } from '@playwright/test';
import PageUrls from '../constants/PageUrls';
import RegistrationPage from '../pages/RegistrationPage';
import RegisterData from '../data-factory/RegisterData';
import DocumentsPage from '../pages/Community/DocumentsPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import { language, settings } from '../enums/Enums';
import SettingsPage from '../pages/SettingsPage';
import CommonPage from '../pages/Community/CommonPage';

const registerData = RegisterData.validRegisterData();

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);

  //Navigate to the URL
  await page.goto(PageUrls.RegisterPage);

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(registerData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(3000);
});

async function turnOnBetaTools(page: Page) {
  const settingsPage = new SettingsPage(page);
  const homePage = new HomePage(page);

  //Navigate to the URL
  await page.goto(PageUrls.SettingsPage);

  //Click on beta tools toggle button
  await settingsPage.clickOnToggleButton(settings.BetaTools, true);
  await homePage.clickOnCrowdRocks();
}

test(' Verify that user can select & cancel language successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnTheDocumentsSection();
  expect(await documentsPage.isPageTitleVisible()).toBeTruthy();
  await documentsPage.clickOnSelectYourLanguageDropdown();
  await documentsPage.selectLanguage(language.English);

  //Verify that language is selected
  expect(await documentsPage.isLanguageSelected(language.English)).toBeTruthy();
  await documentsPage.clickOnCrossButton();
  expect(await documentsPage.isLanguageSelected(language.English)).toBeFalsy();
});

test('Verify that select your language popup is closed when user clicks on the cancel button', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and click on the select your language dropdown
  await homePage.clickOnTheDocumentsSection();
  expect(await documentsPage.isPageTitleVisible()).toBeTruthy();
  await documentsPage.clickOnSelectYourLanguageDropdown();
  expect(await documentsPage.isSelectYourLanguagePopupVisible()).toBeTruthy();

  // Click on the cancel button
  await documentsPage.clickOnCancelButton();

  // Verify that select your language popup is closed
  expect(await documentsPage.isSelectYourLanguagePopupVisible()).toBeFalsy();
});

test('Verify that language is selected on the Add new document popup is the same as selected on the Documents page', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and click on the select your language dropdown
  await homePage.clickOnTheDocumentsSection();
  expect(await documentsPage.isPageTitleVisible()).toBeTruthy();
  await documentsPage.clickOnSelectYourLanguageDropdown();
  expect(await documentsPage.isSelectYourLanguagePopupVisible()).toBeTruthy();

  // Click on the cancel button
  await documentsPage.selectLanguage(language.English);
  await documentsPage.clickOnAddNewDocumentsButton();

  // Verify that selected language is displayed
  expect(await documentsPage.isLanguageSelected(language.English));
});

test('Verify that user is able to select & cancel the language from the dropdown list successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnTheDocumentsSection();
  expect(await documentsPage.isPageTitleVisible()).toBeTruthy();

  await documentsPage.clickOnAddNewDocumentsButton();
  await documentsPage.clickOnSelectDocumentLanguageDropdown();
  await documentsPage.selectLanguage(language.English);
  expect(await documentsPage.isLanguageSelected(language.English)).toBeTruthy();

  await documentsPage.clickOnAddNewDocumentPopupCrossButton();
  expect(await documentsPage.isLanguageSelected(language.English)).toBeFalsy();
});

test('Verify that user can upload documents successfully', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnTheDocumentsSection();
  expect(await documentsPage.isPageTitleVisible()).toBeTruthy();
  await documentsPage.clickOnSelectYourLanguageDropdown();
  await documentsPage.selectLanguage(language.English);

  await documentsPage.clickOnAddNewDocumentsButton();
  expect(await documentsPage.isAddNewDocumentPopupVisible()).toBeTruthy();

  //Verify that language is selected
  expect(await documentsPage.isLanguageSelected(language.English)).toBeTruthy();
  await documentsPage.uploadTextFile();
  //   expect(await commonPage.getValidationMessage()).toEqual(
  //     'Please select document language first.',
  //   );
});

test('Verify that validation message is appeared when user uploads the file without selecting the languages', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page
  await homePage.clickOnTheDocumentsSection();

  //Upload text file without selecting the language
  await documentsPage.clickOnAddNewDocumentsButton();
  expect(await documentsPage.isAddNewDocumentPopupVisible()).toBeTruthy();
  await documentsPage.uploadTextFile();
  expect(await commonPage.getValidationMessage()).toEqual(
    'Please select document language first.',
  );
});

test('Verify that add new document popup is closed when user click on the cancel button', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnTheDocumentsSection();
  await documentsPage.clickOnAddNewDocumentsButton();
  expect(await documentsPage.isAddNewDocumentPopupVisible()).toBeTruthy();
  await documentsPage.clickOnCancelButton();

  //Verify that Add new popup is closed
  expect(await documentsPage.isAddNewDocumentPopupVisible()).toBeFalsy();
});
