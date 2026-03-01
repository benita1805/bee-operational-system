# BEE Operational System 👋

This is an [Expo](https://expo.dev) project for managing bee hives and farmer records. It has been refined for production readiness.

## Get started

1.  **Install dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```
    EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
    EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

3.  **Start the app**
    ```bash
    npx expo start
    ```

## Production Ready Features

-   **Secure Configuration**: Firebase configuration is moved to environment variables (`.env`).
-   **Error Handling**: All service layer functions (`farmersApi`, `hiveCloud`, `harvestCloud`) now include try-catch blocks, validation, and logging.
-   **Structure Cleanup**: Fragmented code files and temporary scripts have been removed for a cleaner workspace.
-   **Verification Testing**: automated endpoint verification script included in `scripts/verifyEndpoints.js`.

## Verification

To verify the service layer against your Firestore database, run:
```bash
node scripts/verifyEndpoints.js
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [React Native documentation](https://reactnative.dev/)
