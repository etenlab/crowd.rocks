import { expect } from '@playwright/test';
import BasePage from '../BasePage';

const backArrowButton = `//h2[text()='Discussion']//..//button`;
const totalPostsCount = `//h3[text()='Posts']//..//following-sibling::div`;

class PostPage extends BasePage {
  async isAddNewPostPopupVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add New Post' })
      .isVisible();
  }

  async clickOnTheAddNewPostButton() {
    await this.page
      .locator('div')
      .filter({ hasText: 'Posts' })
      .getByRole('button')
      .last()
      .click();
  }

  async clickOnTextFieldForPostMessage() {
    await this.page
      .getByRole('tablist')
      .locator('ion-segment-button')
      .filter({ hasText: 'Text' })
      .click();
  }

  async fillTheTextFieldForPostMessage(postMessage: string) {
    await this.page.getByRole('paragraph').last().fill(postMessage);
  }

  async clickOnAddNewPostPopupSaveButton() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async clickOnBackArrowButton() {
    await this.page.locator(backArrowButton).click();
  }

  async getPostsCount() {
    return await this.page.locator(totalPostsCount).count();
  }

  async createNewPosts(message: string, count: number) {
    for (let i = 0; i < count; i++) {
      await this.clickOnTheAddNewPostButton();
      await this.clickOnTextFieldForPostMessage();
      await this.fillTheTextFieldForPostMessage(message);
      await this.clickOnAddNewPostPopupSaveButton();
      await expect(
        this.page.getByText('Success at creating new post!'),
      ).toBeVisible();
    }
  }
}
export default PostPage;
