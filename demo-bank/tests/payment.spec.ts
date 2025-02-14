import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('Payment tests', async () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPwd = loginData.userPwd;

    await page.goto('/');
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPwd);
    await page.getByTestId('login-button').click();
    await page.getByRole('link', { name: 'płatności' }).click();
  });

  test('simple payment', async ({ page }) => {
    //Arrange
    const transferReceiver = 'Jan Nowak';
    const transferAccount = '12 3456 7890 1234 5678 9012 34569';
    const transferAmount = '123';
    const transferTitle = 'Tytuł';
    const expectedMsg = `Przelew wykonany! ${transferAmount},00PLN dla ${transferReceiver}`;

    //Act
    await page.getByTestId('transfer_receiver').fill(transferReceiver);
    await page.getByTestId('form_account_to').fill(transferAccount);
    await page.getByTestId('form_amount').fill(transferAmount);
    await page.getByTestId('form_title').fill(transferTitle);
    await page.getByRole('button', { name: 'wykonaj przelew' }).click();
    await page.getByTestId('close-button').click();

    //Assert
    await expect(page.locator('#show_messages')).toHaveText(expectedMsg);
  });
});
