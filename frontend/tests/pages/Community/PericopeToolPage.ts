import BasePage from '../BasePage';

const languageName = (language: string) =>
  `//h5[text()='${language}']//..//input`;
const randomText = "(//div[@data-test-id]/div[@data-index='0']//div/div)[1]";
const selectedLanguageName = "//button[text()='Edit mode']/..//.//span[text()]";
const likeDislikeButton =
  "//div[@role='presentation']//div[3]//div//div//button";
const postButton = `//div[@role='presentation']//div[3]//button`;
const documentName = "//div[@class = 'section']//h4";

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
  async isEditModeButtonDisabled() {
    return await this.page.locator("//button[text()='Edit mode']").isDisabled();
  }
  async clickOnRandomTextForAddPericopeTool() {
    await this.page.locator(randomText).click();
  }
  async clickOnAddPericopeTool() {
    await this.page.getByRole('heading', { name: 'Add Pericope' }).click();
    await this.page.waitForTimeout(1000);
  }
  async clickOnDeletePericopeTool() {
    await this.page.getByRole('heading', { name: 'Delete Pericope' }).click();
    await this.page.waitForTimeout(1000);
  }
  async isPericopeToolAdded() {
    return await this.page.locator(randomText + '/div').isVisible();
  }
  async isPericopeToolVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add Pericope' })
      .isVisible();
  }
  async getSelectedLanguageName() {
    return await this.page.locator(selectedLanguageName).textContent();
  }
  async clickOnLikeButton() {
    await this.page.locator(likeDislikeButton).first().click();
    await this.page.waitForTimeout(1000);
  }
  async getPericopeDotsColor() {
    // Get background color using evaluate method
    const backgroundColor = await this.page
      .locator(randomText + '/div')
      ?.evaluate((element) => {
        return window.getComputedStyle(element).backgroundColor;
      });
    return backgroundColor;
  }
  async clickOnDislikeButton() {
    await this.page.locator(likeDislikeButton).last().click();
    await this.page.waitForTimeout(1000);
  }
  async clickOnPostButton() {
    await this.page.locator(postButton).last().click();
  }
  async getPostCount() {
    return await this.page.locator(postButton).last().textContent();
  }
  async getTheLikeCount() {
    return await this.page.locator(likeDislikeButton).first().textContent();
  }
  async getTheDislikeCount() {
    return await this.page.locator(likeDislikeButton).last().textContent();
  }
  async isDocumentNameIsDisplayed() {
    return await this.page.locator(documentName).first().textContent();
  }
}

export default PericopeToolPage;
