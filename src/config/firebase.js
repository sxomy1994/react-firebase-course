// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDKDe9vLNWC_EXptn3g8IHkSojdrjlgLzI",
  authDomain: "fir-react-9db78.firebaseapp.com",
  projectId: "fir-react-9db78",
  storageBucket: "fir-react-9db78.appspot.com",
  messagingSenderId: "172414905198",
  appId: "1:172414905198:web:0a58af36af57032d302f7f",
  measurementId: "G-HZS8HM28DM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);