# Goal Tracker

A simple and elegant goal tracking application built with Next.js.

## Features

- 🔐 **User Authentication** - Sign up and login
- 📝 **Goal Management** - Create, view, update, and delete goals
- ✅ **Track Progress** - Mark goals as complete
- 🎨 **Modern UI** - Beautiful interface with Tailwind CSS

## Pages

1. **Home** (`/`) - Landing page with login and signup links
2. **Sign Up** (`/signup`) - Create a new account
3. **Login** (`/login`) - Sign in to your account
4. **Dashboard** (`/dashboard`) - View and manage your goals

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials

For testing purposes:
- **Email**: test@example.com
- **Password**: password123

## Project Structure

```
goal-tracker/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   │   ├── login/       # Login route
│   │   │   └── signup/      # Sign up route
│   │   └── goals/           # Goals endpoints
│   │       ├── route.ts     # Get all goals, create goal
│   │       └── [id]/        # Update, delete goal
│   ├── dashboard/           # Goal dashboard page
│   ├── login/               # Login page
│   ├── signup/              # Sign up page
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── postcss.config.js
```

## Features Overview

### Sign Up
- Create a new account with email and password
- Validate password confirmation
- Automatic redirect to dashboard after signup

### Login
- Sign in with email and password
- Error handling for invalid credentials
- Automatic redirect to dashboard after login

### Dashboard
- View all your goals
- Add new goals with optional descriptions
- Mark goals as complete/incomplete
- Delete goals
- Logout functionality

## Future Enhancements

- [ ] Connect to MongoDB database
- [ ] Add goal categories/tags
- [ ] Goal priority levels
- [ ] Due dates for goals
- [ ] Goal statistics and analytics
- [ ] Email notifications
- [ ] Dark mode
- [ ] Mobile app with React Native

## License

MIT/