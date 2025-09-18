'use client';

import { simplifyDebts } from '../lib/utils';
import { useLocale } from '../hooks/useLocale';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export function SettleUp({ balances }: { balances: Map<string, number> }) {
  const transactions = simplifyDebts(balances);
  const { t } = useLocale();

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('settleUp')}</h2>
        <p className="text-gray-600">{t('everyoneIsSettledUp')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('settleUp')}</h2>
      <div className="space-y-4">
        {transactions.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-gray-700">{transaction.from}</span>
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              <span className="font-semibold text-gray-700">{transaction.to}</span>
            </div>
            <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              ${transaction.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
