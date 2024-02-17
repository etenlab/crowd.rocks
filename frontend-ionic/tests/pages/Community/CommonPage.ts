import BasePage from '../BasePage';

const addNewButton = (communityName: string) =>
  `//h3[contains(text(),'${communityName}')]//..//button`;

class CommonPage extends BasePage {
  async clickOnCreateNewButton() {
    await this.page.getByRole('button', { name: 'Create New' }).click();
    await this.page.waitForTimeout(500);
  }
  async clickOnCancelButton() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.page.waitForTimeout(4000);
  }

  async clickOnSaveButton() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
  async clickOnAddNewButton(communityName: string) {
    await this.page.locator(addNewButton(communityName)).click();
    await this.page.waitForTimeout(500);
  }
  async searchName(name: string) {
    await this.page.getByPlaceholder('Search by...').last().fill(name);
    await this.page.waitForTimeout(2000);
  }
  async isCreatedCommunityVisible(name: string) {
    return await this.page.getByRole('heading', { name: name }).isVisible();
  }
  async getValidationMessage() {
    return await this.page.locator(`.toast-message`).textContent();
  }
}
export default CommonPage;
