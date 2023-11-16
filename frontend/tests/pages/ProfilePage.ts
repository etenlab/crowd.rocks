import BasePage from './BasePage';

const pageTitle = `//h1[text()='Profile']`;
const usernameText = `//div[@class='clickable']`;

class ProfilePage extends BasePage {
  async isPageTitlePresent() {
    await this.page.locator(pageTitle).first().waitFor();
    const headerTextPresnt = await this.page
      .locator(pageTitle)
      .first()
      .isVisible();
    return headerTextPresnt;
  }
  async editUsername(username: string) {
    await this.clickOnUsernameText();
    await this.page.getByLabel('Username').last().fill(username);
  }
  async getUsernameText() {
    return await this.page.locator(usernameText).textContent();
  }
  async clickOnUsernameText() {
    return await this.page.locator(usernameText).click();
  }
  async clickOnResetPasswordButton() {
    return await this.page
      .getByRole('button', { name: 'Reset Password' })
      .click();
  }
  async clickOnSubmitButton() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
  async clickOnCancelButton() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
}
export default ProfilePage;
