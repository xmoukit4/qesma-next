'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/clientApp';
import AddExpenseForm from '@/components/expenses/add-expense-form';
import ExpenseList from '@/components/expenses/expense-list';
import { Group, Expense } from '@/lib/types';

export default function GroupExpensesPage({ params }: { params: { groupId: string } }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    const fetchGroup = async () => {
      const groupRef = doc(firestore, 'groups', params.groupId);
      const groupSnap = await getDoc(groupRef);
      if (groupSnap.exists()) {
        setGroup({ id: groupSnap.id, ...groupSnap.data() } as Group);
      }
    };

    fetchGroup();

    const q = query(collection(firestore, 'expenses'), where('groupId', '==', params.groupId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newExpenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(newExpenses);
    });

    return () => unsubscribe();
  }, [params.groupId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Group Expenses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {group && <ExpenseList expenses={expenses} group={group} />}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
          {group && <AddExpenseForm group={group} />}
        </div>
      </div>
    </div>
  );
}
