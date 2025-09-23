
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { sendFriendRequest } from "../actions";
import { auth } from "../../../lib/firebase/clientApp";
import { useState, useEffect } from "react";

function SubmitButton({ isLoadingToken, idToken }) {
  const { pending } = useFormStatus();

  const isDisabled = pending || isLoadingToken || !idToken;
  let buttonText = "Send Request";
  if (pending) {
    buttonText = "Sending...";
  } else if (isLoadingToken) {
    buttonText = "Initializing...";
  }

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setIdToken(token);
        } catch (error) {
          console.error("Error getting ID token:", error);
        } finally {
          setIsLoadingToken(false);
        }
      } else {
        setIsLoadingToken(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <form action={formAction}>
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
