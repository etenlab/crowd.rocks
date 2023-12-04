import BasePage from '../BasePage';

const addNewDocumentButton = `(//span[text()='Select your language']//..//..//div)[4]//button`;
const selectedLanguage = (languageName: string) =>
  `//h4[text()='${languageName}']`;
const languageName = (language: string) =>
  `//h5[text()='${language}']//..//input`;

class DocumentsPage extends BasePage {
  async isPageTitleVisible() {
    return await this.page.locator(`//h2[text()='Documents']`).isVisible();
  }
  async clickOnSelectYourLanguageDropdown() {
    await this.page
      .getByRole('heading', { name: 'Select your language' })
      .click();
  }
  async clickOnSelectDocumentLanguageDropdown() {
    await this.page
      .getByRole('heading', { name: 'Select document language' })
      .click();
  }
  async isSelectYourLanguagePopupVisible() {
    return await this.page
      .locator(`//h2[text()='Select your language']`)
      .first()
      .isVisible();
  }
  async isAddNewDocumentPopupVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add new document' })
      .isVisible();
  }
  async selectLanguage(language: string) {
    await this.page
      .getByRole('textbox', { name: 'Search by language...' })
      .fill(language);
    await this.page.locator(languageName(language)).first().click();
    await this.page.getByRole('button', { name: 'Confirm' }).click();
  }
  async isLanguageSelected(languageName: string) {
    return await this.page
      .locator(selectedLanguage(languageName))
      .last()
      .isVisible();
  }
  async clickOnAddNewDocumentPopupCrossButton() {
    await this.page.getByRole('button').first().click();
  }
  async clickOnCrossButton() {
    await this.page.click(
      `(//span[text()='Select your language']//..//..//div)[2]//button`,
    );
  }
  async clickOnAddNewDocumentsButton() {
    await this.page.click(addNewDocumentButton);
  }
  async clickOnCancelButton() {
    await this.page.getByRole('button', { name: 'Cancel' }).click();
  }
  async uploadTextFile() {
    const filePath = 'C:/Users/Piyush Patel/Desktop/sample3.txt';
    await this.page.setInputFiles('input[type="file"]', filePath);
  }
}

export default DocumentsPage;
