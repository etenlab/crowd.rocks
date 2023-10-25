import BasePage from './BasePage';

const headerText = '#crowd-rock-app #app-name-text';
const logoutButton = '#app-logout-button';
const loginButton =
  "//ion-list[@class='md list-md']/ion-item//ion-label[text() = 'Login']";

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
}

export default MenuPage;
