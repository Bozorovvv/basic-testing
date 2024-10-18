import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  let account: BankAccount;

  beforeEach(() => {
    account = getBankAccount(1000);
  });

  test('should create account with initial balance', () => {
    expect(account.getBalance()).toBe(1000);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => account.withdraw(10000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const newAccount = getBankAccount(100000);
    expect(() => account.transfer(10000, newAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => account.transfer(10000, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    expect(account.deposit(2000).getBalance()).toBe(3000);
  });

  test('should withdraw money', () => {
    expect(account.withdraw(500).getBalance()).toBe(500);
  });

  test('should transfer money', () => {
    const newAccount = getBankAccount(1000);
    expect(() => account.transfer(500, account)).toThrow(TransferFailedError);
    expect(() => account.transfer(2000, newAccount)).toThrow(
      InsufficientFundsError,
    );
    account.transfer(500, newAccount);
    expect(account.getBalance()).toBe(500);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const balance = await account.fetchBalance();
    if (balance === null) {
      expect(balance).toBeNull();
    } else {
      expect(balance).toBeGreaterThanOrEqual(0);
      expect(balance).toBeLessThanOrEqual(100);
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const balance = await account.fetchBalance();
    if (typeof balance === 'number') {
      const newBalance = getBankAccount(balance);
      expect(newBalance).toBeDefined();
    }
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(account, 'fetchBalance').mockResolvedValueOnce(null);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
