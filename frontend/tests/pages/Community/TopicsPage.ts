import BasePage from '../BasePage';

const addNewForumPopupForumName = `input[placeholder='Forum Name']`;
const addNewForumPopupDescription = `textarea[placeholder='Description...']`;
const totalTopicsCount = `(//div[@class='MuiBox-root css-0'])[2]//following-sibling::div`;
const threadAndPostCount = (topicsName: string) =>
  `//h3[text()='${topicsName}']//..//..//..//div//h4`;
const backArrowButton = (forumName: string) =>
  `//h2[text()='${forumName}']//..//button`;

class TopicsPage extends BasePage {
  async isAddNewTopicPopupVisible() {
    return await this.page
      .getByRole('heading', { name: 'Add new topic' })
      .isVisible();
  }

  async fillTopicDetails(forumName: string, forumDescription: string) {
    await this.fillTopicName(forumName);
    await this.fillTopicDescription(forumDescription);
  }

  async fillTopicName(forumName: string) {
    await this.page.locator(addNewForumPopupForumName).last().fill(forumName);
  }

  async fillTopicDescription(forumDescription: string) {
    await this.page
      .locator(addNewForumPopupDescription)
      .last()
      .fill(forumDescription);
  }

  async clickOnTheTopic(forumName: string) {
    await this.page
      .locator('div')
      .filter({ hasText: forumName })
      .last()
      .click();
  }

  async getThreadsCount(topicsName: string) {
    const x = await this.page
      .locator(threadAndPostCount(topicsName))
      .first()
      .textContent();
    const threadsCount = x?.split(' ') || 0;
    return threadsCount[0];
  }

  async getPostsCount(topicsName: string) {
    const x = await this.page
      .locator(threadAndPostCount(topicsName))
      .last()
      .textContent();
    const postsCount = x?.split(' ') || 0;
    return postsCount[0];
  }

  async getTopicsCount() {
    return await this.page.locator(totalTopicsCount).count();
  }

  async clickOnBackArrowButton(forumName: string) {
    await this.page.locator(backArrowButton(forumName)).click();
  }
}
export default TopicsPage;
