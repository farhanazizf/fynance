# FYnance - Personal Cashflow Tracker

A modern, mobile-first Progressive Web App (PWA) for tracking personal finances and cashflow. Built with React, TypeScript, and Firebase, FYnance helps you manage your expenses, categorize transactions, and gain insights into your spending patterns.

![FYnance Demo](https://img.shields.io/badge/PWA-Ready-green) ![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue) ![Firebase](https://img.shields.io/badge/Firebase-Integrated-orange)

## ✨ Features

### � Core Functionality

- **Transaction Management**: Add, edit, and delete income/expense transactions
- **Custom Categories**: Create and manage your own spending categories
- **Multi-User Support**: Family sharing with Firebase authentication
- **Real-time Sync**: All data synced across devices in real-time
- **Offline Support**: PWA capabilities for offline usage

### 📊 Analytics & Reports

- **Spending Analysis**: Visual charts showing spending patterns
- **Category Breakdown**: Detailed insights by spending category
- **Time-based Reports**: Weekly, monthly, and custom date range analysis
- **Budget Tracking**: Monitor your spending against income

### 🎨 User Experience

- **Mobile-First Design**: Optimized for mobile devices with responsive layout
- **Modern UI**: Clean interface using Ant Design components
- **Performance Optimized**: Code splitting and lazy loading for fast page loads
- **Loading States**: Smooth skeleton loaders and progress indicators

## 🚀 Tech Stack

### Frontend

- **React 19** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Ant Design** - Professional UI component library
- **Tailwind CSS** - Utility-first CSS framework

### Backend & Database

- **Firebase Firestore** - NoSQL real-time database
- **Firebase Authentication** - Secure user authentication
- **Firebase Hosting** - Static site hosting

### Charts & Visualization

- **Chart.js** - Beautiful, responsive charts
- **react-chartjs-2** - React wrapper for Chart.js

### PWA Features

- **Vite PWA Plugin** - Service worker and PWA manifest
- **Workbox** - Advanced caching strategies

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Firebase account (for production)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fynance
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Development with demo data** (no Firebase required)

   ```bash
   npm run dev
   ```

   Use demo credentials:

   - Email: `demo@fynance.com`
   - Password: `demo123`

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Firebase Setup (Production)

1. **Create Firebase Project**

   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project
   - Enable Authentication and Firestore

2. **Configure Firebase**

   - Copy your Firebase config
   - Update `src/lib/firebase.ts` with your credentials

3. **Set up Firestore Security Rules**

   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /families/{familyId} {
         allow read, write: if request.auth != null && request.auth.uid in resource.data.memberIds;
       }
       match /families/{familyId}/transactions/{document} {
         allow read, write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.memberIds;
       }
       match /families/{familyId}/categories/{document} {
         allow read, write: if request.auth != null && request.auth.uid in get(/databases/$(database)/documents/families/$(familyId)).data.memberIds;
       }
     }
   }
   ```

4. **Build and deploy**
   ```bash
   npm run build
   npx firebase init hosting
   npx firebase deploy
   ```

## 📱 Usage Guide

### Getting Started

1. **Sign up/Login** - Create an account or log in with existing credentials
2. **Family Setup** - Set up your family name (for sharing with multiple users)
3. **Add Categories** - Create custom spending categories or use defaults
4. **Start Tracking** - Begin adding your income and expense transactions

### Navigation

- **Home (Dashboard)** - Overview of recent transactions and quick stats
- **Reports** - Detailed analytics and spending insights
- **Add Transaction** - Floating action button for quick transaction entry
- **User Menu** - Access Categories management and logout (tap avatar)

### Managing Transactions

- Tap the **+** button to add new transactions
- Choose between Income or Expense
- Select or create categories
- Add descriptions and amounts
- All changes sync automatically

### Categories Management

- Access via user menu → Categories
- Add, edit, or delete custom categories
- Default categories provided for common expenses
- Categories are shared within your family

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Initialize Firebase Hosting**

   ```bash
   npx firebase init hosting
   ```

   - Select your Firebase project
   - Set public directory to `dist`
   - Configure as single-page app: Yes
   - Don't overwrite index.html

3. **Deploy**
   ```bash
   npx firebase deploy
   ```

### Alternative Deployment Options

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop `dist` folder after build
- **GitHub Pages**: Use GitHub Actions for automated deployment

## �️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size
npm run build:analyze # Build and analyze
```

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Home page dashboard
│   ├── Reports.tsx      # Analytics and reports
│   ├── AddTransaction.tsx # Transaction form
│   ├── Categories.tsx   # Category management
│   ├── MobileLayout.tsx # Main app layout
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/             # Custom React hooks
├── lib/               # Firebase and utility libs
├── types/             # TypeScript type definitions
└── utils/             # Helper functions
```

### Code Guidelines

- Use functional components with React hooks
- Follow TypeScript best practices with proper typing
- Implement proper error handling and loading states
- Keep components small and focused
- Mobile-first responsive design
- Use Ant Design components with Tailwind for custom styling

### Performance Features

- **Code Splitting**: Each page is lazy-loaded for faster initial loads
- **Caching**: Aggressive caching strategies for production builds
- **Bundle Analysis**: Monitor and optimize bundle sizes
- **Error Boundaries**: Graceful error handling throughout the app

## 🔧 Configuration

### Environment Variables

Create `.env.local` for local development:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### PWA Configuration

The app is configured as a PWA with:

- Service worker for offline caching
- Web app manifest for installation
- Icon sets for different devices
- Offline fallback pages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write meaningful commit messages
- Add TypeScript types for new features
- Test on both mobile and desktop
- Follow the existing code style
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Troubleshooting

### Common Issues

**Firebase Permission Errors**

- Ensure Firestore security rules are properly configured
- Check that user is authenticated and part of the family

**Build Errors**

- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check Node.js version compatibility

**Performance Issues**

- Use the bundle analyzer to identify large dependencies: `npm run build:analyze`
- Check network tab for slow Firebase queries

### Getting Help

- Check the existing documentation files:
  - `FIREBASE_SETUP.md` - Firebase configuration guide
  - `FIREBASE_RULES_SETUP.md` - Security rules setup
  - `DEMO_ACCOUNTS.md` - Demo account information
  - `PWA_ICONS_README.md` - PWA icon requirements

## 🎯 Roadmap

### Planned Features

- [ ] Budget planning and alerts
- [ ] Export transactions to CSV/PDF
- [ ] Recurring transaction templates
- [ ] Multiple currency support
- [ ] Enhanced reporting with more chart types
- [ ] Bank account integration
- [ ] Receipt photo capture and OCR

### Performance Improvements

- [ ] Virtual scrolling for large transaction lists
- [ ] Advanced caching strategies
- [ ] Background sync for offline usage

---

**Built with ❤️ for better financial management**

For detailed setup instructions, see the additional documentation files in the project root.
