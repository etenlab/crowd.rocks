import BasePage from './BasePage';

const title = '//h2[text()="Select app language"]';

class AppLanguagePage extends BasePage {
  async isAppLanguagePageTitleVisible() {
    await this.page.locator(title).waitFor();
    return await this.page.locator(title).isVisible();
  }
}
export default AppLanguagePage;
