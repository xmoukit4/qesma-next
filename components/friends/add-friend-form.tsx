'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { addFriendByEmail } from '@/app/friends/actions';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase/clientApp';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adding...' : 'Add Friend'}
    </Button>
  );
}

export function AddFriendForm() {
  const [state, formAction] = useFormState(addFriendByEmail, { errors: {}, message: '' });
  const [user] = useAuthState(auth);
  const [idToken, setIdToken] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    async function getToken() {
      if(user) {
        const token = await user.getIdToken();
        setIdToken(token);
      }
    }
    getToken();
  }, [user]);

  useEffect(() => {
    if(state.message){
        toast({
            title: state.message
        })
    }
  }, [state, toast]);

  return (
    <Card>
        <form action={formAction}>
            <input type="hidden" name="idToken" value={idToken} />
            <CardHeader>
                <CardTitle>Add a Friend</CardTitle>
                <CardDescription>Enter your friend's email address to add them.</CardDescription>
            </CardHeader>
            <CardContent>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" name="email" placeholder="friend@example.com" required/>
                    </div>
                {state.errors?.email && <p className="text-sm text-red-500 pt-2">{state.errors.email.join(', ')}</p>}
            </CardContent>
            <CardFooter>
                <SubmitButton />
            </CardFooter>
        </form>
    </Card>
  );
}
