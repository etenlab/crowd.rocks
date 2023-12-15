// import { chromium, expect, test } from '@playwright/test';
// import RegistrationPage from '../../pages/RegistrationPage';
// import RegisterData from '../../data-factory/RegisterData';
// import LoginPage from '../../pages/LoginPage';
// import pageUrls from '../../constants/PageUrls';
// import ForumsPage from '../../pages/Community/ForumsPage';
// import HomePage from '../../pages/HomePage';
// import CommonPage from '../../pages/Community/CommonPage';
// import { community } from '../../enums/Enums';

// const registerData = RegisterData.validRegisterData();
// const forumName = 'Automation Forum ' + Math.random();
// const forumDescription = 'Automation Forum Description ' + Math.random();
// const editedForumName = 'Automation Edited Forum ' + Math.random();
// const forumNameWithoutDescription =
//   'Automation Forum without Description ' + Math.random();
// test.use({ storageState: { cookies: [], origins: [] } });

// test.beforeAll(async () => {
//   const browser = await chromium.launch({ headless: true });
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const registerPage = new RegistrationPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.RegisterPage);

//   //Verify the title of the page
//   expect(await registerPage.isRegisterPageTitleVisible()).toBeTruthy();

//   //Fill and submit the register form
//   await registerPage.fillRegistrationForm(registerData);
//   await registerPage.clickOnRegisterButton();
//   await page.waitForTimeout(4000);
// });

// test('1: Verify that user redirected on community page and able to create new forums', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Click on community tab and verify that user redirected on community page
//   await homePage.clickOnCommunitySection();
//   expect(await forumsPage.isPageTitleVisible()).toBeTruthy();

//   //Click on the add new button and verify that 'add new forum' popup is appeared
//   await commonPage.clickOnAddNewButton(community.Forums);
//   expect(await forumsPage.isAddNewForumPopupVisible()).toBeTruthy();

//   //Create a new forum
//   await forumsPage.fillForumDetails(forumName, forumDescription);
//   await commonPage.clickOnCreateNewButton();

//   //Verify the validation message
//   expect(await commonPage.getValidationMessage()).toEqual(
//     'Success at creating new forum!',
//   );

//   //Verify the created forum is displayed on the forums page
//   await page.waitForTimeout(4000);
//   expect(await commonPage.isCreatedCommunityVisible(forumName)).toBeTruthy();
// });

// test('2: Verify that user is not allow to create a forum with a Forum Name which is already exist', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Click on community tab and verify that user redirected on community page
//   await homePage.clickOnCommunitySection();
//   expect(await forumsPage.isPageTitleVisible()).toBeTruthy();

//   //Click on the add new button and verify that 'add new forum' popup is appeared
//   await commonPage.clickOnAddNewButton(community.Forums);
//   expect(await forumsPage.isAddNewForumPopupVisible()).toBeTruthy();

//   //Create a new forum
//   await forumsPage.fillForumDetails(forumName, forumDescription);
//   await commonPage.clickOnCreateNewButton();

//   //Verify the validation message
//   expect(await commonPage.getValidationMessage()).toEqual(
//     'Failed at creating new forum! [ForumUpsertFailed]',
//   );
// });

// test('3: Verify that search functionality is working properly', async ({
//   page,
// }) => {
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the URL
//   await homePage.clickOnCommunitySection();

//   //Verify that user can search the forum by using search bar
//   await commonPage.searchName(forumName.toLowerCase());
//   expect(await commonPage.isCreatedCommunityVisible(forumName)).toBeTruthy();
// });

// test('4: Verify that user is able to create forum without adding the description', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the forums page
//   await homePage.clickOnCommunitySection();

//   //Create a new forum without adding the description
//   await commonPage.clickOnAddNewButton(community.Forums);
//   await forumsPage.fillForumDetails(forumNameWithoutDescription, '');
//   await commonPage.clickOnCreateNewButton();

//   //Verify the validation messsage
//   expect(await commonPage.getValidationMessage()).toEqual(
//     'Success at creating new forum!',
//   );
// });

// test('5: Verify that validation message is appeared when user passes blank forum details', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the forums page
//   await homePage.clickOnCommunitySection();

//   //Create a new forum
//   await commonPage.clickOnAddNewButton(community.Forums);
//   await forumsPage.fillForumDetails('', '');
//   await commonPage.clickOnCreateNewButton();

//   //Verify the validation messsage
//   expect(await commonPage.getValidationMessage()).toEqual(
//     'Forum name cannot be empty string!',
//   );
// });

// test('6: Verify that validation message is appeared when user only enters forum description', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the forums page
//   await homePage.clickOnCommunitySection();

//   //Create a new forum
//   await commonPage.clickOnAddNewButton(community.Forums);
//   await forumsPage.fillForumDetails('', 'Test Description');
//   await commonPage.clickOnCreateNewButton();

//   //Verify the validation messsage
//   expect(await commonPage.getValidationMessage()).toEqual(
//     'Forum name cannot be empty string!',
//   );
// });

// test('7: Verify that forum is not created when click on cancel button after entering the valid forum details', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the forums page
//   await homePage.clickOnCommunitySection();

//   //Create a new forum
//   await commonPage.clickOnAddNewButton(community.Forums);
//   await forumsPage.fillForumDetails(forumName, forumDescription);
//   await commonPage.clickOnCreateNewButton();

//   //verify that forum is not created
//   expect(await forumsPage.isAddNewForumPopupVisible()).toBeFalsy();
// });

// test('8: Verify that user can edit the created forum and can search the edited forum using search bar', async ({
//   page,
// }) => {
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);
//   const forumDescriptionEdit = 'TestForum Description Edit' + Math.random();

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the forums page
//   await homePage.clickOnCommunitySection();

//   //Edit the forum details and click on the save button
//   await commonPage.searchName(forumName.toLowerCase());
//   await forumsPage.clickOnEditForumButton(forumName);
//   await forumsPage.fillForumDetails(editedForumName, forumDescriptionEdit);
//   await commonPage.clickOnSaveButton();

//   //Verify the Validation message
//   expect(await commonPage.getValidationMessage()).toEqual(
//     'Success at updating forum!',
//   );
//   //Verify the edited forum is displayed on the forums page
//   await page.waitForTimeout(4000);
//   await commonPage.searchName(editedForumName.toLowerCase());
//   expect(
//     await commonPage.isCreatedCommunityVisible(editedForumName),
//   ).toBeTruthy();
// });

// test.afterAll('Delete Forum', async () => {
//   const browser = await chromium.launch({ headless: true });
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const forumsPage = new ForumsPage(page);
//   const loginPage = new LoginPage(page);
//   const homePage = new HomePage(page);
//   const commonPage = new CommonPage(page);
//   const forumsList = [editedForumName, forumNameWithoutDescription];

//   //Navigate to the URL
//   await page.goto(pageUrls.LoginPage);
//   await loginPage.loginToApp(registerData);

//   //Navigate to the forums page
//   await homePage.clickOnCommunitySection();

//   //Delete all forums
//   for (const forum of forumsList) {
//     await commonPage.searchName(forum.toLowerCase());
//     await forumsPage.deleteForum(forum);
//   }
//   await browser.close();
// });
