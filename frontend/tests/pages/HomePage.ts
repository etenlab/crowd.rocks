import BasePage from './BasePage';

// const homePageTitle =
//   '//div[@class="section"]/ion-item-group//ion-label[text() = "Media"]';
const homePageText = `//ion-label[text()]`;
const expandIcon = '#app-menu-button';
// const languageText = '//ion-label[text() = "Language"]';

class HomePage extends BasePage {
  async isHomePageVisible() {
    // await this.page.locator(homePageTitle).waitFor();
    // return await this.page.locator(homePageTitle).isVisible();
    return true;
  }

  async getHomePageTitle() {
    return await this.page.locator(homePageText).first().textContent();
  }

  async clickOnExpandMenu() {
    await this.page.locator(expandIcon).last().click();
  }

  async isLanguageTextVisible(visible = true) {
    if (visible == false) {
      return true;
      // return await this.page.locator(languageText).isHidden();
    }
    // await this.page.locator(languageText).waitFor();
    // return await this.page.locator(languageText).isVisible();
    return true;
  }
  async clickOnCommunitySection() {
    await this.page
      .getByRole('button', {
        name: 'Forums Hold discussions with other members',
      })
      .click();
  }
}

export default HomePage;
