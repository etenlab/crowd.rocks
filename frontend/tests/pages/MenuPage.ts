import BasePage from './BasePage';

const headerText = '#crowd-rock-app #app-name-text';
const leftMenuFeatureButton = (featureName: string) =>
  `//h4[text()="${featureName}"]`;

class MenuPage extends BasePage {
  async isheaderTextPresent() {
    await this.page.locator(headerText).first().waitFor();
    const headerTextPresnt = await this.page
      .locator(headerText)
      .first()
      .isVisible();
    return headerTextPresnt;
  }

  async clickOnLeftMenufeatureButton(featureName: string) {
    await this.page.locator(leftMenuFeatureButton(featureName)).first().click();
  }

  async clickOnCrowdRocks() {
    await this.page.locator(headerText).first().click();
  }
}

export default MenuPage;
