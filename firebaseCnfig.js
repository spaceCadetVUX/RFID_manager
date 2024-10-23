import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics"; // Added isSupported

const firebaseConfig = {
  apiKey: "AIzaSyD-9dYYV-vEuvm3IrynRmt0P4jGhZ27aC8",
  authDomain: "schooldatabase-63900.firebaseapp.com",
  projectId: "schooldatabase-63900",
  storageBucket: "schooldatabase-63900.appspot.com",
  messagingSenderId: "19115404930",
  appId: "1:19115404930:web:07c9eca015849844da4e9b",
  measurementId: "G-SMSPG1V464"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Check if analytics is supported before initializing
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app); // Initialize Analytics only if supported
  } else {
    console.log("Firebase Analytics is not supported in this environment.");
  }
});

// Initialize Firebase Authentication
const auth = getAuth(app);

export { auth };
