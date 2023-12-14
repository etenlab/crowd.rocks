import RegisterDto from '../data-objects/RegisterDto';

class RegisterData {
  validRegisterData() {
    const registerData = new RegisterDto();
    registerData.email = 'AutomationUser' + Date.now() + '@mailinator.com';
    registerData.username = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }
  registerDataWithoutEmail() {
    const registerData = new RegisterDto();
    registerData.email = '';
    registerData.username = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }

  registerDataWithoutPassword() {
    const registerData = new RegisterDto();
    registerData.email = 'AutomationUser12333@mailinator.com';
    registerData.username = 'Automation Avatar URL';
    registerData.password = '';
    return registerData;
  }

  registerDataWithoutUserName() {
    const registerData = new RegisterDto();
    registerData.email = 'AutomationUser@mailinator.com';
    registerData.username = '';
    registerData.password = 'automation@123';
    return registerData;
  }

  registerDataWithInvalidEmailFormat() {
    const registerData = new RegisterDto();
    registerData.email = 'Aut';
    registerData.username = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }
}

export default new RegisterData();
