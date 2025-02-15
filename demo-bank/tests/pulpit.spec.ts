import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    //Arrange
    const userId = loginData.userId;
    const userPwd = loginData.userPwd;

    const loginPage = new LoginPage(page);

    //Act
    await page.goto('/');
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPwd);
    await loginPage.loginButton.click();
  });
  test('Successful transfer', async ({ page }) => {
    //Arrange
    const transferTitle = 'Zwrot';
    const transferAmount = '100';
    const receiverId = '2';
    const expectedReceiverName = 'Chuck Demobankowy';

    const pulpitPage = new PulpitPage(page);
    //Act

    await pulpitPage.transferReceiver.selectOption(receiverId);
    await pulpitPage.transferAmount.fill(transferAmount);
    await pulpitPage.transferTitle.fill(transferTitle);
    await pulpitPage.transferButton.click();
    await pulpitPage.closeButton.click();

    //Assert
    await expect(pulpitPage.message).toHaveText(
      `Przelew wykonany! ${expectedReceiverName} - ${transferAmount},00PLN - ${transferTitle}`,
    );
  });

  test('Successful moble topup', async ({ page }) => {
    //Arrange
    const topupAmount = '25';
    const topupReceiver = '502 xxx xxx';
    const expectedTopupMessage = `Doładowanie wykonane! ${topupAmount},00PLN na numer ${topupReceiver}`;

    const pulpitPage = new PulpitPage(page);
    const initalBalance = await pulpitPage.moneyValue.innerText();
    const expectedBalance = Number(initalBalance) - Number(topupAmount);
    //Act

    await pulpitPage.topupReceiver.selectOption(topupReceiver);
    await pulpitPage.topupAmount.fill(topupAmount);
    await pulpitPage.topupAgreement.click();
    await pulpitPage.topupButton.click();
    await pulpitPage.closeButton.click();

    //Assert
    await expect(pulpitPage.message).toHaveText(expectedTopupMessage);
    await expect(pulpitPage.moneyValue).toHaveText(`${expectedBalance}`);
  });
});
