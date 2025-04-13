
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Initialize Firebase with env variables or default to demo mode
const firebaseConfig = {
  apiKey: "AIzaSyD6PQdIZJ_mi6QjdK_DBZeqTGo3e2qvY2k",
  authDomain: "portfolio-react-2f17b.firebaseapp.com",
  projectId: "portfolio-react-2f17b",
  storageBucket: "portfolio-react-2f17b.firebasestorage.app",
  messagingSenderId: "1042396165687",
  appId: "1:1042396165687:web:96393d814527ae3ce7f1b2"
};

let app;
let db;
let auth;
let storage;

try {
  // Initialize Firebase only if proper config is provided
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// About Me
export async function getAboutMe() {
  try {
    if (!db) return null;
    
    const aboutCollection = collection(db, "about");
    const aboutSnapshot = await getDocs(aboutCollection);
    const aboutList = aboutSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return aboutList.length > 0 ? aboutList[0] : null;
  } catch (error) {
    console.error("Error getting about data:", error);
    return null;
  }
}

// Education
export async function getEducation() {
  try {
    if (!db) return [];
    
    const educationCollection = collection(db, "education");
    const educationSnapshot = await getDocs(educationCollection);
    return educationSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting education data:", error);
    return [];
  }
}

// Experience
export async function getExperience() {
  try {
    if (!db) return [];
    
    const experienceCollection = collection(db, "experience");
    const experienceSnapshot = await getDocs(experienceCollection);
    return experienceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting experience data:", error);
    return [];
  }
}

// Certifications
export async function getCertifications() {
  try {
    if (!db) return [];
    
    const certificationsCollection = collection(db, "certifications");
    const certificationsSnapshot = await getDocs(certificationsCollection);
    return certificationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting certifications data:", error);
    return [];
  }
}

// Projects
export async function getProjects() {
  try {
    if (!db) return [];
    
    const projectsCollection = collection(db, "projects");
    const projectsSnapshot = await getDocs(projectsCollection);
    return projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting projects data:", error);
    return [];
  }
}

// Contact Form
export async function submitContactForm(formData) {
  try {
    if (!db) {
      console.log("Demo mode: Contact form submission", formData);
      return { id: "demo-id" };
    }
    
    const contactCollection = collection(db, "contacts");
    return addDoc(contactCollection, {
      ...formData,
      read: false,
      createdAt: new Date()
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
}

// Authentication
export async function loginAdmin(email, password) {
  try {
    if (!auth) {
      console.log("Demo mode: Login attempt", { email });
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { user: { uid: "demo-user-id", email } };
    }
    
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function logoutAdmin() {
  try {
    if (!auth) {
      console.log("Demo mode: Logout attempt");
      return;
    }
    
    return signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

// File Upload
export async function uploadFile(file, path) {
  try {
    if (!storage) {
      console.log("Demo mode: File upload", { fileName: file.name, path });
      // Return a placeholder URL for demo mode
      return URL.createObjectURL(file);
    }
    
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Admin CRUD Operations
export async function addDocument(collectionName, data) {
  try {
    if (!db) {
      console.log(`Demo mode: Add document to ${collectionName}`, data);
      return { id: `demo-${Date.now()}` };
    }
    
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: new Date()
    });
    
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}

export async function updateDocument(collectionName, docId, data) {
  try {
    if (!db) {
      console.log(`Demo mode: Update document in ${collectionName}`, { docId, data });
      return true;
    }
    
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
}

export async function deleteDocument(collectionName, docId) {
  try {
    if (!db) {
      console.log(`Demo mode: Delete document from ${collectionName}`, { docId });
      return true;
    }
    
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    
    return true;
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
