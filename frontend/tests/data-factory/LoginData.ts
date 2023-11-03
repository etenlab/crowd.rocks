import LoginDto from '../data-objects/LoginDto';

class LoginData {
  validLoginData() {
    const logindata = LoginDto;
    logindata.email = 'AutomationUser@mailinator.com';
    logindata.password = 'automation@123';
    return logindata;
  }

  inValidLoginData() {
    const logindata = LoginDto;
    logindata.email = 'InvalidEmail';
    logindata.password = 'InvalidPassword';
    return logindata;
  }

  inValidEmailData() {
    const logindata = LoginDto;
    logindata.email = 'InvalidEmail';
    logindata.password = 'automation@123';
    return logindata;
  }

  inValidPasswordData() {
    const logindata = LoginDto;
    logindata.email = 'AutomationUser@mailinator.com';
    logindata.password = 'InvalidEmail';
    return logindata;
  }

  withoutEmailData() {
    const logindata = LoginDto;
    logindata.email = '';
    logindata.password = 'automation@123';
    return logindata;
  }

  withoutPasswordData() {
    const logindata = LoginDto;
    logindata.email = 'AutomationUser@mailinator.com';
    logindata.password = '';
    return logindata;
  }

  validEmailForResetPassword() {
    const validEmailForResetPassword = 'AutomationUser@mailinator.com';
    return validEmailForResetPassword;
  }

  invalidEmailForResetPassword() {
    const invalidEmailForResetPassword = 'Aut';
    return invalidEmailForResetPassword;
  }
}
export default new LoginData();
