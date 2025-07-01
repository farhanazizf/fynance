# Firebase Rules Setup for FYnance

The current Firestore rules are set to deny all read and write operations. To allow authenticated users to access data in your Firebase project, you need to update the security rules in your Firebase console.

## Current Rules (Denying all access)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Updated Rules (Allowing authenticated users)

Replace the current rules with the following rules that allow authenticated users to access data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Base rules - deny all by default
    match /{document=**} {
      allow read, write: if false;
    }

    // Categories collection
    match /categories/{categoryId} {
      // Allow read access to authenticated users with matching familyId
      allow read: if request.auth != null &&
                   resource.data.familyId == request.resource.data.familyId;

      // Allow write access to authenticated users with matching familyId
      allow write: if request.auth != null &&
                    request.resource.data.familyId == request.resource.data.familyId;
    }

    // Transactions collection
    match /transactions/{transactionId} {
      // Allow read access to authenticated users with matching familyId
      allow read: if request.auth != null &&
                   resource.data.familyId == request.resource.data.familyId;

      // Allow write access to authenticated users with matching familyId
      allow write: if request.auth != null &&
                    request.resource.data.familyId == request.resource.data.familyId;
    }

    // User profiles - for future use
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## How to Update Firebase Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. In the left sidebar, click on "Firestore Database"
4. Navigate to the "Rules" tab
5. Replace the existing rules with the rules provided above
6. Click "Publish" to apply the new rules

## Important Notes

- These rules allow users to access data that matches their familyId
- The `familyId` field must be included in all documents for proper security
- Consider adding more specific rules as your application grows
- Test the rules thoroughly before deploying to production

## Testing the Rules

You can test these rules in the Firebase Console using the Rules Playground:

1. Go to the Firestore "Rules" tab
2. Click on "Rules Playground" in the top right
3. Set up authentication and test different operations

## For Development/Testing Only

If you're still in early development and want to temporarily allow all access, you can use:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // WARNING: NEVER USE IN PRODUCTION
    }
  }
}
```

**WARNING:** Never use these permissive rules in production as they allow anyone to read and write any data in your database.
