import BasePage from './BasePage';

const appLanguagePopUpTitle = '//h2[text()="Select app language"]';
const languageNamesList = '//div[@data-test-id="virtuoso-item-list"]//h5';
const searchBar = `//input[@type='text']`;
const languageName = (language: string) =>
  `//h5[text()='${language}']//..//input`;
const confirmButton = '//button[text()="Confirm"]';
const cancelButton = `//button[text()="Cancel"]`;
const checkedAppLanguage = (language: string) =>
  `//h5[text()='${language}']//..//span`;

class AppLanguagePage extends BasePage {
  async isAppLanguagePopUpTitleVisible() {
    await this.page.locator(appLanguagePopUpTitle).waitFor();
    return await this.page.locator(appLanguagePopUpTitle).isVisible();
  }

  async getAllAppLanguagesList() {
    return await this.page.locator(languageNamesList).allTextContents();
  }

  async clickOnAppLanguageName(name: string) {
    await this.page.locator(languageName(name)).first().waitFor();
    await this.page.locator(languageName(name)).first().click();
  }

  async clickOnConfirmButton() {
    await this.page.locator(confirmButton).waitFor();
    await this.page.locator(confirmButton).click();
  }
  async clickOnCancelButton() {
    await this.page.locator(cancelButton).waitFor();
    await this.page.locator(cancelButton).click();
  }

  async isAppLanguageChecked(_languageName: string) {
    await this.page.locator(checkedAppLanguage(_languageName)).last().waitFor();
    return await this.page
      .locator(checkedAppLanguage(_languageName))
      .last()
      .getAttribute('color');
  }

  async searchLanguage(language: string) {
    await this.page.locator(searchBar).clear();
    await this.page.locator(searchBar).fill(language);
    await this.page.waitForTimeout(1000);
  }
}
export default AppLanguagePage;
