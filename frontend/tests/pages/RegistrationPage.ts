import BasePage from './BasePage';
import { RegisterDto } from '../data-objects/RegisterDto';

const emailTextBox = '//ion-input[@inputmode="email"]/input';
const userNameTextBox = '//ion-input[@id="register-avatar"]/input';
const passwordTextBox = '//ion-input[@type="password"]/input';
const registerNowButton = '//ion-button[@id="register-register"]';
const registerPageTitle = "//h1[text()= 'Register']";

class RegistrationPage extends BasePage {
  async fillRegistrationForm(registrationData: RegisterDto) {
    await this.page.locator(emailTextBox).last().waitFor();
    await this.page.locator(emailTextBox).last().fill(registrationData.email);
    await this.page
      .locator(userNameTextBox)
      .last()
      .fill(registrationData.username);
    await this.page
      .locator(passwordTextBox)
      .last()
      .fill(registrationData.password);
  }

  async clickOnRegisterButton() {
    await this.page.locator(registerNowButton).last().click();
  }

  async isRegisterPageTitleVisible() {
    return await this.page.locator(registerPageTitle).textContent();
  }
}
export default RegistrationPage;
