import BasePage from '../BasePage';

const languageName = (language: string) =>
  `//h5[text()='${language}']//..//input`;
const randomText = "//div[@data-test-id]/div[@data-index='0']//div/div[1]";
const selectedLanguageName = "//button[text()='Edit mode']/..//.//span[text()]";

class PericopeToolPage extends BasePage {
  async isPageTitleVisible() {
    return await this.page.locator(`//h2[text()='Pericope Tool']`).isVisible();
  }
  async clickOnSelectYourLanguageDropdown() {
    await this.page
      .getByRole('heading', { name: 'Select your language' })
      .click();
  }
  async clickOnSelectPericopeLanguageDropdown() {
    await this.page
      .getByRole('heading', { name: 'Select document language' })
      .click();
  }
  async selectLanguage(language: string) {
    await this.page
      .getByRole('textbox', { name: 'Search by language...' })
      .fill(language);
    await this.page.locator(languageName(language)).first().click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }
  async clickOnEditMode() {
    await this.page.locator("//button[text()='Edit mode']").click();
  }
  async clickOnRandomTextForAddPericopeTool() {
    // Locate the divs
    //const divElements = await this.page.locator('div');
    // Convert the elements to an array
    //const divArray = await divElements.all();
    // Generate a random index
    // const randomIndex = Math.floor(Math.random() * divArray.length);
    // Click on the random div
    // await divArray[randomIndex].click();
    await this.page.locator(randomText).click();
  }
  async clickOnAddPericopeTool() {
    await this.page.getByRole('heading', { name: 'Add Pericope' }).click();
  }
  async isPericopeToolAdded() {
    return await this.page.locator(randomText + '/div').getAttribute('class');
  }
  async isPericopeToolVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add Pericope' })
      .isVisible();
  }
  async getSelectedLanguageName() {
    return await this.page.locator(selectedLanguageName).textContent();
  }
}

export default PericopeToolPage;
