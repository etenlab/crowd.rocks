import BasePage from './BasePage';
import { RegisterDto } from '../data-objects/RegisterDto';

const headerText = '#crowd-rock-app #app-name-text';
const emailTextBox = '//ion-input[@inputmode="email"]/input';
const avatarTextBox = '//ion-input[@id="register-avatar"]/input';
const passwordTextBox = '//ion-input[@type="password"]/input';
const registerNowButton = '//ion-button[@id="register-register"]';

class RegistrationPage extends BasePage {
  async fillRegistrationForm(registrationData: RegisterDto) {
    await this.page.locator(emailTextBox).last().fill(registrationData.email);
    await this.page.locator(avatarTextBox).last().fill(registrationData.avatar);
    await this.page
      .locator(passwordTextBox)
      .last()
      .fill(registrationData.password);
  }

  async clickOnRegisterButton() {
    await this.page.locator(registerNowButton).last().click();
  }

  async isHeaderTextPresent() {
    await this.page.locator(headerText).first().waitFor();
    const headerTextPresnt = await this.page
      .locator(headerText)
      .first()
      .isVisible();
    return headerTextPresnt;
  }
}

export default RegistrationPage;
