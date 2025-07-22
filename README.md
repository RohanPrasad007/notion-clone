# Notion Clone

A full-featured Notion clone built with Next.js 15, React 19, Firebase, Firestore, and a modern UI. This project demonstrates real-time document editing, Google authentication, drag-and-drop, and more—perfect for showcasing your skills to interviewers or on GitHub.

## Demo

[Live Website]()

## Features

- ⚡ **Next.js 15 App Router** with TypeScript
- 🔥 **Firebase Auth** (Google Sign-In only)
- 📝 **Firestore** for real-time document storage and updates
- 🧑‍💻 **User authentication context** for global auth state
- 🗂️ **Document CRUD** (create, read, update, archive, restore, delete)
- 🗃️ **Nested documents** (parent/child structure)
- ♻️ **Recursive archive/restore** for documents and their children
- 🗑️ **Trash/Archive** view and restore
- 🔍 **Real-time search** for documents
- 🖼️ **Cover image upload** (with drag-and-drop)
- 🧩 **Rich text editor** (BlockNote)
- 🌗 **Dark/light mode** (Next Themes)
- 🧩 **Radix UI** components for dialogs, dropdowns, popovers, etc.
- 🪄 **Beautiful, responsive UI** with Tailwind CSS
- 🛠️ **Custom hooks** for scroll, search, settings, and more
- 🧑‍🎨 **User avatar and profile menu**
- 🏷️ **Command palette** (CMD+K style search)
- 🧹 **Type-safe codebase** with TypeScript
- 🧪 **Zustand** for state management
- 🧰 **Sonner** for toast notifications

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RohanPrasad007/notion-clone.git
cd notion-clone
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Firebase

Create a .env.local file in the root directory and add your Firebase config:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> You can get these values from your Firebase project settings.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Firebase & Firestore](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [BlockNote](https://blocknotejs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Sonner](https://sonner.emilkowal.ski/)
- [TypeScript](https://www.typescriptlang.org/)

---

Feel free to update the "Live Website" link and add screenshots or badges as you wish! Let me know if you want a section for contributing, license, or anything else.
