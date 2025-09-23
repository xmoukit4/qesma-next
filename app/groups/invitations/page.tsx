'use client';

import { useEffect, useState, useTransition } from 'react';
import { collection, query, where, onSnapshot, doc, getDoc, DocumentData } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { firestore, auth } from '@/lib/firebase/clientApp';
import { acceptGroupInvitation, declineGroupInvitation } from '@/app/groups/actions';
import { Button } from '@/components/ui/button';

interface Invitation extends DocumentData {
  id: string;
  groupId: string;
  senderId: string;
}

interface EnrichedInvitation extends Invitation {
  groupName: string;
  senderName: string;
}

export default function GroupInvitationsPage() {
  const [user] = useAuthState(auth);
  const [invitations, setInvitations] = useState<EnrichedInvitation[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      const q = query(collection(firestore, 'groupInvitations'), where('receiverId', '==', user.uid));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const enrichedInvitations = await Promise.all(
          snapshot.docs.map(async (invitationDoc) => {
            const invitationData = invitationDoc.data() as Invitation;
            const groupDoc = await getDoc(doc(firestore, 'groups', invitationData.groupId));
            const senderDoc = await getDoc(doc(firestore, 'users', invitationData.senderId));
            return {
              id: invitationDoc.id,
              ...invitationData,
              groupName: groupDoc.data()?.name || 'Unknown Group',
              senderName: senderDoc.data()?.displayName || 'Unknown User',
            };
          })
        );
        setInvitations(enrichedInvitations);
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAccept = (invitationId: string) => {
    startTransition(() => {
      acceptGroupInvitation(invitationId);
    });
  };

  const handleDecline = (invitationId: string) => {
    startTransition(() => {
      declineGroupInvitation(invitationId);
    });
  };

  if (!user) {
    return <div>Please sign in to see your invitations.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Group Invitations</h1>
      {invitations.length === 0 ? (
        <p>You have no pending invitations.</p>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div key={invitation.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p className="font-semibold">{invitation.groupName}</p>
                <p className="text-sm text-gray-500">Invited by {invitation.senderName}</p>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => handleAccept(invitation.id)} disabled={isPending}>
                  {isPending ? 'Accepting...' : 'Accept'}
                </Button>
                <Button variant="destructive" onClick={() => handleDecline(invitation.id)} disabled={isPending}>
                  {isPending ? 'Declining...' : 'Decline'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
