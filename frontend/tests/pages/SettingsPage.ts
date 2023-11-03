import BasePage from './BasePage';

const settingsPageTitle = '//h2[text()="Settings"]';
const settingsPageList =
  "//li[@class ='MuiListItem-root MuiListItem-gutters css-1nxmd3h-MuiListItem-root']//h4";

const betaToolsToggleButton = '//h4[text()="Beta Tools"]//..//span//input';

class SettingsPage extends BasePage {
  async isSettingPageTitleVisible() {
    await this.page.locator(settingsPageTitle).waitFor();
    return await this.page.locator(settingsPageTitle).isVisible();
  }

  async getTheSettingPageList() {
    const alltext = await this.page.locator(settingsPageList).allTextContents();
    return alltext;
  }

  async clickOnTheBetaToolsToggleButton() {
    await this.page.locator(betaToolsToggleButton).click();
  }
}
export default SettingsPage;
