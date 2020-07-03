import { browser, by, element } from 'protractor';

/**
 * Application page
 */
export class AppPage {
  /**
   * Navigation based on base URL
   * @example
   * navigateTo()
   */
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }
/**
 * Get the app title name
 * @example
 * getTitleText()
 */
  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }
}
