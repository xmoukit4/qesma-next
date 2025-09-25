'use client';

import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/clientApp';
import { useAuth } from '@/context/AuthContext';
import { Group, Expense, Debt, defaultGroupCategories, defaultExpenseCategories } from '@/lib/types';
import AddExpenseForm from '@/components/AddExpenseForm';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function GroupPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [group, setGroup] = useState<Group | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [userDebt, setUserDebt] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    if (!params.id) return;

    const fetchGroupData = async () => {
      // Fetch group details
      const groupRef = doc(db, 'groups', params.id);
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        const groupData = { id: groupSnap.id, ...groupSnap.data() } as Group;
        setGroup(groupData);
      } else {
        console.error("No such group!");
      }

      // Fetch expenses for the group
      const expensesQuery = query(collection(db, 'expenses'), where('groupId', '==', params.id));
      const expensesSnap = await getDocs(expensesQuery);
      const expensesData = expensesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(expensesData);

      // Fetch debts for the group
      const debtsQuery = query(collection(db, 'debts'), where('groupId', '==', params.id));
      const debtsSnap = await getDocs(debtsQuery);
      const debtsData = debtsSnap.docs.map(doc => doc.data() as Debt);
      setDebts(debtsData);
    };

    fetchGroupData();
  }, [params.id]);

  useEffect(() => {
    // Calculate total expenses
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setTotalExpenses(total);

    // Calculate user's debt
    if (user) {
      const debt = debts.reduce((acc, debt) => {
        if (debt.from === user.uid) {
          return acc + debt.amount;
        }
        if (debt.to === user.uid) {
          return acc - debt.amount;
        }
        return acc;
      }, 0);
      setUserDebt(debt);
    }
  }, [expenses, debts, user]);

  const getCategoryDetails = (groupCategory: keyof typeof defaultExpenseCategories, expenseCategory: string) => {
    const categoryGroup = defaultExpenseCategories[groupCategory];
    if (categoryGroup && categoryGroup[expenseCategory as keyof typeof categoryGroup]) {
        return categoryGroup[expenseCategory as keyof typeof categoryGroup];
    }
    return { name: 'N/A', icon: '🤷' };
  };


  if (!group) {
    return <div className="flex justify-center items-center h-screen"><div className="text-xl">Loading group...</div></div>;
  }

  const groupCategoryDetails = defaultGroupCategories[group.category];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
        <header className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-bold flex items-center">
                {groupCategoryDetails.icon} <span className="ml-3">{group.name}</span>
            </h1>
            <button 
                onClick={() => setShowAddExpense(true)} 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Add Expense
            </button>
        </header>
        
        {showAddExpense && (
            <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
                <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
                    <h2 className="text-2xl font-bold mb-4">Add New Expense</h2>
                    <AddExpenseForm group={group} />
                    <button onClick={() => setShowAddExpense(false)} className="mt-4 text-sm text-gray-400 hover:text-white">Close</button>
                </div>
            </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-gray-800 p-5 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-400">Total Expenses</h2>
                <p className="text-3xl font-bold">${totalExpenses.toFixed(2)}</p>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-400">Your Debt</h2>
                <p className={`text-3xl font-bold ${userDebt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${userDebt.toFixed(2)}
                </p>
            </div>
            <div className="bg-gray-800 p-5 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-400">Members</h2>
                <p className="text-3xl font-bold">{group.members.length}</p>
            </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-5 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Expenses Breakdown</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {expenses.map(expense => {
                        const expenseCategoryDetails = getCategoryDetails(group.category, expense.category as string);
                        return (
                            <div key={expense.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                <div className="flex items-center">
                                    <span className="text-2xl mr-3">{expenseCategoryDetails.icon}</span>
                                    <div>
                                        <p className="font-semibold">{expense.description}</p>
                                        <p className="text-sm text-gray-400">Paid by {expense.paidBy === user?.uid ? 'You' : expense.paidBy}</p>
                                    </div>
                                </div>
                                <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="bg-gray-800 p-5 rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Who Owes Who</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {debts.map((debt, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                            <p><span className="font-semibold">{debt.from === user?.uid ? 'You' : debt.from}</span> owes <span className="font-semibold">{debt.to === user?.uid ? 'You' : debt.to}</span></p>
                            <p className="font-bold text-lg">${debt.amount.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <div className="bg-gray-800 p-5 rounded-lg mt-6">
            <h2 className="text-2xl font-bold mb-4">Expense Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expenses} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <XAxis dataKey="description" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: '#374151', border: 'none' }} labelStyle={{ color: '#F9FAFB' }} />
                    <Legend wrapperStyle={{ color: '#F9FAFB' }} />
                    <Bar dataKey="amount" fill="#3B82F6" name="Expense Amount" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
