import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, githubProvider, db } from '../firebase';

interface UserProfile {
  username?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  register: (email: string, password: string, profile: UserProfile) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserProfile(currentUser.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (!userCredential.user.emailVerified) {
      await signOut(auth);
      throw new Error('EMAIL_NOT_VERIFIED');
    }
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    // Google accounts are usually verified, but if not:
    if (auth.currentUser && !auth.currentUser.emailVerified) {
       await signOut(auth);
       throw new Error('EMAIL_NOT_VERIFIED');
    }
    // Create user profile if not exists
    if (auth.currentUser) {
       const docRef = doc(db, "users", auth.currentUser.uid);
       const docSnap = await getDoc(docRef);
       if (!docSnap.exists()) {
         await setDoc(docRef, {
           username: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0],
           email: auth.currentUser.email,
           createdAt: new Date().toISOString()
         });
       }
    }
  };

  const loginWithGithub = async () => {
    await signInWithPopup(auth, githubProvider);
    if (auth.currentUser && !auth.currentUser.emailVerified) {
       // Github emails might not be verified in Firebase depending on settings, 
       // but usually they are trusted. If strict verification is needed:
       // await signOut(auth);
       // throw new Error('EMAIL_NOT_VERIFIED');
    }
    // Create user profile if not exists
    if (auth.currentUser) {
       const docRef = doc(db, "users", auth.currentUser.uid);
       const docSnap = await getDoc(docRef);
       if (!docSnap.exists()) {
         await setDoc(docRef, {
           username: auth.currentUser.displayName || auth.currentUser.email?.split('@')[0] || 'GithubUser',
           email: auth.currentUser.email,
           createdAt: new Date().toISOString()
         });
       }
    }
  };

  const register = async (email: string, password: string, profile: UserProfile) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save user profile to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      username: profile.username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: email,
      createdAt: new Date().toISOString()
    });

    await sendEmailVerification(userCredential.user);
    await signOut(auth);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, loginWithGoogle, loginWithGithub, register, logout, refreshProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
