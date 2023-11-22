import { expect, test } from '@playwright/test';
import ForumsPage from '../pages/ForumsPage';
const forumName = 'TestForum' + Math.random();
const forumDescription = 'TestForum Description' + Math.random();

test('1: Verify that user redirected on community page and able to create new forums', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);

  //Navigate to the URL
  await page.goto('/US/en/1/home');

  //Click on community tab and verify that user redirected on community page
  await forumsPage.clickOnCommunitySection();
  expect(await forumsPage.isPageTitleVisible()).toBeTruthy();

  //Create a new forum
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumName(forumName);
  await forumsPage.fillDescription(forumDescription);
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation message
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Success at creating new forum!',
  );
  await page.waitForTimeout(4000);

  //verify that created forum is displayed
  await forumsPage.searchForumName(forumName.toLowerCase());
  expect(await forumsPage.isForumCreatedName(forumName)).toBeTruthy();
});

test('2: Verify that validation message is appeared when user passes blank forum details', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);

  //Navigate to the forums page
  await page.goto('/US/en/1/forums');

  //Try to create new forum without entering the forum name and description
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumName('');
  await forumsPage.fillDescription('');
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation messsage
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Forum name cannot be empty string!',
  );
});

test('3: Verify that validation message is appeared when user only enters forum description', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const forumDescription = 'TestForum Description' + Math.random();

  //Navigate to the forums page
  await page.goto('/US/en/1/forums');

  //Try to create new forum without entering the forum name
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumName('');
  await forumsPage.fillDescription(forumDescription);
  await forumsPage.clickOnAddNewForumPopupCreateNewButton();

  //Verify the validation messsage
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Forum name cannot be empty string!',
  );
});

test('4: Verify that forum is not created when click on cancel button after entering the valid forum details', async ({
  page,
}) => {
  const forumsPage = new ForumsPage(page);
  const forumName = 'TestForum' + Math.random();
  const forumDescription = 'TestForum Description' + Math.random();

  //Navigate to the forums page
  await page.goto('/US/en/1/forums');

  //Enter the forum details and click on cancel button
  await forumsPage.clickOnTheAddNewButton();
  await forumsPage.fillForumName(forumName);
  await forumsPage.fillDescription(forumDescription);
  await forumsPage.clickOnCancelButton();

  //verify that forum is not created
  expect(await forumsPage.isForumCreatedName(forumName)).toBeFalsy();
});

test('5: Verify that user can edit the created forum and edited forum is displayed on the forum page', async ({ page }) => {
  const forumsPage = new ForumsPage(page);
  const forumNameEdit = 'TestForumEdit' + Math.random();
  const forumDescriptionEdit = 'TestForum Description Edit' + Math.random();

  //Navigate to the forums page
  await page.goto('/US/en/1/forums');

  //Edit the forum details and click on the save button
  await forumsPage.editForum(forumName);
  await forumsPage.fillForumName(forumNameEdit);
  await forumsPage.fillDescription(forumDescriptionEdit);
  await forumsPage.clickOnSaveButton();

  //Verify the Validation message
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Success at updating forum!',
  );
  await page.waitForTimeout(4000);

  //Verify that updated forum is displayed correctly
  expect(await forumsPage.isForumCreatedName(forumNameEdit)).toBeTruthy();

  //Delete forum
  await forumsPage.deleteForum(forumNameEdit);

  //Verify the Validation message
  expect(await forumsPage.getValidationMessage()).toEqual(
    'Success at deleting forum!',
  );
  await page.reload();

  //Verify that deleted forum is not displayed on the page
  expect(await forumsPage.isForumCreatedName(forumNameEdit)).toBeFalsy();
});
