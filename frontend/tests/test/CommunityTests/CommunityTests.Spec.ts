import { chromium, expect, test } from '@playwright/test';
import RegistrationPage from '../../pages/RegistrationPage';
import RegisterData from '../../data-factory/RegisterData';
import LoginPage from '../../pages/LoginPage';
import pageUrls from '../../constants/PageUrls';
import ForumsPage from '../../pages/Community/ForumsPage';

const registerData = RegisterData.validRegisterData();
const forumName = 'Automation Forum ' + Math.random();
const forumDescription = 'Automation Forum Description ' + Math.random();
const editedForumName = 'Automation Edited Forum ' + Math.random();
const forumNameWithoutDescription =
  'Automation Forum without Description ' + Math.random();
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

test('1: Verify that user redirected on community page and able to create new forums', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on community tab and verify that user redirected on community page
  await forumsPage.clickOnCommunitySection();
  expect(await forumsPage.isPageTitleVisible()).toBeTruthy();

  //Click on the add new button and verify that 'add new forum' popup is appeared
  await forumsPage.clickOnTheAddNewButton();
  expect(await forumsPage.isAddNewForumPopupVisible()).toBeTruthy();

  //Create a new forum
  await forumsPage.fillForumDetails(forumName, forumDescription);
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation message
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Success at creating new forum!',
  );

  //Verify the created forum is displayed on the forums page
  await page.waitForTimeout(4000);
  expect(await forumsPage.isCreatedForumVisible(forumName)).toBeTruthy();
});

test('2: Verify that user is not allow to create a forum with a Forum Name which is already exist', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on community tab and verify that user redirected on community page
  await forumsPage.clickOnCommunitySection();
  expect(await forumsPage.isPageTitleVisible()).toBeTruthy();

  //Click on the add new button and verify that 'add new forum' popup is appeared
  await forumsPage.clickOnTheAddNewButton();
  expect(await forumsPage.isAddNewForumPopupVisible()).toBeTruthy();

  //Create a new forum
  await forumsPage.fillForumDetails(forumName, forumDescription);
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation message
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Failed at creating new forum! [ForumUpsertFailed]',
  );
});

test('3: Verify that search functionality is working properly', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the URL
  await page.goto(pageUrls.ForumPage);

  //Verify that user can search the forum by using search bar
  await forumsPage.searchForumName(forumName.toLowerCase());
  expect(await forumsPage.isCreatedForumVisible(forumName)).toBeTruthy();
});

test('4: Verify that user is able to create forum without adding the description', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Create a new forum without adding the description
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumDetails(forumNameWithoutDescription, '');
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation messsage
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Success at creating new forum!',
  );
});

test('5: Verify that validation message is appeared when user passes blank forum details', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Create a new forum
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumDetails('', '');
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation messsage
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Forum name cannot be empty string!',
  );
});

test('6: Verify that validation message is appeared when user only enters forum description', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Create a new forum
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumDetails('', 'Test Description');
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation messsage
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Forum name cannot be empty string!',
  );
});

test('7: Verify that forum is not created when click on cancel button after entering the valid forum details', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Create a new forum
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumDetails(forumName, forumDescription);
  await forumsPage.clickOnAddNewForumPopupCancelButton();

  //verify that forum is not created
  expect(await forumsPage.isAddNewForumPopupVisible()).toBeFalsy();
});

test('8: Verify that user can edit the created forum and can search the edited forum using search bar', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const forumDescriptionEdit = 'TestForum Description Edit' + Math.random();

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Edit the forum details and click on the save button
  await forumsPage.searchForumName(forumName.toLowerCase());
  await forumsPage.clickOnEditForumButton(forumName);
  await forumsPage.fillForumDetails(editedForumName, forumDescriptionEdit);
  await forumsPage.clickOnSaveButton();

  //Verify the Validation message
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Success at updating forum!',
  );
  //Verify the edited forum is displayed on the forums page
  await page.waitForTimeout(4000);
  await forumsPage.searchForumName(editedForumName.toLowerCase());
  expect(await forumsPage.isEditedForumVisible(editedForumName)).toBeTruthy();
});

test.afterAll('Delete Forum', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const forumsList = [editedForumName, forumNameWithoutDescription];

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Delete all forums
  for (const forum of forumsList) {
    await forumsPage.searchForumName(forum.toLowerCase());
    await forumsPage.deleteForum(forum);
  }
  await browser.close();
});
