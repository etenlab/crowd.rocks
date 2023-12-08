import RegisterDto from '../data-objects/RegisterDto';

class RegisterData {
  validRegisterData() {
    const registerData = new RegisterDto();
    registerData.email = 'AutomationUser' + Date.now() + '@mailinator.com';
    registerData.username = 'Automation Avatar URL';
    registerData.password = 'automation@123';
    return registerData;
  }
  newUserData() {
    const registerData = new RegisterDto();
    const x = Math.random() * 100;
    registerData.email = 'AutomationUser' + x + '@mailinator.com';
    registerData.username = 'Automation New User';
    registerData.password = 'automation@123';
    return registerData;
  }
  // registerDataWithoutEmail() {
  //   const registerData = RegisterDto;
  //   registerData.email = '';
  //   registerData.username = 'Automation Avatar URL';
  //   registerData.password = 'automation@123';
  //   return registerData;
  // }

  // registerDataWithoutPassword() {
  //   const registerData = RegisterDto;
  //   registerData.email = 'AutomationUser12333@mailinator.com';
  //   registerData.username = 'Automation Avatar URL';
  //   registerData.password = '';
  //   return registerData;
  // }

  // registerDataWithoutUserName() {
  //   const registerData = RegisterDto;
  //   registerData.email = 'AutomationUser@mailinator.com';
  //   registerData.username = '';
  //   registerData.password = 'automation@123';
  //   return registerData;
  // }

  // registerDataWithInvalidEmailFormat() {
  //   const registerData = RegisterDto;
  //   registerData.email = 'Aut';
  //   registerData.username = 'Automation Avatar URL';
  //   registerData.password = 'automation@123';
  //   return registerData;
  // }
}

export default new RegisterData();
