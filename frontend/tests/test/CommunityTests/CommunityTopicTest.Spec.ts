import { chromium, expect, test } from '@playwright/test';
import RegistrationPage from '../../pages/RegistrationPage';
import RegisterData from '../../data-factory/RegisterData';
import LoginPage from '../../pages/LoginPage';
import pageUrls from '../../constants/PageUrls';
import ForumsPage from '../../pages/Community/ForumsPage';
import CommonPage from '../../pages/Community/CommonPage';
import HomePage from '../../pages/HomePage';
import { community } from '../../enums/Enums';
import TopicsPage from '../../pages/Community/TopicsPage';

const registerData = RegisterData.validRegisterData();
const forumName = 'Automation Forum ' + Math.random();
const forumDescription = 'Automation Forum Description ' + Math.random();
const topicName = 'Automation Topic ' + Math.random();
const topicDescription = 'Automation Topic Description ' + Math.random();
const topicWithoutDescription =
  'Automation topic without description' + Math.random();
const editedTopicName = 'Automation Edited topic ' + Math.random();
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);

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

  await browser.close();
});

test('1: Verify that user is able to create new topic successfully', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);

  //Login with valid credentials
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new topic
  await commonPage.clickOnAddNewButton(community.Topics);
  expect(await topicsPage.isAddNewTopicPopupVisible()).toBeTruthy();
  await topicsPage.fillTopicDetails(topicName, topicDescription);
  await commonPage.clickOnCreateNewButton();

  //Verify that created topic is displayed on the topic page
  await commonPage.searchName(topicName.toLowerCase());
  expect(await commonPage.isCreatedCommunityVisible(topicName)).toBeTruthy();
});

test('2: Verify that user is not allowed to create a topic with a topic Name which is already exist', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);

  //Login with valid credentials
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new topic
  await commonPage.clickOnAddNewButton(community.Topics);
  expect(await topicsPage.isAddNewTopicPopupVisible()).toBeTruthy();
  await topicsPage.fillTopicDetails(topicName, topicDescription);
  await commonPage.clickOnCreateNewButton();

  //Verify the validation message
  expect(await commonPage.getValidationMessage()).toEqual(
    'Failed at creating new forum folder! [ForumFolderUpsertFailed]',
  );
});

test('3: Verify that search functionality is working properly', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const commonPage = new CommonPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Verify that user can search the forum by using search bar
  await commonPage.searchName(topicName.toLowerCase());
  expect(await commonPage.isCreatedCommunityVisible(topicName)).toBeTruthy();
});

test('4: Verify that user is able to create topic without adding the description', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);
  const topicsPage = new TopicsPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new forum without adding the description
  await commonPage.clickOnAddNewButton(community.Topics);
  await topicsPage.fillTopicDetails(topicWithoutDescription, '');
  await commonPage.clickOnCreateNewButton();

  //Verify the validation messsage
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at creating new forum folder!',
  );
});

test('5: Verify that validation message is appeared when user passes blank topics details', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);
  const topicsPage = new TopicsPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new forum without adding the description
  await commonPage.clickOnAddNewButton(community.Topics);
  await topicsPage.fillTopicDetails('', '');
  await commonPage.clickOnCreateNewButton();

  //Verify the validation messsage
  expect(await commonPage.getValidationMessage()).toEqual(
    'Topic name cannot be empty string!',
  );
});

test('6: Verify that validation message is appeared when user passes only description', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);
  const topicsPage = new TopicsPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new forum without adding the description
  await commonPage.clickOnAddNewButton(community.Topics);
  await topicsPage.fillTopicDetails('', topicDescription);
  await commonPage.clickOnCreateNewButton();

  //Verify the validation messsage
  expect(await commonPage.getValidationMessage()).toEqual(
    'Topic name cannot be empty string!',
  );
});

test('7: Verify that topic is not created when click on cancel button after entering the valid topic details', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const commonPage = new CommonPage(page);
  const homePage = new HomePage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Click on the community forum
  await homePage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Create a new forum without adding the description
  await commonPage.clickOnAddNewButton(community.Topics);
  await topicsPage.fillTopicDetails(topicName, topicDescription);
  await commonPage.clickOnCancelButton();

  //Verify the validation messsage
  expect(await topicsPage.isAddNewTopicPopupVisible()).toBeFalsy();
});

test('8: Verify that user can edit the created topic and can search the edited topic using search bar', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const commonPage = new CommonPage(page);
  const topicDescriptionEdit = 'TestTopic Description Edit' + Math.random();

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Search the forum name and click on the forum
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.clickOnTheForum(forumName);

  //Edit the forum details and click on the save button
  await commonPage.searchName(topicName.toLowerCase());
  await topicsPage.clickOnEditButton(topicName);
  await topicsPage.fillTopicDetails(editedTopicName, topicDescriptionEdit);
  await commonPage.clickOnSaveButton();

  //Verify the Validation message
  expect(await commonPage.getValidationMessage()).toEqual(
    'Success at updating forum folder!',
  );
  //Verify the edited forum is displayed on the forums page
  await page.waitForTimeout(4000);
  await commonPage.searchName(editedTopicName.toLowerCase());
  expect(
    await commonPage.isCreatedCommunityVisible(editedTopicName),
  ).toBeTruthy();
});

test.afterAll('Delete Forum', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const commonPage = new CommonPage(page);

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await forumsPage.clickOnCommunitySection();

  //Delete all forums
  await commonPage.searchName(forumName.toLowerCase());
  await forumsPage.deleteForum(forumName);
  await browser.close();
});
