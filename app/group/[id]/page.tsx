'use client';

import { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { AddExpenseForm } from '../../../components/AddExpenseForm';
import { Expense } from '../../../lib/types';
import { calculateBalances, getExchangeRates } from '../../../lib/utils';
import { SettleUp } from '../../../components/SettleUp';
import { useLocale } from '../../../hooks/useLocale';
import { useAuth } from '../../../context/AuthContext';
import { sendReminder } from '../../../app/actions';
import { addMemberToGroup, removeMemberFromGroup } from '../../../app/groups/actions';
import Image from 'next/image';
import { PlusIcon, CurrencyDollarIcon, BellIcon, UserPlusIcon, XCircleIcon, ShieldCheckIcon, TagIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// Placeholder data
const expenses: Expense[] = [
  {
    id: '1',
    description: 'Dinner at a fancy restaurant',
    amount: 120,
    currency: 'USD',
    paidBy: 'You',
    split: 'equally',
    members: ['You', 'John Doe', 'Jane Doe'],
    createdAt: new Date('2024-07-20T19:00:00Z'),
    tags: ['food', 'luxury'],
  },
  {
    id: '2',
    description: 'Groceries for the week',
    amount: 75,
    currency: 'USD',
    paidBy: 'John Doe',
    split: 'equally',
    members: ['You', 'John Doe'],
    createdAt: new Date('2024-07-19T12:00:00Z'),
    tags: ['food', 'home'],
  },
  {
    id: '3',
    description: 'Movie tickets for a blockbuster',
    amount: 30,
    currency: 'EUR',
    paidBy: 'Jane Doe',
    split: 'custom',
    customSplit: { 'You': 10, 'John Doe': 10, 'Jane Doe': 10 },
    members: ['You', 'John Doe', 'Jane Doe'],
    createdAt: new Date('2024-07-18T20:30:00Z'),
    tags: ['entertainment'],
  },
];

const groupMembers = [
    { id: '1', name: 'You', avatar: '', role: 'Admin' },
    { id: '2', name: 'John Doe', avatar: '', role: 'Member' },
    { id: '3', name: 'Jane Doe', avatar: '', role: 'Member' },
  ];

export default function GroupPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number } | null>(null);
  const [balances, setBalances] = useState(new Map<string, number>());
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseCurrency = 'USD';
  const { locale, setLocale, fetchTranslations, t } = useLocale();

  useEffect(() => {
    if (user && groupMembers[0]) {
        groupMembers[0].avatar = user.photoURL || '';
    }
  }, [user]);

  useEffect(() => {
    const fetchRates = async () => {
      const rates = await getExchangeRates(baseCurrency);
      setExchangeRates(rates);
    };
    fetchRates();
    fetchTranslations(locale);
  }, [locale, fetchTranslations]);

  useEffect(() => {
    if (exchangeRates) {
      const newBalances = calculateBalances(expenses, exchangeRates);
      setBalances(newBalances);
    }
  }, [exchangeRates]);

  const getDisplayAmount = (expense: Expense) => {
    if (expense.currency === baseCurrency || !exchangeRates) {
      return `${expense.currency} ${expense.amount.toFixed(2)}`;
    }
    const rate = exchangeRates[expense.currency];
    if (rate) {
      const convertedAmount = expense.amount / rate;
      return `${baseCurrency} ${convertedAmount.toFixed(2)}`
    }
    return `${expense.currency} ${expense.amount.toFixed(2)}`;
  };
  
  const handleReminder = async (member: string, balance: number) => {
    const message = `Reminder: You owe ${baseCurrency} ${Math.abs(balance).toFixed(2)}`;
    await sendReminder(member, message);
    alert(`Reminder sent to ${member}`);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await addMemberToGroup(params.id, newMemberEmail);
      if (!result.success) {
        setError(result.message);
      } else {
        setNewMemberEmail('');
      }
    } catch (_: unknown) {
      setError('An unexpected error occurred.');
    }
    setIsSubmitting(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMemberFromGroup(params.id, memberId);
    } catch (_: unknown) {
      alert('Failed to remove member.');
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">Trip to Bali 🌴</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select onChange={(e) => setLocale(e.target.value)} value={locale} className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full py-2 pl-4 pr-10 text-gray-700 dark:text-gray-300 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <ChevronDownIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
          <Button onClick={() => setIsAddingExpense(true)} className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>{t('addExpense')}</span>
          </Button>
        </div>
      </div>

      {isAddingExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{t('addANewExpense')}</h2>
            <AddExpenseForm onClose={() => setIsAddingExpense(false)} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('expenses')}</h2>
          {expenses.map((expense) => (
            <div key={expense.id} className="bg-white dark:bg-gray-800/60 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/80">
                <div className="flex justify-between items-start w-full">
                    <div className="flex items-center space-x-4">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full">
                        <CurrencyDollarIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-white">{t(expense.description.toLowerCase())}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('paidBy')} {expense.paidBy} &bull; {new Date(expense.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xl text-gray-800 dark:text-white">{getDisplayAmount(expense)}</p>
                        {expense.currency !== baseCurrency && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{expense.currency} {expense.amount.toFixed(2)}</p>
                        )}
                    </div>
                </div>
                {expense.tags && expense.tags.length > 0 && (
                    <div className="mt-4 flex items-center flex-wrap gap-2">
                        <TagIcon className="h-5 w-5 text-gray-400"/>
                        {expense.tags.map(tag => (
                            <span key={tag} className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
          ))}
        </div>

        <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/80">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{t('balances')}</h2>
            <div className="space-y-4">
              {groupMembers.map((member) => {
                const balance = balances.get(member.name) || 0;
                return (
                  <div key={member.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                     <div className="flex items-center space-x-4">
                        <Image
                            src={member.avatar || '/placeholder-avatar.svg'}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
                     </div>
                    <div className="flex items-center space-x-4">
                      <p className={`font-semibold text-lg ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {balance >= 0 ? `+${balance.toFixed(2)}` : `${balance.toFixed(2)}`}
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{baseCurrency}</span>
                      </p>
                      {balance < 0 && (
                        <Button onClick={() => handleReminder(member.name, balance)} className="!p-2 !rounded-full">
                          <BellIcon className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/60 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700/80">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{t('members')}</h2>
            <div className="space-y-4 mb-6">
              {groupMembers.map((member) => (
                <div key={member.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                     <Image
                        src={member.avatar || '/placeholder-avatar.svg'}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{member.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        {member.role === 'Admin' && <ShieldCheckIcon className="h-4 w-4 text-green-500" />}
                        <span>{member.role}</span>
                      </div>
                    </div>
                  </div>
                  {member.name !== 'You' && (
                    <button onClick={() => handleRemoveMember(member.id)} disabled={isSubmitting}>
                      <XCircleIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleAddMember}>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('addMember')}</h3>
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <div className="flex space-x-2">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="member@email.com"
                  className="w-full p-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  required
                />
                <Button type="submit" className="!p-2" disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : <UserPlusIcon className="h-6 w-6" />}
                </Button>
              </div>
            </form>
          </div>

          <SettleUp balances={balances} />
        </div>
      </div>
    </div>
  );
}
