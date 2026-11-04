// SETUP REQUIRED: Replace these placeholders with your Firebase Web App config.
// Firebase Web App config is public configuration; never put Admin SDK keys here.
export const firebaseConfig = {
  apiKey: "PASTE_FIREBASE_API_KEY",
  authDomain: "PASTE_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  appId: "PASTE_FIREBASE_APP_ID",
  storageBucket: "PASTE_FIREBASE_STORAGE_BUCKET",
};
export const configured = !['apiKey','authDomain','projectId','appId'].some(key => !firebaseConfig[key] || firebaseConfig[key].startsWith('PASTE_'));
