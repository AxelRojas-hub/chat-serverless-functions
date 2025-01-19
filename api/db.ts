import * as admin from 'firebase-admin';


const app = admin.default;

if (process.env.NODE_ENV !== "production") {
  process.loadEnvFile('.env');
}
const serviceAccount = {
  type: "service_account",
  project_id: "nivel2-apx",
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Corregir salto de línea
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  universe_domain: "googleapis.com",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

app.initializeApp({
    credential: app.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: "https://nivel2-apx-default-rtdb.firebaseio.com"
});


//Instancia del prod que voy a usar
export const firestore = app.firestore();
export const rtdb = app.database();