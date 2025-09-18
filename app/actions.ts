'use server'

import { z } from 'zod'
import { sendNotification } from './firebase';
import { firestore } from './lib/firebase-admin';
import { auth } from './lib/auth';
import { revalidatePath } from 'next/cache';

const createGroupSchema = z.object({
  name: z.string().min(1, { message: 'Group name is required' }),
})

export async function createGroup(prevState: { message: string | null; errors: { [key: string]: string[] | undefined }; }, formData: FormData) {
  const validatedFields = createGroupSchema.safeParse({
    name: formData.get('name'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Group.',
    }
  }

  // In a real application, you would save the group to a database.
  console.log('Creating group:', validatedFields.data.name);

  return { message: 'Successfully created group!', errors: {} }
}

const joinGroupSchema = z.object({
  code: z.string().min(6, { message: 'Group code must be 6 characters long' }),
});

export async function joinGroup(prevState: { message: string | null; errors: { [key: string]: string[] | undefined }; }, formData: FormData) {
  const validatedFields = joinGroupSchema.safeParse({
    code: formData.get('code'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid group code.',
    };
  }

  // In a real application, you would find and join the group.
  console.log('Joining group with code:', validatedFields.data.code);

  return { message: 'Successfully joined group!', errors: {} };
}

const addExpenseSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  amount: z.coerce.number().gt(0, { message: 'Amount must be greater than 0' }),
  currency: z.string().min(3, { message: 'Currency is required' }),
  split: z.enum(['equally', 'custom']),
  receipt: z.instanceof(File).optional(),
});

export async function addExpense(prevState: { message: string | null; errors: { [key: string]: string[] | undefined }; }, formData: FormData) {
  const validatedFields = addExpenseSchema.safeParse({
    description: formData.get('description'),
    amount: formData.get('amount'),
    currency: formData.get('currency'),
    split: formData.get('split'),
    receipt: formData.get('receipt'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add Expense.',
    };
  }

  const { description, amount, currency, split, receipt } = validatedFields.data;
  const expenseData: { description: string, amount: number, currency: string, split: string, customSplit?: { [key: string]: number }, receipt?: string } = { description, amount, currency, split };

  if (split === 'custom') {
    const customSplit: { [key: string]: number } = {};
    let totalCustomSplit = 0;
    const groupMembers = ['You', 'John Doe', 'Jane Doe']; // Placeholder

    for (const member of groupMembers) {
      const memberSplit = formData.get(`split-${member}`);
      const splitAmount = parseFloat(memberSplit as string);

      if (isNaN(splitAmount) || splitAmount < 0) {
        return {
          ...prevState,
          errors: { ...prevState.errors, customSplit: [`Invalid amount for ${member}`] },
          message: 'Invalid custom split amounts.',
        };
      }
      customSplit[member] = splitAmount;
      totalCustomSplit += splitAmount;
    }

    if (totalCustomSplit !== amount) {
      return {
        ...prevState,
        errors: { ...prevState.errors, customSplit: ['The sum of custom splits must equal the total amount.'] },
        message: 'The sum of custom splits must equal the total amount.',
      };
    }
    expenseData.customSplit = customSplit;
  }

  if (receipt && receipt.size > 0) {
    console.log('Receipt uploaded:', receipt.name);
    expenseData.receipt = receipt.name;
  }

  // In a real application, you would save the expense to a database.
  console.log('Adding expense:', expenseData);

  // Send a notification
  const userToken = 'BHB5w5twvl53WZWEeB04L8H5NTVdC1SCNEAddq14N3WhLKD0RXNKalQy5YORBsX02uzYhZdj-7YvH_ihOf7pyoQ'; // Replace with the actual device token
  const message = `New expense added: ${description} for ${amount} ${currency}`;
  await sendNotification(userToken, message);

  return { message: 'Successfully added expense!', errors: {} };
}

export async function addExpenseToGroup(groupId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const description = formData.get('description') as string;
  const amount = parseFloat(formData.get('amount') as string);
  // ... other form data processing

  await firestore.collection('expenses').add({
    groupId,
    description,
    amount,
    paidById: session.user.id,
    // ... other expense data
  });

  revalidatePath(`/groups/${groupId}/expenses`);
}

export async function sendReminder(userId: string, message: string) {
  // In a real application, you would look up the user's device token from a database.
  const userToken = 'BHB5w5twvl53WZWEeB04L8H5NTVdC1SCNEAddq14N3WhLKD0RXNKalQy5YORBsX02uzYhZdj-7YvH_ihOf7pyoQ'; // Replace with the actual device token
  await sendNotification(userToken, message);
  return { message: 'Successfully sent reminder!' };
}
