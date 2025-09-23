'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addExpenseToGroup } from '../app/actions';
import Button from './Button';
import { useState, useEffect } from 'react';
import { TagIcon } from '@heroicons/react/24/outline';
import { firestore } from '@/lib/firebase/clientApp';
import { doc, onSnapshot } from 'firebase/firestore';

const initialState = {
    message: null,
    errors: {},
};

interface Member {
    id: string;
    name: string;
    email: string;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" aria-disabled={pending}>
            Add Expense
        </Button>
    );
}

export function AddExpenseForm({ groupId }: { groupId: string }) {
    const addExpenseWithGroupId = addExpenseToGroup.bind(null, groupId);
    const [state, formAction] = useFormState(addExpenseWithGroupId, initialState);
    const [split, setSplit] = useState('equally');
    const [currency, setCurrency] = useState('USD');
    const [groupMembers, setGroupMembers] = useState<Member[]>([]);

    useEffect(() => {
        const groupRef = doc(firestore, 'groups', groupId);
        const unsubscribe = onSnapshot(groupRef, (doc) => {
            if (doc.exists()) {
                const memberIds = doc.data().members;
                // This is a simplified example. In a real app, you'd fetch member details.
                const members: Member[] = memberIds.map((id: string) => ({ id, name: 'Loading...', email: '' }));
                setGroupMembers(members);
            }
        });
        return () => unsubscribe();
    }, [groupId]);


    return (
        <form action={formAction}>
            <div className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                        aria-describedby="description-error"
                    />
                    <div id="description-error" aria-live="polite" aria-atomic="true">
                        {state.errors?.description &&
                            state.errors.description.map((error: string) => (
                                <p className="mt-2 text-sm text-red-500" key={error}>
                                    {error}
                                </p>
                            ))}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="w-2/3">
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                            aria-describedby="amount-error"
                        />
                        <div id="amount-error" aria-live="polite" aria-atomic="true">
                            {state.errors?.amount &&
                                state.errors.amount.map((error: string) => (
                                    <p className="mt-2 text-sm text-red-500" key={error}>
                                        {error}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="w-1/3">
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Currency
                        </label>
                        <select
                            id="currency"
                            name="currency"
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-700 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900 dark:text-white"
                        >
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                            <option>JPY</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="split" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Split
                    </label>
                    <select
                        id="split"
                        name="split"
                        value={split}
                        onChange={(e) => setSplit(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 bg-white dark:bg-gray-700 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-900 dark:text-white"
                    >
                        <option value="equally">Equally</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                {split === 'custom' && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom Split</p>
                        {groupMembers.map((member) => (
                            <div key={member.id} className="flex items-center justify-between">
                                <label htmlFor={`split-${member.id}`} className="text-gray-700 dark:text-gray-300">{member.name}</label>
                                <input
                                    type="number"
                                    id={`split-${member.id}`}
                                    name={`split-${member.id}`}
                                    className="mt-1 block w-1/2 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Tags (comma-separated)
                    </label>
                    <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <TagIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            className="block w-full pl-10 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white"
                            placeholder="food, travel, etc."
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="receipt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Receipt (Optional)
                    </label>
                    <input
                        type="file"
                        id="receipt"
                        name="receipt"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300 dark:hover:file:bg-gray-600"
                    />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
