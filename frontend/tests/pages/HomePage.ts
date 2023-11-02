import BasePage from './BasePage';

const homePageTitle =
  '//div[@class="section"]/ion-item-group//ion-label[text() = "Media"]';
const expandIcon = '#app-menu-button';

class HomePage extends BasePage {
  async isHomePageVisible() {
    await this.page.locator(homePageTitle).waitFor();
    return await this.page.locator(homePageTitle).isVisible();
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).last().click();
  }
}

export default HomePage;
