import BasePage from '../BasePage';

const addNewDocumentButton = `(//span[text()='Select your language']//..//..//div)[4]//button`;
const selectedLanguage = (languageName: string) =>
  `//h4[text()='${languageName}']`;
const languageName = (language: string) =>
  `//h5[text()='${language}']//..//input`;
const documents = (documentName: string) => `//p[text()='${documentName}']`;
const meatBallsMenuButton = (documentName: string) =>
  `//p[text()='${documentName}']//..//..//button`;

class DocumentsPage extends BasePage {
  async isPageTitleVisible() {
    return await this.page.locator(`//h2[text()='Documents']`).isVisible();
  }
  async isDocumentDetailsPageVisible() {
    return await this.page
      .getByRole('heading', { name: 'Details' })
      .isVisible();
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
  async uploadTextFile(filePath: string) {
    await this.page.setInputFiles('input[type="file"]', filePath);
  }
  async clickOnUploadButton() {
    await this.page.getByRole('button', { name: 'Upload' }).click();
  }
  async searchDocuments(documentName: string) {
    await this.page
      .getByPlaceholder(`Search by document...`)
      .fill(documentName);
    await this.page.waitForTimeout(1000);
  }
  async clickOnDocument(documentName: string) {
    await this.page.locator(documents(documentName)).click();
  }
  async isCreatedDocumentVisible(documentName: string) {
    return await this.page.locator(documents(documentName)).isVisible();
  }
  async clickOnMeatBallsMenuButton(documentName: string) {
    await this.page.locator(meatBallsMenuButton(documentName)).click();
  }
  async clickOnGoToDocumentsButton() {
    await this.page.getByRole('button', { name: 'Go to Documents' }).click();
  }
  async downloadDocument(documentName: string) {
    await this.clickOnMeatBallsMenuButton(documentName);
    await this.page.getByRole('button', { name: 'Download' }).click();
  }
}

export default DocumentsPage;
