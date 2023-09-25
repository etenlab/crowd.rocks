import { Page } from '@playwright/test';

class BasePage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }
}
export default BasePage;
