import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { readFileSync } from "fs";

let serviceAccount;

try {
  // 1. Check if Render environment variable exists
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Render ke liye JSON string ko parse karna
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // 2. Local machine ke liye file se read karna
    serviceAccount = JSON.parse(
      readFileSync(new URL("../../serviceAccountKey.json", import.meta.url))
    );
  }
} catch (error) {
  console.error("Firebase Service Account load karne me error aayi:", error.message);
}

const firebaseApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
    });

export default firebaseApp;