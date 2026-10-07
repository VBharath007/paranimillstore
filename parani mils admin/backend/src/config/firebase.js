const path = require('path');
const fs = require('fs');
const { initializeApp, cert, getApps, getApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

let app;
let db;

try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

  if (getApps().length === 0) {
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = require(serviceAccountPath);
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id,
      });
    } else {
      app = initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'parani-mill-store',
      });
    }
  } else {
    app = getApp();
  }

  db = getFirestore(app);
  console.log('🔥 Firebase Firestore connected successfully (Project:', app.options.projectId || process.env.FIREBASE_PROJECT_ID, ')');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  throw error;
}

module.exports = {
  app,
  db,
};
