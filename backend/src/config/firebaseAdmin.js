import { initializeApp, cert, getApps, getApp } from "firebase-admin/app";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(new URL("../../serviceAccountKey.json", import.meta.url))
);

const firebaseApp = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
    });

export default firebaseApp;