import { Expense } from './types';

export const calculateBalances = (expenses: Expense[], exchangeRates: { [key: string]: number } | null) => {
  const balances = new Map<string, number>();
  const baseCurrency = 'USD';

  expenses.forEach((expense) => {
    let { amount, customSplit } = { ...expense };
    const { currency, paidBy, split, members } = expense;

    if (currency !== baseCurrency && exchangeRates) {
      const rate = exchangeRates[currency];
      if (rate) {
        amount = amount / rate; // Convert to base currency
        if (split === 'custom' && customSplit) {
          const convertedCustomSplit: { [key: string]: number } = {};
          for (const member in customSplit) {
            convertedCustomSplit[member] = customSplit[member] / rate;
          }
          customSplit = convertedCustomSplit;
        }
      }
    }

    if (!balances.has(paidBy)) {
      balances.set(paidBy, 0);
    }
    balances.set(paidBy, balances.get(paidBy)! + amount);

    if (split === 'equally') {
      const share = amount / members.length;
      members.forEach((member) => {
        if (!balances.has(member)) {
          balances.set(member, 0);
        }
        balances.set(member, balances.get(member)! - share);
      });
    } else if (split === 'custom' && customSplit) {
      for (const member in customSplit) {
        if (!balances.has(member)) {
          balances.set(member, 0);
        }
        balances.set(member, balances.get(member)! - customSplit[member]);
      }
    }
  });

  return balances;
};

export const simplifyDebts = (balances: Map<string, number>) => {
  const debtors = Array.from(balances.entries())
    .filter(([, balance]) => balance < 0)
    .map(([name, balance]) => ({ name, balance }))
    .sort((a, b) => a.balance - b.balance);

  const creditors = Array.from(balances.entries())
    .filter(([, balance]) => balance > 0)
    .map(([name, balance]) => ({ name, balance }))
    .sort((a, b) => b.balance - a.balance);

  const transactions = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(-debtor.balance, creditor.balance);

    transactions.push({ from: debtor.name, to: creditor.name, amount });

    debtor.balance += amount;
    creditor.balance -= amount;

    if (Math.abs(debtor.balance) < 0.01) {
      i++;
    }

    if (Math.abs(creditor.balance) < 0.01) {
      j++;
    }
  }

  return transactions;
};

export const getExchangeRates = async (baseCurrency: string) => {
  const API_URL = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    const data = await response.json();
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};
