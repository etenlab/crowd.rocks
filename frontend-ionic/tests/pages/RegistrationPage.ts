import BasePage from './BasePage';
import { RegisterDto } from '../data-objects/RegisterDto';

const registerNowButton = '//ion-button[@id="register-register"]';
const registerPageTitle = "//h1[text()= 'Register']";

class RegistrationPage extends BasePage {
  async fillRegistrationForm(registrationData: RegisterDto) {
    await this.page.getByLabel('Email').last().fill(registrationData.email);
    await this.page
      .getByLabel('Username')
      .last()
      .fill(registrationData.username);
    await this.page
      .getByLabel('Password')
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
