import BasePage from './BasePage';

const headerText = '#crowd-rock-app #app-name-text';
const expandIcon = '#app-menu-button';

class HomePage extends BasePage {
  async isHeaderTextPresent() {
    await this.page.locator(headerText).first().waitFor();
    const headerTextPresent = await this.page
      .locator(headerText)
      .last()
      .isVisible();
    return headerTextPresent;
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).first().waitFor();
    await this.page.locator(expandIcon).first().click();
  }
}

export default HomePage;
