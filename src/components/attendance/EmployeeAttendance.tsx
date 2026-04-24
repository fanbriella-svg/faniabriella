import { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { MapPin, CheckCircle2, Clock, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function EmployeeAttendance() {
  const { user } = useAuth();
  const [status, setStatus] = useState<'present' | 'sick' | 'leave'>('present');
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAttendance, setLastAttendance] = useState<any>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLastAttendance();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(`${pos.coords.latitude}, ${pos.coords.longitude}`);
      });
    }
  }, [user]);

  const fetchLastAttendance = async () => {
    if (!user) return;
    const q = query(
      collection(db, 'attendance'),
      where('userId', '==', user.uid),
      where('type', '==', 'employee'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      setLastAttendance(snap.docs[0].data());
    }
  };

  const handleAttendance = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await addDoc(collection(db, 'attendance'), {
        userId: user.uid,
        userName: user.displayName,
        type: 'employee',
        status,
        date: today,
        timestamp: serverTimestamp(),
        location: location || 'Location not available',
      });
      setSuccess(true);
      fetchLastAttendance();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">Absensi Mandiri</h2>
          <p className="text-[11px] text-slate-500 font-medium">Silakan lakukan absensi harian Anda di sini.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
           <div className="w-8 h-8 rounded-md bg-orange-50 flex items-center justify-center text-orange-600">
             <Calendar size={16} />
           </div>
           <div>
             <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Hari Ini</p>
             <p className="text-xs font-bold text-slate-900 leading-none">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
             </p>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="hd-card p-6 relative overflow-hidden">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-6"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Berhasil!</h3>
              <p className="text-[11px] text-slate-500 font-medium mb-6">Data absensi Anda telah tercatat hari ini.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs uppercase tracking-wider hover:opacity-90 transition-colors shadow-sm"
              >
                Kembali
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">Pilih Status Kehadiran</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'present', label: 'Hadir', desc: 'Normal' },
                    { id: 'sick', label: 'Sakit', desc: 'Bukti' },
                    { id: 'leave', label: 'Izin', desc: 'Keperluan' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id as any)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        status === s.id 
                          ? 'border-brand bg-brand/5' 
                          : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <p className={`font-bold text-xs mb-0.5 ${status === s.id ? 'text-brand' : 'text-slate-900'}`}>{s.label}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center ${location ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-50 text-rose-600 animate-pulse'}`}>
                   <MapPin size={16} />
                </div>
                <div>
                   <p className="text-[9px] font-bold uppercase text-slate-400 mb-0.5">Lokasi Perangkat</p>
                   <p className="text-[11px] font-bold text-slate-600">
                     {location ? 'Lokasi Terdeteksi' : 'Sedang mencari lokasi...'}
                   </p>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleAttendance}
                className="w-full py-3 bg-brand hover:opacity-90 disabled:bg-slate-200 text-white font-bold rounded-lg shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Simpan Presensi <Clock size={16} /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm relative overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 relative z-10">Status Terakhir</h3>
            {lastAttendance ? (
              <div className="space-y-3 relative z-10">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white/50 font-medium">Tanggal:</span>
                  <span className="font-bold">{lastAttendance.date}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white/50 font-medium">Jam:</span>
                  <span className="font-bold">{lastAttendance.timestamp?.toDate ? lastAttendance.timestamp.toDate().toLocaleTimeString() : 'Baru saja'}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-white/50 font-medium">Status:</span>
                   <span className={`badge ${
                    lastAttendance.status === 'present' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {lastAttendance.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-white/40 text-[11px] font-medium italic relative z-10">Belum ada data absensi.</p>
            )}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
          </div>

          <div className="hd-card p-4 flex items-start gap-4">
             <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 shrink-0 flex items-center justify-center">
               <AlertCircle size={16} />
             </div>
             <div>
               <h4 className="font-bold text-slate-900 text-xs mb-1">Informasi Penting</h4>
               <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                 Pastikan GPS Anda aktif sebelum melakukan absensi. Batas waktu absensi pagi adalah jam 08:00 WIB.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
