import BasePage from './BasePage';

const settingsPageTitle = '//h2[text()="Settings"]';
const settingsPageList =
  "//li[@class ='MuiListItem-root MuiListItem-gutters css-1nxmd3h-MuiListItem-root']//h4";

class SettingsPage extends BasePage {
  async isSettingPageTitleVisible() {
    return await this.page.locator(settingsPageTitle).isVisible();
  }

  async getTheSettingPageList() {
    const alltext = await this.page.locator(settingsPageList).allTextContents();
    return alltext;
  }
}
export default SettingsPage;
