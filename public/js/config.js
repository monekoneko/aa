import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-database.js"; 
import { getAuth } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBl8n-1_6gZxwvUCSypLTNu23gMzsrizD8",
  authDomain: "sample-c2b36.firebaseapp.com",
  projectId: "sample-c2b36",
  storageBucket: "sample-c2b36.appspot.com",
  messagingSenderId: "88710090874",
  appId: "1:88710090874:web:ecbc7bcd54ccb854a22bc3"
};

const app = initializeApp(firebaseConfig);          // Firebaseに接続
export const db = getDatabase(app);                        // リアルタイムDBに接続
export const auth = getAuth(app);                          // ログイン状況
