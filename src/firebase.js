import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvAMhaGBU8EsDsGY-g5TSmhhbmn1tScac",
  authDomain: "financely-rec-bf328.firebaseapp.com",
  projectId: "financely-rec-bf328",
  storageBucket: "financely-rec-bf328.appspot.com",
  messagingSenderId: "172865228676",
  appId: "1:172865228676:web:1da7992987e5bddb1a17d1",
  measurementId: "G-MG4X4XJSD7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc };
