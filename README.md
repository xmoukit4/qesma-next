# Qesma-Next: A Collaborative Bill-Splitting App

Qesma-Next is a modern, user-friendly bill-splitting application built with Next.js and Firebase. It provides a seamless experience for users to manage shared expenses with friends and groups.

## ✨ Features

*   **Effortless Authentication**: Multiple sign-in options including email/password, Google, and passwordless magic links.
*   **Group Management**: Create and join groups to organize expenses.
*   **Friend System**: Easily add friends to split bills with.
*   **Expense Tracking**: Add, view, and manage expenses within groups.
*   **Real-time Updates**: Powered by Firebase Firestore for instant data synchronization.

## 🚀 Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn
*   A Firebase project

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/qesma-next.git
    cd qesma-next
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up Firebase:**

    *   Create a `.env.local` file in the root of your project.
    *   Add your Firebase project configuration to the `.env.local` file:

        ```
        NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
        NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
        ```

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 🛠️ Built With

*   [Next.js](https://nextjs.org/) - React framework for server-rendered applications.
*   [Firebase](https://firebase.google.com/) - Backend platform for building web and mobile applications.
*   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapid UI development.
*   [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
*   [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
