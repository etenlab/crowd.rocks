import BasePage from './BasePage';

const settingsPageTitle = '//h2[text()="Settings"]';
const settingFeaturesList =
  "//li[@class ='MuiListItem-root MuiListItem-gutters css-1nxmd3h-MuiListItem-root']//h4";
const lightModeUI = `//html[contains(@class,'light')]`;
const darkModeUI = `//html[contains(@class,'dark')]`;
const toggleButton = (featureName: string) =>
  `//h4[text()='${featureName}']//..//span//input`;
const onToggleButton = (featureName: string) =>
  `//h4[text()='${featureName}']//..//span/span[contains(@class,'checked')]`;

class SettingsPage extends BasePage {
  async isSettingPageTitleVisible() {
    await this.page.locator(settingsPageTitle).waitFor();
    return await this.page.locator(settingsPageTitle).isVisible();
  }

  async getAllSettingFeaturesList() {
    return await this.page.locator(settingFeaturesList).allTextContents();
  }

  async clickOnToggleButton(featureName: string, _toggleOn: boolean) {
    if (_toggleOn == true) {
      if ((await this.isToggleButtonOn(featureName)) == false) {
        await this.page.locator(toggleButton(featureName)).click();
      }
    } else if (_toggleOn == false) {
      if (await this.isToggleButtonOn(featureName)) {
        await this.page.locator(toggleButton(featureName)).click();
      }
    }
  }

  async isToggleButtonOn(featureName: string) {
    return await this.page.locator(onToggleButton(featureName)).isVisible();
  }

  async isDarkModeEnabled() {
    return await this.page.locator(darkModeUI).isVisible();
  }

  async isLightModeEnabled() {
    return await this.page.locator(lightModeUI).isVisible();
  }
}
export default SettingsPage;
