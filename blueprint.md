
# Blueprint: Next.js Firebase Split-Bill App

## Overview

This document outlines the architecture and features of a split-bill application built with Next.js and Firebase. The app allows users to create groups, add friends, and split expenses. It also includes a dashboard for visualizing data.

## Design and Styling

*   **Framework**: Next.js with TypeScript
*   **Styling**: Tailwind CSS with shadcn/ui components for a modern, consistent look and feel.
*   **UI Components**:
    *   `Button`: Primary user action component.
    *   `Input`: For user data entry.
    *   `Card`: To display grouped information.
    *   `Toast`: For user feedback.
    *   `Form`: For handling user input and validation.
    *   `Dashboard`: A modern, interactive dashboard with charts and recent sales.

## Features

### 1. Authentication

*   **Email & Password**: Users can sign up and sign in using their email and password.
*   **Google Sign-In**: Users can authenticate using their Google accounts.
*   **Magic Link**: Users can sign in without a password via a magic link sent to their email.
*   **Password Strength Indicator**: Provides visual feedback on password strength during sign-up.

### 2. User Profiles

*   User documents are created in Firestore upon registration.
*   Each user has a `displayName`, `email`, and `photoURL`.

### 3. Groups

*   Users can create and join groups.
*   Group information is stored in Firestore.

### 4. Friends

*   Users can add friends by email.
*   Friend relationships are stored in Firestore.

### 5. Expenses

*   Users can add expenses to groups.
*   Expenses are stored in Firestore, with each expense linked to a group.

### 6. Dashboard

*   **Overview**: A visual overview of key metrics.
*   **Recent Sales**: A list of recent sales.
*   **Team Switcher**: Allows users to switch between different teams or accounts.
*   **Date Range Picker**: Allows users to filter data by date.

## Recent Changes

*   **New Dashboard**:
    *   Replaced the old dashboard with a new, modern dashboard.
    *   Added a `cards` component to display the main content of the dashboard.
    *   Added a `team-switcher` component for switching between teams.
    *   Added a `date-range-picker` component for filtering data by date.
    *   Added an `overview` component with a chart.
    *   Added a `recent-sales` component to display recent sales.
*   **Code Quality**:
    *   Resolved all linting errors.
    *   Refactored components to use `shadcn/ui` for a more consistent design.
*   **Authentication Page UI/UX**:
    *   Added a password strength indicator to the sign-up form.
    *   Implemented a "Sign in with Magic Link" option.
    *   Added an eye icon to toggle password visibility.
*   **Toaster Notifications**: Added a global toaster component for displaying user feedback.
*   **Refactored Authentication Handlers**:
    *   Created a reusable `handleAuthError` function to reduce code duplication.
    *   Added loading states to all authentication buttons for better user feedback.
    *   Disabled forms during submission to prevent multiple submissions.
*   **Enhanced Magic Link UX**:
    *   The email field for the magic link is now pre-filled with the email from the main form.
*   **Robust `createUserDocument` Function**:
    *   The `createUserDocument` function now checks if a user document already exists before creating a new one, preventing data overwrites.
*  **Groups Page UI/UX Enhancement**
    *   The main groups page (`app/groups/page.tsx`) has been redesigned using `shadcn/ui` components for a more modern and intuitive user experience.
    *   Group listings are now displayed in a grid of `Card` components, each with a clear title and description.
    *   A prominent "Create Group" button with a `PlusCircle` icon has been added for easy access.
*  **Create New Group Page**
    *   A new page has been created at `app/groups/new/page.tsx` for creating new groups.
    *   The form uses `shadcn/ui` `Input`, `Textarea`, and `Button` components, all wrapped in a `Card` for a clean, organized layout.
    *   A `createGroup` server action has been implemented to handle form submissions and create new groups in Firestore.
*  **Group Details Page**
    *   The group details page (`app/groups/[groupId]/page.tsx`) has been enhanced with `shadcn/ui` components.
    *   A `Tabs` component has been added to switch between viewing group members and inviting new friends.
    *   A `GroupMembers` component has been created to display a list of all members in the group, with their avatars and display names.
    *   The `InviteFriends` component allows users to select from their friends and invite them to the group.
    *   A "Back to Groups" button has been added for easy navigation.

