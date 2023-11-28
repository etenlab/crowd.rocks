import BasePage from '../BasePage';

const addNewButton = (communityName: string) =>
  `//h3[contains(text(),'${communityName}')]//..//button`;

class CommonPage extends BasePage {
  async clickOnCreateNewButton() {
    await this.page.getByRole('button', { name: 'Create New' }).click();
    await this.page.waitForTimeout(500);
  }
  async clickOnAddNewButton(communityName: string) {
    await this.page.locator(addNewButton(communityName)).click();
    await this.page.waitForTimeout(500);
  }
}
export default CommonPage;
