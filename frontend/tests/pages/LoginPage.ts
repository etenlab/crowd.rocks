import BasePage from './BasePage';
import { LoginDto } from '../data-objects/LoginDto';

const emailTextBox =
  '//ion-input[contains(@class,"login")]//input[@inputmode="email"]';
const passwordTextBox =
  '//ion-input[@id="login-password"]//input[@type="password"]';
const loginNowButton = '#login-login';
const goToRegisterButton = '#login-register';
const forgotPasswordButton = "//ion-button[text()='Forgot Password']";
const forgotPasswordPageTitle = "//h1[text()= 'Request a Password Reset']";
const loginPageTitle = "//h1[text()= 'Login']";
const validationMessage =
  "//ion-button[@id='login-register']//following-sibling::div";

//forgot password
const forgotPasswordEmailTextBox = '//input[@inputmode="email"]';
const sendPasswordResetEmail = '//ion-button[@type="submit"]';
const forgotPasswordValidationMessage =
  '//form//ion-item[@counter="true"]//following::div';

class LoginPage extends BasePage {
  async loginToApp(loginData: LoginDto) {
    await this.page.locator(emailTextBox).fill(loginData.email || '');
    await this.page.locator(passwordTextBox).fill(loginData.password || '');
    await this.page.locator(loginNowButton).first().click();
    await this.page.waitForTimeout(3000);
  }

  async goToRegisterPage() {
    await this.page.locator(goToRegisterButton).first().click();
  }

  async clickOnForgotPasswordButton() {
    await this.page.locator(forgotPasswordButton).first().click();
    await this.page.waitForTimeout(1000);
  }

  async clickOnSendResetPasswordEmailButton() {
    await this.page.locator(sendPasswordResetEmail).last().waitFor();
    return await this.page.locator(sendPasswordResetEmail).last().click();
  }

  async getValidationMessage() {
    return await this.page.locator(validationMessage).textContent();
  }

  async isLoginPageTitleVisible() {
    await this.page.locator(loginPageTitle).waitFor();
    return await this.page.locator(loginPageTitle).isVisible();
  }

  async isForgotPasswordTitleVisible() {
    await this.page.locator(forgotPasswordPageTitle).waitFor();
    return await this.page.locator(forgotPasswordPageTitle).isVisible();
  }

  async fillEmailIdForResetPassword(email: string) {
    return await this.page
      .locator(forgotPasswordEmailTextBox)
      .last()
      .fill(email || '');
  }

  async getForgotPasswordValidationMessage() {
    return await this.page
      .locator(forgotPasswordValidationMessage)
      .textContent();
  }
}
export default LoginPage;
