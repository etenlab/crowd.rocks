import { Page, chromium, expect, test } from '@playwright/test';
import PageUrls from '../constants/PageUrls';
import RegistrationPage from '../pages/RegistrationPage';
import RegisterData from '../data-factory/RegisterData';
import DocumentsPage from '../pages/Community/DocumentsPage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import { language, settings } from '../enums/Enums';
//import SettingsPage from '../pages/SettingsPage';
import CommonPage from '../pages/Community/CommonPage';
import constants from '../constants/DocumentConstants';
import { writeFileSync } from 'fs';
import PericopeToolPage from '../pages/Community/PericopeToolPage';
import SettingsPage from '../pages/SettingsPage';
import PostPage from '../pages/Community/PostPage';

const registerData = RegisterData.validRegisterData();
const documentName = await generateUniqueFileName('txt');

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);

  writeFileSync(constants.filePath(documentName), constants.fileContent);

  //Navigate to the URL
  await page.goto(PageUrls.RegisterPage);

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(registerData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(3000);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnTheDocumentsSection();
  expect(await documentsPage.isPageTitleVisible()).toBeTruthy();
  await documentsPage.clickOnSelectYourLanguageDropdown();
  await documentsPage.selectLanguage(language.English);
  await documentsPage.clickOnAddNewDocumentsButton();
  expect(await documentsPage.isAddNewDocumentPopupVisible()).toBeTruthy();
  const [uploadFile] = await Promise.all([
    page.waitForEvent('filechooser'),
    await documentsPage.clickOnUploadButton(),
  ]);
  uploadFile.setFiles(constants.filePath(documentName));
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at uploading new document!',
  );
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
async function loginWithNewUser(page: Page) {
  const registerPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  const newUserData = RegisterData.validRegisterData();
  //Navigate to the URL
  await page.goto(PageUrls.RegisterPage);

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(newUserData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(3000);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(newUserData);
}
test('Verify that added document is displayed when user search the document in pericope tool page', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  expect(documentsPage.isCreatedDocumentVisible(documentName)).toBeTruthy();
});

test('Verify that user can add a pericope tools in document successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  //Click on edit mode in pericope tool page
  await pericopeToolPage.clickOnEditMode();

  await pericopeToolPage.clickOnRandomTextForAddPericopeTool();

  await pericopeToolPage.clickOnAddPericopeTool();
  expect(await pericopeToolPage.getPericopeDotsColor()).toEqual(
    'rgb(71, 111, 255)',
  );
});

test('Verify that user is able to add/remove like and dislike in the document text successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  //Click on edit mode in pericope tool page
  await pericopeToolPage.clickOnRandomTextForAddPericopeTool();

  //add like
  await pericopeToolPage.clickOnLikeButton();
  expect(await pericopeToolPage.getPericopeDotsColor()).toEqual(
    'rgb(20, 201, 114)',
  );
  expect(await pericopeToolPage.getTheLikeCount()).toEqual('1');
  expect(await pericopeToolPage.getTheDislikeCount()).toEqual('0');

  //Remove like
  await pericopeToolPage.clickOnLikeButton();
  expect(await pericopeToolPage.getPericopeDotsColor()).toEqual(
    'rgb(71, 111, 255)',
  );
  expect(await pericopeToolPage.getTheLikeCount()).toEqual('0');
  expect(await pericopeToolPage.getTheDislikeCount()).toEqual('0');

  //Add dislike
  await pericopeToolPage.clickOnDislikeButton();
  expect(await pericopeToolPage.getPericopeDotsColor()).toEqual(
    'rgb(255, 71, 71)',
  );
  expect(await pericopeToolPage.getTheLikeCount()).toEqual('0');
  expect(await pericopeToolPage.getTheDislikeCount()).toEqual('1');

  //Remove dislike
  await pericopeToolPage.clickOnDislikeButton();
  expect(await pericopeToolPage.getPericopeDotsColor()).toEqual(
    'rgb(71, 111, 255)',
  );
  expect(await pericopeToolPage.getTheLikeCount()).toEqual('0');
  expect(await pericopeToolPage.getTheDislikeCount()).toEqual('0');
});

test('Verify that user is able to add posts in the added pericode successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);
  const postPage = new PostPage(page);
  const postTextMessage = 'Automation Post Message' + Math.random();

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  //Click on edit mode in pericope tool page
  await pericopeToolPage.clickOnRandomTextForAddPericopeTool();
  await pericopeToolPage.clickOnPostButton();
  await postPage.createNewPosts(postTextMessage, 2);
  await postPage.clickOnBackArrowButton();
  await pericopeToolPage.clickOnRandomTextForAddPericopeTool();
  expect(await pericopeToolPage.getPostCount()).toEqual('2');
});

test('Verify that user can delete a pericope tools in document successfully', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  //Click on edit mode in pericope tool page
  await pericopeToolPage.clickOnEditMode();

  await pericopeToolPage.clickOnRandomTextForAddPericopeTool();

  await pericopeToolPage.clickOnDeletePericopeTool();
  expect(await pericopeToolPage.isPericopeToolAdded()).toBeFalsy();
});

test('Verify that user is not able to add the pericope tool when edit mode is off', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  await pericopeToolPage.clickOnRandomTextForAddPericopeTool();
  expect(await pericopeToolPage.isPericopeToolVisible()).toBeFalsy();
});

test('Verify that selected language name is displayed in pericope tool detail page', async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);

  //Login with valid credentials and turn on the beta tools
  await page.goto(PageUrls.LoginPage);
  await loginPage.loginToApp(registerData);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  expect(await pericopeToolPage.getSelectedLanguageName()).toMatch(
    language.English,
  );
});

test('Verify that user is not able to add pericope in the document which is created by different user', async ({
  page,
}) => {
  const pericopeToolPage = new PericopeToolPage(page);
  const documentsPage = new DocumentsPage(page);
  const homePage = new HomePage(page);
  await loginWithNewUser(page);
  await turnOnBetaTools(page);

  //Navigate to documents page and select language
  await homePage.clickOnThePericopeToolSection();
  expect(await pericopeToolPage.isPageTitleVisible()).toBeTruthy();
  await pericopeToolPage.clickOnSelectYourLanguageDropdown();
  await pericopeToolPage.selectLanguage(language.English);

  //Search the document name and click on that document
  await documentsPage.searchDocuments(documentName.toLocaleLowerCase());
  await documentsPage.clickOnDocument(documentName);

  expect(await pericopeToolPage.isEditModeButtonDisabled()).toBeTruthy();
});
