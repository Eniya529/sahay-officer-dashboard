import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8SyBbeMwSZHF9FTsKK50t7-K4jJZL_Hg",
  authDomain: "sahay-22dea.firebaseapp.com",
  projectId: "sahay-22dea",
  storageBucket: "sahay-22dea.firebasestorage.app",
  messagingSenderId: "693731475383",
  appId: "1:693731475383:web:b78946db3df2b377287232"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;