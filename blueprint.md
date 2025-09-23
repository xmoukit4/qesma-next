
# Friendship Feature Blueprint

## Overview

This blueprint outlines the implementation of a "friendship" feature within a Next.js application, leveraging Firebase for backend services. The feature allows users to send, receive, and manage friend requests, as well as view their list of friends. The implementation prioritizes a secure, server-centric approach using Next.js Server Actions and leverages Firestore for real-time data management.

## Core Features

- **User Authentication:** Users can sign up, log in, and log out of the application.
- **Send Friend Requests:** Authenticated users can send friend requests to other users via email.
- **Receive and Respond to Friend Requests:** Users can view pending friend requests and choose to either accept or reject them.
- **View Friends List:** Users can see a list of their current friends.
- **Remove Friends:** Users can remove a friend from their friends list.

## Technical Stack

- **Framework:** Next.js (with App Router)
- **Backend:** Firebase (Authentication and Firestore)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (for buttons, forms, etc.)

## Data Models (Firestore)

### `users` collection

- **Document ID:** `userId` (from Firebase Authentication)
- **Fields:**
    - `displayName` (string)
    - `email` (string)
    - `friends` (array of `userId`s)

### `friendRequests` collection

- **Document ID:** (auto-generated)
- **Fields:**
    - `senderId` (string, `userId` of the sender)
    - `receiverId` (string, `userId` of the receiver)
    - `status` (string, e.g., "pending")

## Implementation Details

### Server Actions (`app/friends/actions.ts`)

- `sendFriendRequest(formData)`: Finds a user by email, creates a new friend request document in Firestore.
- `acceptFriendRequest(requestId, senderId, receiverId)`: Deletes the friend request document and adds the respective `userId`s to each other's `friends` array in the `users` collection.
- `rejectFriendRequest(requestId)`: Deletes the friend request document.
- `removeFriend(friendId)`: Removes the `friendId` from the current user's `friends` array and vice-versa.

### Client-Side Components

- **`app/friends/page.tsx`**: The main page for the friends feature. It displays the user's friends list, friend requests, and a form to add new friends.
- **`components/add-friend-form.tsx`**: A form that allows users to send a friend request by entering another user's email.
- **`components/friends-list.tsx`**: Displays a list of the user's current friends and provides a button to remove each friend.
- **`components/friend-requests.tsx`**: Displays a list of pending friend requests and provides buttons to accept or reject each request.
- **`components/auth-components.tsx`**: Contains the `AuthButton` component, which shows a "Sign In" or "Sign Out" button depending on the user's authentication state.

### Firebase Integration

- **`lib/firebase/clientApp.ts`**: Initializes the client-side Firebase app instance.
- **`lib/firebase-admin.ts`**: Initializes the server-side Firebase Admin SDK, which is necessary for Server Actions.
- **`.env.local`**: Stores all Firebase configuration and service account credentials.
