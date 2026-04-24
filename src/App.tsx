/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState, createContext, useContext } from 'react';
import { auth, db, UserProfile } from './services/firebase';

// Pages - to be created
import LandingPage from './components/home/LandingPage';
import LoginPage from './components/auth/LoginPage';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './components/dashboard/Dashboard';
import EmployeeAttendance from './components/attendance/EmployeeAttendance';
import StudentAttendance from './components/attendance/StudentAttendance';
import RekapAttendance from './components/attendance/RekapAttendance';
import UserManagement from './components/users/UserManagement';
import StudentManagement from './components/students/StudentManagement';
import ExamList from './components/exam/ExamList';
import ExamScreen from './components/exam/ExamScreen';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...docSnap.data() } as UserProfile);
        } else {
          // Fallback if profile not created yet or using mock
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: 'siswa', // Default
          } as UserProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={user ? <Navigate to="/app" /> : <LoginPage />} />
          
          <Route path="/app" element={user ? <AppLayout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="absensi-karyawan" element={<EmployeeAttendance />} />
            <Route path="absensi-siswa" element={<StudentAttendance />} />
            <Route path="rekap-absensi" element={<RekapAttendance />} />
            <Route path="data-siswa" element={<StudentManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="ujian" element={<ExamList />} />
          </Route>
          
          <Route path="/ujian/:examId" element={user ? <ExamScreen /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
