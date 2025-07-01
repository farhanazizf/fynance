# FYnance - Personal Cashflow TrackerA modern, responsive Progressive Web App (PWA) for tracking personal cashflow and expenses, built with React TypeScript.## ✨ Features- 🔐 **Secure Authentication** - Firebase Auth for multi-device access- 💰 **Cashflow Tracking** - Easy income and expense management- 📊 **Smart Reports** - Visual charts and detailed analytics- 🏷️ **Custom Categories** - Create and manage your own categories- 📱 **Mobile-First Design** - Responsive and PWA-ready- ⚡ **Fast & Modern** - Built with Vite and React 18- 🎨 **Beautiful UI** - Ant Design + Tailwind CSS## 🚀 Tech Stack- **Frontend**: React 18 + TypeScript + Vite- **UI Framework**: Ant Design + Tailwind CSS- **Backend**: Firebase Firestore- **Authentication**: Firebase Auth- **Charts**: Chart.js with react-chartjs-2- **PWA**: Vite PWA plugin- **Routing**: React Router## 📱 PWA Features- Installable on mobile and desktop- Offline functionality- Push notifications (coming soon)- Native app-like experience## 🛠️ Setup### Prerequisites- Node.js 18+ - npm or yarn- Firebase project### Installation1. **Clone and install dependencies** `bash   git clone <repository-url>   cd fynance   npm install   `2. **Firebase Setup** - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/) - Enable Firestore Database - Enable Authentication (Email/Password) - Copy your Firebase config3. **Environment Setup** `bash   cp .env.example .env   ` Edit `.env` and add your Firebase configuration: `env   VITE_FIREBASE_API_KEY=your-api-key   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com   VITE_FIREBASE_PROJECT_ID=your-project-id   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789   VITE_FIREBASE_APP_ID=your-app-id   `4. **PWA Icons** (Optional) - Add PWA icons to `public/` directory

- See `PWA_ICONS_README.md` for details

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📱 Mobile Installation

### iOS

1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Android

1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen"

## 🔒 Authentication

For demo purposes, you can create test accounts:

- admin@fynance.com
- user@fynance.com

Make sure to set these up in your Firebase Auth console.

## 🏗️ Project Structure

```
src/
├── components/          # React components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── lib/                # Libraries and utilities
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 📊 Features Overview

### Dashboard

- Quick overview of income, expenses, and net cashflow
- Recent transactions
- Category breakdown charts

### Transaction Management

- Add income and expenses
- Categorize transactions
- Add descriptions and dates

### Categories

- Create custom categories
- Assign colors and icons
- Manage income/expense types

### Reports

- Weekly, monthly, and custom date ranges
- Visual charts and data tables
- Export functionality (coming soon)

## 🔧 Development

### Adding New Features

The app follows clean code principles with:

- TypeScript for type safety
- Functional components with hooks
- Proper error handling
- Mobile-first responsive design
- Component composition

### Code Style

- Use TypeScript best practices
- Follow React hooks patterns
- Keep components small and focused
- Implement proper loading states
- Use Ant Design components primarily
- Use Tailwind for custom styling

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
npx vercel deploy
```

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Firebase Hosting

```bash
npm run build
firebase deploy
```

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For questions or issues, please open an issue in the repository.
