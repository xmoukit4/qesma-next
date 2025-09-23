'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '../../lib/firebase/clientApp'; // Assumes firestore is exported from clientApp
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore"; 
import Button from '../../components/Button';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Helper function to create user document in Firestore
  const createUserDocument = async (user: User) => {
    if (!user.email) {
      throw new Error("Cannot create user document without an email.");
    }
    const userRef = doc(firestore, "users", user.uid);
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createUserDocument(userCredential.user);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.')
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await createUserDocument(userCredential.user); // Use setDoc to handle both new and existing users
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.')
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label className="block text-gray-400 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-400 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <Button type="submit" className="w-full !py-3 !text-lg">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 hover:underline">
            {isSignUp ? 'Already have an account? Sign In' : "Don&apos;t have an account? Sign Up"}
          </button>
        </div>
        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>
        <Button onClick={handleGoogleSignIn} className="w-full !py-3 !text-lg bg-red-600 hover:bg-red-700">
            Sign In with Google
        </Button>
      </div>
    </div>
  );
}
