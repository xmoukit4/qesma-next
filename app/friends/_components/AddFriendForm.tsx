
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sendFriendRequest } from "../actions";
import { auth } from "../../../lib/firebase/clientApp";
import { useState, useEffect, useRef } from "react";

function SubmitButton({ isLoadingToken, idToken }: { isLoadingToken: boolean; idToken: string }) {
  const { pending } = useFormStatus();

  const isDisabled = pending || isLoadingToken || !idToken;
  let buttonText = "Send Request";
  if (pending) {
    buttonText = "Sending...";
  } else if (isLoadingToken) {
    buttonText = "Initializing...";
  }

  console.log(`SubmitButton render: pending=${pending}, isLoadingToken=${isLoadingToken}, idToken exists=${!!idToken}, isDisabled=${isDisabled}`);


  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {buttonText}
    </button>
  );
}

export default function AddFriendForm() {
  const [state, formAction] = useFormState(sendFriendRequest, { message: "" });
  const [idToken, setIdToken] = useState("");
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    console.log("AddFriendForm: useEffect running.");
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("AddFriendForm: onAuthStateChanged callback fired.");
      if (user) {
        console.log(`AddFriendForm: User found with UID: ${user.uid}. Fetching token...`);
        try {
          const token = await user.getIdToken();
          console.log(`AddFriendForm: Token fetched successfully. Token starts with: ${token.substring(0, 30)}...`);
          setIdToken(token);
        } catch (error) {
          console.error("AddFriendForm: Error getting ID token:", error);
        } finally {
          console.log("AddFriendForm: Setting isLoadingToken to false.");
          setIsLoadingToken(false);
        }
      } else {
        console.log("AddFriendForm: No user is signed in.");
        setIsLoadingToken(false);
      }
    });

    return () => {
      console.log("AddFriendForm: useEffect cleanup. Unsubscribing from onAuthStateChanged.");
      unsubscribe();
    }
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // This is for logging only. We will let the `action` prop handle the actual submission.
    if (formRef.current) {
        const formData = new FormData(formRef.current);
        const token = formData.get('idToken');
        console.log(`AddFriendForm: Form is being submitted. Manually checking FormData for idToken. Token value is: ${token && typeof token === 'string' ? token.substring(0, 30) + '...' : 'MISSING OR EMPTY'}`);
    }
  };
  
  console.log(`AddFriendForm render: isLoadingToken=${isLoadingToken}, idToken exists=${!!idToken}`);

  return (
    <form
        ref={formRef}
        action={formAction}
        onSubmit={handleFormSubmit}
        className="border-4 border-red-500 p-4"
    >
      <h1 className="text-2xl font-bold text-red-500">DEBUGGING</h1>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">
          Friend&apos;s Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="shadow-sm appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-700"
        />
      </div>
      <input type="hidden" name="idToken" value={idToken} />
      <SubmitButton isLoadingToken={isLoadingToken} idToken={idToken} />
      {state?.message && <p className="text-green-500 text-sm mt-4">{state.message}</p>}
      {state?.error && <p className="text-red-500 text-sm mt-4">{state.error}</p>}
    </form>
  );
}
