
# Project Blueprint

## Overview

Splitter is a modern, intuitive, and visually appealing web application designed to simplify group expense management. It allows users to create groups, track expenses, and settle debts with ease. The application is built with Next.js and leverages Firebase for backend services, providing a seamless and real-time experience.

## Implemented Features, Styles, and Design

### Core Functionality
- **User Authentication:** Secure user authentication is handled through Firebase Authentication.
- **Group Management:** Users can create and join groups.
- **Expense Tracking:** Users can add expenses with detailed information, including description, amount, currency, and custom splits.
- **Debt Settlement:** The application intelligently calculates balances and simplifies debts to minimize the number of transactions required for settlement.
- **Real-time Updates:** Firebase integration provides real-time data synchronization.
- **Internationalization:** The application supports multiple languages (English and Spanish) with a simple dropdown menu.

### Styling and Design
- **Modern Aesthetics:** A clean and modern design with a visually balanced layout, ample spacing, and a polished user interface.
- **Responsive Design:** The application is fully responsive and works seamlessly on both mobile and web browsers.
- **Color Palette:** A vibrant color palette with gradients and a dark mode theme.
- **Typography:** Expressive and hierarchical typography to enhance readability and user experience.
- **Iconography:** Modern and intuitive icons from Heroicons to guide users and improve navigation.
- **Interactive Elements:** Interactive elements like buttons and forms have a "glow" effect and provide clear visual feedback.
- **Accessibility:** The application is designed with accessibility in mind, ensuring it is usable by a wide range of users.

## Plan for a New Change

### Feature: Friend System

I will implement a friend system that allows users to connect with each other.

**Steps:**

1.  **Data Model:**
    *   Create a `friendRequests` collection in Firestore to manage friend requests (`senderId`, `receiverId`, `status`).
    *   Add a `friends` array field to the `users` collection to store a list of friend UIDs.
2.  **UI Components:**
    *   Create a new `/friends` page (`app/friends/page.tsx`) to serve as the central hub for managing friends.
    *   Implement an `AddFriendForm.tsx` component with an input for the friend's email and a button to send a request.
    *   Create a `FriendRequestsList.tsx` component to display incoming friend requests with "Accept" and "Decline" buttons.
    *   Create a `FriendsList.tsx` component to display the user's current friends with an option to remove them.
3.  **Server Actions (`app/friends/actions.ts`):**
    *   `sendFriendRequest(formData: FormData)`: Finds a user by email and creates a new document in the `friendRequests` collection.
    *   `acceptFriendRequest(requestId: string)`: Updates the friend request status to 'accepted', adds the friend to both users' `friends` list, and deletes the request.
    *   `rejectFriendRequest(requestId: string)`: Updates the friend request status to 'rejected' or deletes it.
    *   `removeFriend(friendId: string)`: Removes the friend from both users' `friends` list.
4.  **Group Invitations:**
    *   Modify the group creation or management interface to allow users to invite friends from their friend list to a group.
