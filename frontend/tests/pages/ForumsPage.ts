import BasePage from './BasePage';

const pageTitle = '//h2[text()="Community"]';
const addNewForumButton = `//h3[contains(text(),'Forums')]//..//button`;
const addNewForumPopupForumName = `input[placeholder='Forum Name']`;
const addNewForumPopupDescription = `textarea[placeholder='Description...']`;

class CommunityPage extends BasePage {
  async isPageTitleVisible() {
    await this.page.locator(pageTitle).waitFor();
    return await this.page.locator(pageTitle).isVisible();
  }
  async getValidationMessage() {
    return await this.page.locator(`.toast-message`).textContent();
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
  }

  async clickOnCancelButton() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(4000);
  }

  async isForumCreatedName(forumName: string) {
    return await this.page
      .getByRole('heading', { name: forumName })
      .isVisible();
  }
  async deleteForum(forumName: string) {
    await this.page.locator(`//h3[text()='${forumName}']//..//button`).click();
    await this.page.getByRole('button', { name: 'Delete' }).click();
  }

  async editForum(forumName: string) {
    await this.page.locator(`//h3[text()='${forumName}']//..//button`).click();
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  async clickOnSaveButton() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async searchForumName(forumName: string) {
    await this.page.getByPlaceholder('Search by...').fill(forumName);
    await this.page.waitForTimeout(2000);
  }
}
export default CommunityPage;
