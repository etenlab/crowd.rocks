import BasePage from '../BasePage';

const pageTitle = '//h2[text()="Community"]';
const addNewForumButton = `//h3[contains(text(),'Forums')]//..//button`;
const addNewForumPopupForumName = `input[placeholder='Forum Name']`;
const addNewForumPopupDescription = `textarea[placeholder='Description...']`;
const forumMeatballsMenuButton = (forumName: string) =>
  `//h3[text()='${forumName}']//..//button`;
const threadAndPostCount = (topicsName: string) =>
  `//h3[text()='${topicsName}']//..//..//..//div//h4`;

class ForumPage extends BasePage {
  async isPageTitleVisible() {
    await this.page.locator(pageTitle).waitFor();
    return await this.page.locator(pageTitle).isVisible();
  }
  async getValidationMessage() {
    return await this.page.locator(`.toast-message`).textContent();
  }

  async fillForumDetails(forumName: string, forumDescription: string) {
    await this.fillForumName(forumName);
    await this.fillDescription(forumDescription);
  }

  async fillForumName(forumName: string) {
    await this.page.locator(addNewForumPopupForumName).last().fill(forumName);
  }

  async fillDescription(forumDescription: string) {
    await this.page
      .locator(addNewForumPopupDescription)
      .last()
      .fill(forumDescription);
  }

  async clickOnTheAddNewButton() {
    await this.page.locator(addNewForumButton).click();
  }

  async clickOnCommunitySection() {
    await this.page
      .locator('ion-card-header')
      .filter({ hasText: 'Forums' })
      .click();
  }

  async clickOnAddNewForumPopupCreateNewButton() {
    await this.page.getByRole('button', { name: 'Create New' }).click();
    await this.page.waitForTimeout(500);
  }

  async clickOnAddNewForumPopupCancelButton() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(4000);
  }

  async isAddNewForumPopupVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add new forum' })
      .isVisible();
  }

  async isCreatedForumVisible(forumName: string) {
    return await this.page
      .getByRole('heading', { name: forumName })
      .isVisible();
  }

  async deleteForum(forumName: string) {
    await this.page.locator(forumMeatballsMenuButton(forumName)).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async clickOnEditForumButton(forumName: string) {
    await this.page.locator(forumMeatballsMenuButton(forumName)).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  async isEditedForumVisible(editedForumName: string) {
    return await this.page
      .getByRole('heading', { name: editedForumName })
      .isVisible();
  }

  async clickOnSaveButton() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async searchForumName(forumName: string) {
    await this.page.getByPlaceholder('Search by...').fill(forumName);
    await this.page.waitForTimeout(2000);
  }

  async clickOnTheForum(forumName: string) {
    await this.page
      .getByRole('heading', {
        name: forumName,
      })
      .click();
  }

  async getThreadsCount(forumName: string) {
    const x = await this.page
      .locator(threadAndPostCount(forumName))
      .first()
      .textContent();
    const threadsCount = x?.split(' ') || 0;
    return threadsCount[0];
  }

  async getTopicsCount(forumName: string) {
    const x = await this.page
      .locator(threadAndPostCount(forumName))
      .allTextContents();
    const topicsCount = x[1]?.split(' ') || 0;
    return topicsCount[0];
  }

  async getPostsCount(forumName: string) {
    const x = await this.page
      .locator(threadAndPostCount(forumName))
      .last()
      .textContent();
    const postsCount = x?.split(' ') || 0;
    return postsCount[0];
  }
}
export default ForumPage;
