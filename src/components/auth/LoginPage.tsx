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
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand rounded-lg text-white shadow-sm mb-3">
            <School size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Portal Akademik</h2>
          <p className="text-xs text-slate-500 font-medium">SMK Prima Unggul Tangerang Selatan</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
          {/* Role Toggle */}
          <div className="flex bg-slate-50 p-1 rounded-lg mb-6 relative z-10 border border-slate-100">
            <button
              onClick={() => setRole('siswa')}
              className={`flex-1 py-2 px-4 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
                role === 'siswa' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Siswa
            </button>
            <button
              onClick={() => setRole('karyawan')}
              className={`flex-1 py-2 px-4 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
                role === 'karyawan' ? 'bg-white text-slate-900 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Guru & Staff
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                {role === 'siswa' ? 'Username / NISN' : 'Username / Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 rounded-lg font-bold text-xs transition-all"
                  placeholder={role === 'siswa' ? 'Masukkan NISN' : 'Masukkan Username'}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-[10px] font-bold text-rose-600 hover:underline">Lupa password?</button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 rounded-lg font-bold text-xs transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-2 text-rose-600 text-[11px] font-bold"
                >
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-2.5 px-6 bg-brand hover:opacity-90 disabled:bg-slate-200 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] text-xs uppercase tracking-wider"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          SMK Prima Unggul • © 2026 
        </p>
      </div>
    </div>
  );
}
