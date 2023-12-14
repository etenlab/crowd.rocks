import { chromium, expect, test } from '@playwright/test';
import ForumsPage from '../../pages/Community/ForumsPage';
import RegistrationPage from '../../pages/RegistrationPage';
import RegisterData from '../../data-factory/RegisterData';
import LoginPage from '../../pages/LoginPage';
import pageUrls from '../../constants/PageUrls';
import { community } from '../../enums/Enums';
import TopicsPage from '../../pages/Community/TopicsPage';
import PostPage from '../../pages/Community/PostPage';
import ThreadsPage from '../../pages/Community/ThreadsPage';
import CommonPage from '../../pages/Community/CommonPage';
import HomePage from '../../pages/HomePage';

const registerData = RegisterData.validRegisterData();
const forumName = 'Automation Forum ' + Math.random();
const forumDescription = 'Automation Forum Description ' + Math.random();
const topicName = 'Automation Topic ' + Math.random();
const topicDescription = 'Automation Topic Description ' + Math.random();
const threadNameOne = 'Automation Thread one ' + Math.random();
const postTextMessage = 'Automation Post Message' + Math.random();
test.use({ storageState: { cookies: [], origins: [] } });

test.beforeAll(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const registerPage = new RegistrationPage(page);
  const forumsPage = new ForumsPage(page);
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

  //Navigate to the forums page
  await homePage.clickOnCommunitySection();

  //Click on the add new button and verify that 'add new forum' popup is appeared
  await commonPage.clickOnAddNewButton(community.Forums);

  //Create a new forum
  await forumsPage.fillForumDetails(forumName, forumDescription);
  await commonPage.clickOnCreateNewButton();

  await browser.close();
});

test('1: End to end linear flow for Community forums', async ({ page }) => {
  const commonPage = new CommonPage(page);
  const forumsPage = new ForumsPage(page);
  const loginPage = new LoginPage(page);
  const topicsPage = new TopicsPage(page);
  const threadsPage = new ThreadsPage(page);
  const postPage = new PostPage(page);
  const homePage = new HomePage(page);

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
  await expect(
    page.getByText('Success at creating new forum folder!'),
  ).toBeVisible();

  //Create a new thread
  await topicsPage.clickOnTheTopic(topicName);
  await commonPage.clickOnAddNewButton(community.Threads);
  await page.waitForTimeout(2000);
  expect(await threadsPage.isAddNewThreadPopupVisible()).toBeTruthy();
  await threadsPage.fillThreadName(threadNameOne);
  await commonPage.clickOnCreateNewButton();
  await expect(page.getByText('Success at creating new thread!')).toBeVisible();

  //Create a new two posts
  await threadsPage.clickOnThreadName(threadNameOne);
  await postPage.createNewPosts(postTextMessage, 2);

  //Get posts count from the post page and verify that on the threads page
  const expectedPostsCount = await postPage.getPostsCount();
  await postPage.clickOnBackArrowButton();
  expect(await threadsPage.getPostsCount(threadNameOne)).toEqual(
    expectedPostsCount.toLocaleString(),
  );

  //Get threads count from the threads page & Verify Threads, Posts count on the topics page
  const expectedThreadsCount = await threadsPage.getThreadsCount();
  await threadsPage.clickOnBackArrowButton(topicName);
  expect(await topicsPage.getThreadsCount(topicName)).toEqual(
    expectedThreadsCount.toLocaleString(),
  );
  expect(await topicsPage.getPostsCount(topicName)).toEqual(
    expectedPostsCount.toLocaleString(),
  );
});

test.afterAll('Delete Forum', async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const forumsPage = new ForumsPage(page);
  const commonPage = new CommonPage(page);
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const forumsList = [forumName];

  //Navigate to the URL
  await page.goto(pageUrls.LoginPage);
  await loginPage.loginToApp(registerData);

  //Navigate to the forums page
  await homePage.clickOnCommunitySection();

  //Delete all forums
  for (const forum of forumsList) {
    await commonPage.searchName(forum.toLowerCase());
    await forumsPage.deleteForum(forum);
  }
  await browser.close();
});
