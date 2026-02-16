import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBd4eXXIzpvVW_gROeZxikmAXIEr8_rFvY",
  authDomain: "care-firebase-project.firebaseapp.com",
  projectId: "care-firebase-project",
  storageBucket: "care-firebase-project.firebasestorage.app",
  messagingSenderId: "597428773211",
  appId: "1:597428773211:web:e2bb4c40d51af90d67ba7e",
};

const app = initializeApp(firebaseConfig);
export default app;
