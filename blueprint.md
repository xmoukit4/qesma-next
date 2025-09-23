# Splitter Application Blueprint

## Overview

Splitter is a web application designed to help users manage and split expenses with friends and in groups. It provides a clear and intuitive interface for tracking shared costs, sending reminders, and settling debts. The application is built on the Next.js framework, leveraging Firebase for backend services including authentication and database management.

## Project Outline

### Core Technologies

*   **Framework:** Next.js with App Router
*   **Backend:** Firebase (Authentication, Firestore)
*   **Styling:** Tailwind CSS

### Design and Styling

*   **Theme:** Modern, dark theme with a gradient text for headers.
*   **Layout:** Responsive, mobile-first design.
*   **Components:** Reusable components for buttons, forms, and lists.
*   **Color Palette:**
    *   Background: `gray-900`
    *   Primary Elements: `gray-800`
    *   Accent: Gradient from `blue-400` to `purple-500`
    *   Text: `white`, `gray-400`
    *   Buttons: `blue-600` (primary), `red-600` (Google sign-in)

### Features

#### 1. User Authentication

*   **Sign-up/Sign-in:** Users can create an account or sign in using email/password or Google.
*   **Session Management:** Firebase Authentication handles user sessions.
*   **Firestore User Sync:** Upon registration or first sign-in, a corresponding user document is created in the `users` collection in Firestore. This document stores the user's email, display name, photo URL, and creation date.

#### 2. Friend Management

*   **Add Friend:** Users can send friend requests to other users via email.
    *   **Secure:** The process is secured by verifying the sender's identity using a Firebase ID token.
    *   **Error Handling:** The UI provides feedback if the user is not found, if the request is sent to oneself, or if the authentication token is missing or invalid.
*   **Friend Requests:** Users can view pending friend requests and accept or reject them.
*   **Friends List:** Users can see a list of their current friends.
*   **Remove Friend:** Users can remove friends from their list.

#### 3. Group and Expense Management (Conceptual)

*   **Create Groups:** Users can create groups and add friends to them.
*   **Add Expenses:** Users can add expenses to a group, specifying the description, amount, currency, and how the cost should be split (e.g., equally, custom).
*   **Expense Tracking:** The application tracks who owes whom within each group.
*   **Reminders:** Users can send reminders to others to settle their debts.

## Current Implementation Plan & Steps

The following steps have been implemented to fix the "friend request" feature and improve the application's overall robustness:

1.  **Diagnosed Firestore `NOT_FOUND` Error:** Identified that friend requests were failing because user documents were not being created in Firestore upon sign-up.
2.  **Implemented Firestore User Sync:**
    *   Modified `app/auth/page.tsx` to include logic that creates a user document in the `users` collection after a successful `createUserWithEmailAndPassword` or `signInWithPopup` event.
    *   Added a helper function `createUserDocument` to encapsulate this logic.
3.  **Addressed "Invalid document reference" Error:**
    *   Improved the `createUserDocument` function in `app/auth/page.tsx` by adding a guard clause to ensure the `user.uid` is present before attempting to create a Firestore document reference, preventing a crash if the user object is malformed.
4.  **Fixed Empty `senderId` in Friend Requests:**
    *   Identified that the `senderId` was not being correctly passed in the `sendFriendRequest` server action.
    *   Modified `app/friends/_components/AddFriendForm.tsx` to securely capture the current user's ID token via `auth.onAuthStateChanged` and include it as a hidden field in the form.
    *   Updated the `sendFriendRequest` action in `app/friends/actions.ts` to verify the received ID token using the Firebase Admin SDK and use the decoded UID as the official `senderId`.
5.  **Resolved "Authentication token is missing" Race Condition:**
    *   Fixed a bug where the friend request form could be submitted before the ID token was fetched.
    *   Updated `app/friends/_components/AddFriendForm.tsx` to disable the submit button until the `idToken` is available, providing clear visual feedback to the user.
6.  **Resolved Firestore `permission-denied` Errors:**
    *   Diagnosed that client-side requests were failing due to restrictive default security rules.
    *   Created `firestore.rules` to define access control for `users` and `friendRequests` collections.
    *   Created `firebase.json` to configure the Firebase CLI for deployment.
    *   Authenticated with Firebase and set the active project to `qesma-891b6`.
    *   Deployed the new security rules, resolving the permission errors.
