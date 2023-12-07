import BasePage from './BasePage';

const homePageTitle =
  '//div[@class="section"]/ion-item-group//ion-label[text() = "Media"]';
const homePageText = `//ion-label[text()]`;
const headerText = '#crowd-rock-app #app-name-text';
const expandIcon = '#app-menu-button';
const languageText = '//ion-label[text() = "Language"]';

class HomePage extends BasePage {
  async isHomePageVisible() {
    await this.page.locator(homePageTitle).waitFor();
    return await this.page.locator(homePageTitle).isVisible();
  }
  async clickOnCrowdRocks() {
    await this.page.locator(headerText).first().click();
  }
  async getHomePageTitle() {
    return await this.page.locator(homePageText).first().textContent();
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).last().click();
  }

  async isLanguageTextVisible(visible = true) {
    if (visible == false) {
      return await this.page.locator(languageText).isHidden();
    }
    await this.page.locator(languageText).waitFor();
    return await this.page.locator(languageText).isVisible();
  }
  async clickOnCommunitySection() {
    await this.page
      .locator('ion-card-header')
      .filter({ hasText: 'Forums' })
      .click();
  }
  async clickOnTheDocumentsSection() {
    await this.page
      .locator('ion-card-header')
      .filter({ hasText: 'Documents' })
      .click();
  }
  async clickOnThePericopeToolSection() {
    await this.page
      .locator('ion-card-header')
      .filter({ hasText: 'Pericope Tool' })
      .click();
  }
}

export default HomePage;
