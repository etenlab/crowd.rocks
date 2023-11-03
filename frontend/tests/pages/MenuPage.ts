import BasePage from './BasePage';

const headerText = '#crowd-rock-app #app-name-text';
const logoutButton = '#app-logout-button';
const loginButton = "//h4[text()='Login']";
const settingsButton = '//h4[text()="Settings"]';

class MenuPage extends BasePage {
  async isheaderTextPresent() {
    await this.page.locator(headerText).first().waitFor();
    const headerTextPresnt = await this.page
      .locator(headerText)
      .first()
      .isVisible();
    return headerTextPresnt;
  }

  async clickOnLogout() {
    await this.page.locator(logoutButton).first().click();
  }

  async clickOnLoginButton() {
    await this.page.locator(loginButton).first().click();
  }

  async clickOnSettingButton() {
    await this.page.locator(settingsButton).first().click();
  }
}

export default MenuPage;
