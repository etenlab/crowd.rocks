import BasePage from './BasePage';

const headerText = '//div[@class="clickable brand"]/span[@class="rocks"]';
const logoutOption =
  '//div[contains(@class, "header-menu")]//div[contains(@class, "logout")]';

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
