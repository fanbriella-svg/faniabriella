import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export type Role = 'admin' | 'guru' | 'tenaga_kependidikan' | 'siswa';
export type Major = 'TKJ' | 'DKV' | 'AK' | 'BC' | 'MPLB' | 'BD';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: Role;
  major?: Major;
  nisn?: string;
  username?: string;
}

export interface StudentData {
  nisn: string;
  name: string;
  class: string;
  major: Major;
}

export interface AttendanceRecord {
  id?: string;
  userId: string;
  type: 'employee' | 'student';
  studentId?: string;
  status: 'present' | 'sick' | 'leave' | 'absent';
  date: string;
  timestamp: any;
  location?: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  answer: number;
  difficulty: 'easy' | 'hard';
}

export interface Exam {
  id: string;
  title: string;
  major: Major;
  duration: number;
  questions: Question[];
}

export interface ExamResult {
  id?: string;
  examId: string;
  studentId: string;
  score: number;
  completedAt: any;
  answers: { [questionId: string]: number };
}
