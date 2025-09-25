
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { addExpenseToGroup } from "@/app/groups/actions";
import { defaultExpenseCategories, Group, ExpenseCategory } from "@/lib/types";

interface AddExpenseFormProps {
  group: Group;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-blue-600 text-white px-4 py-2 rounded-md">
      {pending ? "Adding..." : "Add Expense"}
    </button>
  );
}

export default function AddExpenseForm({ group }: AddExpenseFormProps) {
  const [state, formAction] = useFormState(addExpenseToGroup, { errors: {} });
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | "">("");

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value as ExpenseCategory);
  };

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="groupId" value={group.id} />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-400">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
          required
        />
        {state.errors.description && <p className="text-red-500 text-sm">{state.errors.description}</p>}
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-400">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
          required
        />
        {state.errors.amount && <p className="text-red-500 text-sm">{state.errors.amount}</p>}
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-400">Category</label>
        <select
          id="category"
          name="category"
          className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white"
          value={selectedCategory}
          onChange={handleCategoryChange}
          required
        >
          <option value="" disabled>Select a category</option>
          {Object.entries(defaultExpenseCategories[group.category]).map(([key, value]) => (
            <option key={key} value={key}>{value.icon} {value.name}</option>
          ))}
        </select>
        {state.errors.category && <p className="text-red-500 text-sm">{state.errors.category}</p>}
      </div>
      <SubmitButton />
    </form>
  );
}
