import RegisterDto from '../data-objects/RegisterDto';

class RegisterData {
  validRegisterData() {
    const registerData = RegisterDto;
    const x = Math.random() * 100;

    registerData.email = 'AutomationUser' + x + '@mailinator.com';
    registerData.avatar = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }

  registerDataWithoutEmail() {
    const registerData = RegisterDto;
    registerData.email = '';
    registerData.avatar = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }

  registerDataWithoutAvatar() {
    const registerData = RegisterDto;
    const x = Math.random() * 100;

    registerData.email = 'AutomationUser' + x + '@mailinator.com';
    registerData.avatar = '';
    registerData.password = 'automation@123';
    return registerData;
  }

  registerDataWithoutPassword() {
    const registerData = RegisterDto;
    const x = Math.random() * 100;

    registerData.email = 'AutomationUser' + x + '@mailinator.com';
    registerData.avatar = 'Automation Avatar URL';
    registerData.password = '';
    return registerData;
  }

  registerDataWithInvalidEmailFormat() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser';
    registerData.avatar = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }

  registerDataWithExistingUser() {
    const registerData = RegisterDto;
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.avatar = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }
}

export default new RegisterData();
