import BasePage from './BasePage';

const headerText = '#crowd-rock-app #app-name-text';
const logoutOption = '#app-logout-button';

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
    await this.page.locator(logoutOption).first().click();
  }
}

export default MenuPage;
