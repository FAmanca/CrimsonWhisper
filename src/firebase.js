import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-V-H-EjmCwVXTBfxsVCYd9URJJkuA13E",
  authDomain: "crimsonchat-add3e.firebaseapp.com",
  databaseURL: "https://crimsonchat-add3e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crimsonchat-add3e",
  storageBucket: "crimsonchat-add3e.appspot.com",
  messagingSenderId: "288334024385",
  appId: "1:288334024385:web:0a42e8ce3740ab81e4ce40",
  measurementId: "G-2TJW3YQY68"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
