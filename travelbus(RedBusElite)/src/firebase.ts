import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDCmlf5AzQoL66lMCttVfytu3Gxk35Ypn0",
  authDomain: "travel-bus-redbus-elite.firebaseapp.com",
  projectId: "travel-bus-redbus-elite",
  storageBucket: "travel-bus-redbus-elite.firebasestorage.app",
  messagingSenderId: "777360700174",
  appId: "1:777360700174:web:c52ea1f966dc1eef8d1d5f",
  measurementId: "G-RMLJDWE6E5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
