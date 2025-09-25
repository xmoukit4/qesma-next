'use client';

import { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/lib/firebase/clientApp';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import PasswordStrength from '@/components/auth/password-strength';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from "@/lib/utils";
import Loader from '@/components/ui/loader';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().optional(),
});

export default function AuthenticationPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAuthError = (err: unknown) => {
    if (err instanceof Error) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    }
  }

  const createUserDocument = async (user: User) => {
    if (!user.email) {
      throw new Error("Cannot create user document without an email.");
    }
    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) { // Only create document if it doesn't exist
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        photoURL: user.photoURL,
        createdAt: new Date(),
      });
    }
  };

  const handleAuth = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (isSignUp) {
        if (!values.password) {
          toast({
            title: "Error",
            description: "Password is required for sign up.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
        await createUserDocument(userCredential.user);
      } else {
        if (!values.password) {
          toast({
            title: "Error",
            description: "Password is required for sign in.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        await signInWithEmailAndPassword(auth, values.email, values.password);
      }
      router.push('/dashboard');
    } catch (err: unknown) {
      handleAuthError(err);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await createUserDocument(userCredential.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      handleAuthError(err);
    }
    setIsGoogleLoading(false);
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
            <div className="absolute inset-0 bg-zinc-900" />
            <div className="relative z-20 flex items-center text-lg font-medium">
              <Icons.logo className="mr-2 h-6 w-6" />
              Qesma
            </div>
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;This app has made splitting bills with my friends so much easier. No more awkward conversations about who owes what!&rdquo;
                </p>
                <footer className="text-sm">Jane Doe</footer>
              </blockquote>
            </div>
        </div>
        <div className="lg:p-8">
            <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] relative">
                {(isLoading || isGoogleLoading) && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                        <Loader text={isSignUp ? "Creating account..." : "Signing in..."} />
                    </div>
                )}
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {isSignUp ? "Create an account" : "Sign in to your account"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email below to {isSignUp ? "create your account" : "sign in"}
                    </p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAuth)} className="space-y-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Email</FormLabel>
                          <FormControl>
                            <Input placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input type={showPassword ? 'text' : 'password'} {...field} placeholder="password"/>
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4"/>}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {isSignUp && <PasswordStrength password={field.value} />}
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                      {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                  </form>
                </Form>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                <Button variant="outline" type="button" disabled={isLoading || isGoogleLoading} onClick={handleGoogleSignIn}>
                    {isGoogleLoading ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Icons.google className="mr-2 h-4 w-4" />
                    )}{ " "}
                    Google
                </Button>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    <a
                        className="underline underline-offset-4 hover:text-primary cursor-pointer"
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </a>
                </p>
            </div>
        </div>
    </div>
  );
}
