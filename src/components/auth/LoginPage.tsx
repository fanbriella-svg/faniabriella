import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { User, Lock, ArrowRight, AlertCircle, School } from 'lucide-react';

export default function LoginPage() {
  const [role, setRole] = useState<'siswa' | 'karyawan'>('siswa');
  const [identifier, setIdentifier] = useState(''); // NISN/Username or Email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // In a real app, if it's NISN/Username, we might need a lookup to get the email
      // For this demo, we assume the identifier is the email or we append a mock domain
      let loginEmail = identifier;
      if (role === 'siswa' && !identifier.includes('@')) {
        loginEmail = `${identifier}@siswa.smkpu.sch.id`;
      } else if (role === 'karyawan' && !identifier.includes('@')) {
         loginEmail = `${identifier}@smkpu.sch.id`;
      }

      await signInWithEmailAndPassword(auth, loginEmail, password);
      navigate('/app');
    } catch (err: any) {
      setError('Login gagal. Periksa kembali username/email dan password Anda.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand rounded-2xl text-white shadow-lg shadow-brand/20 mb-4">
            <School size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Portal Akademik</h2>
          <p className="text-gray-500 font-medium">SMK Prima Unggul Tangerang Selatan</p>
        </div>

        {/* Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
          {/* Role Toggle */}
          <div className="flex bg-gray-50 p-1 rounded-xl mb-8 relative z-10">
            <button
              onClick={() => setRole('siswa')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                role === 'siswa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Siswa
            </button>
            <button
              onClick={() => setRole('karyawan')}
              className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${
                role === 'karyawan' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Guru & Staff
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {role === 'siswa' ? 'Username / NISN' : 'Username / Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand rounded-xl font-medium transition-all"
                  placeholder={role === 'siswa' ? 'Masukkan NISN' : 'Masukkan Username'}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <button type="button" className="text-xs font-bold text-brand hover:underline">Lupa password?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand rounded-xl font-medium transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium"
                >
                  <AlertCircle size={18} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 px-6 bg-brand hover:bg-brand/90 disabled:bg-gray-200 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-brand/20 active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          {/* Decorative stuff */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-brand/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-500 font-medium">
          Dikelola oleh Tim IT SMK Prima Unggul
        </p>
      </div>
    </div>
  );
}
