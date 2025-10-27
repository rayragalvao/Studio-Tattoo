// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // 🔹 adicionar auth

const firebaseConfig = {
  apiKey: "AIzaSyAz3-m-fD-0XmS5eHYw-dWuFWUpbvZF_e0",
  authDomain: "jupiter-frito.firebaseapp.com",
  projectId: "jupiter-frito",
  storageBucket: "jupiter-frito.firebasestorage.app",
  messagingSenderId: "190901035751",
  appId: "1:190901035751:web:4aa777ac479c08ae4f3842",
  measurementId: "G-6FQ5M18YSY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// 🔹 Inicializar Auth e Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { app, analytics, auth, provider };
