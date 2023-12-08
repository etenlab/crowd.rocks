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
import constants from '../constants/DocumentConstants';
import { writeFileSync } from 'fs';

const registerData = RegisterData.validRegisterData();
const documentName = await generateUniqueFileName('txt');

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);

  writeFileSync(constants.filePath(documentName), constants.fileContent);
  //Navigate to the URL
  await page.goto(PageUrls.RegisterPage);

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(registerData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(3000);
});

async function generateUniqueFileName(extension: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const randomString = Math.random().toString(36).substring(7);
  return `${timestamp}_${randomString}.${extension}`;
}

async function turnOnBetaTools(page: Page) {
  const settingsPage = new SettingsPage(page);
  const homePage = new HomePage(page);

  //Navigate to the URL
  await page.goto(PageUrls.SettingsPage);

  //Click on beta tools toggle button
  await settingsPage.clickOnToggleButton(settings.BetaTools, true);
  await homePage.clickOnCrowdRocks();
}

test('1: Verify that user can upload document successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);

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
  const [uploadFile] = await Promise.all([
    page.waitForEvent('filechooser'),
    await documentsPage.clickOnUploadButton(),
  ]);
  uploadFile.setFiles(constants.filePath(documentName));
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at uploading new document!',
  );
  await documentsPage.clickOnGoToDocumentsButton();
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  expect(
    await documentsPage.isCreatedDocumentVisible(documentName),
  ).toBeTruthy();
});