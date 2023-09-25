import LoginDto from '../data-objects/LoginDto';

class LoginData {
  validLoginData() {
    const logindata = LoginDto;
    logindata.email = 'AutomationUser@mailinator.com';
    logindata.password = 'automation@123';
    return logindata;
  }
}

export default new LoginData();
