'use client';

import { useState } from 'react';
import { createGroup } from '@/app/groups/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { Icons } from '@/components/icons';

function SubmitButton() {
    const { pending } = useFormStatus();
  
    return (
      <Button type="submit" disabled={pending}>
        {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}Create Group
      </Button>
    );
}

export default function CreateGroupForm() {
  return (
    <form action={createGroup}>
        <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Group Name" required />
            </div>
            <div className="flex flex-col space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder="Group Description" required />
            </div>
            <div className="flex flex-col space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <Select name="category">
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="trip">Trip</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="hobby">Hobby</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end gap-2">
                <Link href="/groups">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <SubmitButton />
            </div>
        </div>
    </form>
  );
}
