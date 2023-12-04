import BasePage from '../BasePage';

const pageTitle = '//h2[text()="Community"]';
const addNewForumPopupForumName = `input[placeholder='Forum Name']`;
const addNewForumPopupDescription = `textarea[placeholder='Description...']`;
const forumMeatballsMenuButton = (forumName: string) =>
  `//h3[text()='${forumName}']//..//button`;

class ForumPage extends BasePage {
  async isPageTitleVisible() {
    await this.page.locator(pageTitle).waitFor();
    return await this.page.locator(pageTitle).isVisible();
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

  async isAddNewForumPopupVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add new forum' })
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

  async clickOnTheForum(forumName: string) {
    await this.page
      .getByRole('heading', {
        name: forumName,
      })
      .click();
  }
}
export default ForumPage;
