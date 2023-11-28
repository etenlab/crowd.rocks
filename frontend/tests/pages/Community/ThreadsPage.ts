import BasePage from '../BasePage';

const threadNameTextbox = `input[placeholder='Thread Name']`;
const totalThreadsCount = `(//div[@class='MuiBox-root css-0'])[3]//following-sibling::div`;
const postButton = (threadName: string) =>
  `//h3[text()='${threadName}']//..//button`;
const backArrowButton = (topicName: string) =>
  `//h2[text()='${topicName}']//..//button`;

class ThreadsPage extends BasePage {
  async isAddNewThreadPopupVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add new thread' })
      .isVisible();
  }

  async fillThreadName(threadName: string) {
    await this.page.locator(threadNameTextbox).last().fill(threadName);
  }

  async clickOnThreadName(threadName: string) {
    await this.page.locator(postButton(threadName)).first().click();
  }

  async getPostsCount(threadName: string) {
    return await this.page
      .locator(postButton(threadName))
      .first()
      .textContent();
  }

  async getThreadsCount() {
    return await this.page.locator(totalThreadsCount).count();
  }

  async clickOnBackArrowButton(topicName: string) {
    await this.page.locator(backArrowButton(topicName)).click();
  }
}
export default ThreadsPage;
