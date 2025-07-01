# Firebase Setup Instructions for FYnance

## 🔥 Firebase Configuration Status

✅ **Firebase Config Applied** - Your app is now connected to Firebase!

## 👥 Setting Up User Accounts

### **Step 1: Access Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Open your project: **fynance-f9226**

### **Step 2: Enable Authentication**

1. In the left sidebar, click **Authentication**
2. Click **Get started** if not already set up
3. Go to **Sign-in method** tab
4. Enable **Email/Password** provider
5. Click **Save**

### **Step 3: Create Family Accounts**

1. Go to **Authentication > Users** tab
2. Click **Add user**
3. Create account for yourself:
   - **Email**: your-email@example.com
   - **Password**: create a secure password
4. Create account for your wife:
   - **Email**: wife-email@example.com
   - **Password**: create a secure password

### **Step 4: Enable Firestore Database**

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now)
4. Select your preferred location
5. Click **Done**

## 🏠 Family Data Sharing

✅ **Automatic Family Sharing** - Both accounts will automatically share the same financial data through the family system built into the app.

## 🔐 Security Rules (Optional - Advanced)

For production use, you may want to update Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their family's data
    match /transactions/{document} {
      allow read, write: if request.auth != null &&
        resource.data.familyId == 'family-001'; // Update with your family ID
    }

    match /categories/{document} {
      allow read, write: if request.auth != null &&
        resource.data.familyId == 'family-001'; // Update with your family ID
    }
  }
}
```

## 📱 Testing Your Setup

1. **Open the app**: http://localhost:5174
2. **Login** with your created accounts
3. **Verify** both accounts see the same dashboard
4. **Test** logging out and switching between accounts

## 🚀 Next Steps

Once authentication is working:

1. ✅ Login system (Done)
2. ✅ Family dashboard (Done)
3. 🔜 Add transaction form
4. 🔜 Reports with charts
5. 🔜 Category management

## 🆘 Troubleshooting

### **Authentication Issues:**

- Ensure Email/Password is enabled in Firebase Console
- Check browser console for error messages
- Verify internet connection

### **Database Issues:**

- Ensure Firestore is enabled
- Check security rules allow access
- Verify project ID matches in config

### **App Issues:**

- Clear browser cache and reload
- Check browser developer tools for errors
- Restart development server: `npm run dev`

---

**Your FYnance app is ready for family financial tracking!** 🎉
