
"use client";

import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
import { sendFriendRequest } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-gray-500"
    >
      {pending ? "Sending..." : "Send Request"}
    </button>
  );
}

export default function AddFriendForm() {
  const [state, formAction] = useFormState(sendFriendRequest, { message: "" });

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
      <SubmitButton />
      {state?.message && <p className="text-green-500 text-sm mt-4">{state.message}</p>}
      {state?.error && <p className="text-red-500 text-sm mt-4">{state.error}</p>}
    </form>
  );
}
