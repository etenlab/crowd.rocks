import BasePage from './BasePage';

const headerText = '//div[@class="clickable brand"]/span[@class="rocks"]';
const expandIcon =
  '//div[@class="header-content"]//ion-icon[contains(@class, "clickable expand-icon")]';

class HomePage extends BasePage {
  async isHeaderTextPresent() {
    await this.page.locator(headerText).last().waitFor();
    const headerTextPresent = await this.page
      .locator(headerText)
      .last()
      .isVisible();
    return headerTextPresent;
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).last().waitFor();
    await this.page.locator(expandIcon).last().click();
  }
}

export default HomePage;
