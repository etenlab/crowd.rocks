import { Page, chromium, expect, test } from '@playwright/test';
import RegistrationPage from '../../pages/RegistrationPage';
import RegisterData from '../../data-factory/RegisterData';
import LoginPage from '../../pages/LoginPage';
import pageUrls from '../../constants/PageUrls';
import ForumsPage from '../../pages/Community/ForumsPage';
import CommonPage from '../../pages/Community/CommonPage';
import HomePage from '../../pages/HomePage';
import { community } from '../../enums/Enums';
import TopicsPage from '../../pages/Community/TopicsPage';
import ThreadsPage from '../../pages/Community/ThreadsPage';

const registerData = RegisterData.validRegisterData();
const forumName = 'Automation Forum ' + Math.random();
const forumDescription = 'Automation Forum Description ' + Math.random();
const threadName = 'Automation thread ' + Math.random();
const editedThreadName = 'Automation Edited thread ' + Math.random();
const topicName = 'Automation Topic Name ' + Math.random();
const topicDescription = 'Automation Topic Description ' + Math.random();
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const forumsPage = new ForumsPage(page);
  const topicsPage = new TopicsPage(page);
  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);

  //Navigate to the URL
  await page.goto(pageUrls.RegisterPage);

  //Verify the title of the page
  expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

  //Fill and submit the register form
  await registerPage.fillRegistrationForm(registerData);
  await registerPage.clickOnRegisterButton();
  await page.waitForTimeout(4000);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on community tab and verify that user redirected on community page
  await homePage.clickOnCommunitySection();
  expect(await forumsPage.isPageTitleVisible()).toBeTruthy();

  //Click on the add new button and verify that 'add new forum' popup is appeared
  await commonPage.clickOnAddNewButton(community.Forums);
  expect(await forumsPage.isAddNewForumPopupVisible()).toBeTruthy();

  //Create a new forum
  await forumsPage.fillForumDetails(forumName, forumDescription);
  await commonPage.clickOnCreateNewButton();

  //Verify the validation message
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at creating new forum!',
  );

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new topic
  await commonPage.clickOnAddNewButton(community.Topics);
  expect(await topicsPage.isAddNewTopicPopupVisible()).toBeTruthy();
  await topicsPage.fillTopicDetails(topicName, topicDescription);
  await commonPage.clickOnCreateNewButton();

  //Verify the validation messsage
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at creating new forum folder!',
  );
  await browser.close();
});

async function navigateToThreadsPage(
  page: Page,
  loginPage: LoginPage,
  homePage: HomePage,
  forumsPage: ForumsPage,
  topicsPage: TopicsPage,
  commonPage: CommonPage,
) {
  //Login with valid credentials
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  await topicsPage.clickOnTheTopic(topicName);
}

test('1: Verify that user is able to create new thread successfully', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);
  const threadsPage = new ThreadsPage(page);

  //Navigate to the threads page
  await navigateToThreadsPage(
    page,
    loginPage,
    homePage,
    forumsPage,
    topicsPage,
    commonPage,
  );

  //Create a new thread
  await commonPage.clickOnAddNewButton(community.Threads);
  expect(await threadsPage.isAddNewThreadPopupVisible()).toBeTruthy();
  await threadsPage.fillThreadName(threadName);
  await commonPage.clickOnCreateNewButton();

  //Verify that created topic is displayed on the topic page
  await commonPage.searchName(threadName.toLowerCase());
  expect(await commonPage.isCreatedCommunityVisible(threadName)).toBeTruthy();
});

test('2: Verify that user is not allowed to create a thread with a thread Name which is already exist', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);
  const threadsPage = new ThreadsPage(page);

  //Navigate to the threads page
  await navigateToThreadsPage(
    page,
    loginPage,
    homePage,
    forumsPage,
    topicsPage,
    commonPage,
  );

  //Create a new thread
  await commonPage.clickOnAddNewButton(community.Threads);
  expect(await threadsPage.isAddNewThreadPopupVisible()).toBeTruthy();
  await threadsPage.fillThreadName(threadName);
  await commonPage.clickOnCreateNewButton();

  //Verify the validation message
  expect(await commonPage.getValidationMessage()).toEqual(
    'Failed at creating new thread! [ThreadUpsertFailed]',
  );
});

test('3: Verify that search functionality is working properly', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);

  //Navigate to the threads page
  await navigateToThreadsPage(
    page,
    loginPage,
    homePage,
    forumsPage,
    topicsPage,
    commonPage,
  );

  //Verify that user can search the forum by using search bar
  await commonPage.searchName(threadName.toLowerCase());
  expect(await commonPage.isCreatedCommunityVisible(threadName)).toBeTruthy();
});

test('5: Verify that validation message is appeared when user passes blank thread name', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const homePage = new HomePage(page);
  const threadsPage = new ThreadsPage(page);
  const commonPage = new CommonPage(page);

  //Navigate to the threads page
  await navigateToThreadsPage(
    page,
    loginPage,
    homePage,
    forumsPage,
    topicsPage,
    commonPage,
  );
  //Create a new forum without adding the description
  await commonPage.clickOnAddNewButton(community.Threads);
  await threadsPage.fillThreadName('');
  await commonPage.clickOnCreateNewButton();

  //Verify the validation messsage
  expect(await commonPage.getValidationMessage()).toEqual(
    'Thread name cannot be empty string!',
  );
});

test('6: Verify that thread is not created when click on cancel button after entering the valid thread name', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);
  const threadsPage = new ThreadsPage(page);

  //Navigate to the threads page
  await navigateToThreadsPage(
    page,
    loginPage,
    homePage,
    forumsPage,
    topicsPage,
    commonPage,
  );

  //Create a new forum without adding the description
  await commonPage.clickOnAddNewButton(community.Threads);
  await threadsPage.fillThreadName(threadName);
  await commonPage.clickOnCancelButton();

  //Verify the validation messsage
  expect(await threadsPage.isAddNewThreadPopupVisible()).toBeFalsy();
});

test('7: Verify that user can edit the created topic and can search the edited topic using search bar', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);
  const threadsPage = new ThreadsPage(page);

  //Navigate to the threads page
  await navigateToThreadsPage(
    page,
    loginPage,
    homePage,
    forumsPage,
    topicsPage,
    commonPage,
  );

  //Edit the forum details and click on the save button
  await commonPage.searchName(threadName.toLowerCase());
  await threadsPage.clickOnEditButton(threadName);
  await threadsPage.fillThreadName(editedThreadName);
  await commonPage.clickOnSaveButton();

  //Verify the Validation message
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at updating thread!',
  );
  //Verify the edited forum is displayed on the forums page
  await page.waitForTimeout(4000);
  await commonPage.searchName(editedThreadName.toLowerCase());
  expect(
    await commonPage.isCreatedCommunityVisible(editedThreadName),
  ).toBeTruthy();
});

test.afterAll('Delete Forum', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);
  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await homePage.clickOnCommunitySection();

  //Delete all forums
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.deleteForum(forumName);
  await browser.close();
});
