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
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Absensi Mandiri</h2>
          <p className="text-gray-500 font-medium tracking-tight">Silakan lakukan absensi harian Anda di sini.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
             <Calendar size={20} />
           </div>
           <div>
             <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Hari Ini</p>
             <p className="text-sm font-bold text-gray-900 leading-none">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
             </p>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center text-center py-10"
            >
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Berhasil!</h3>
              <p className="text-gray-500 font-medium mb-8">Data absensi Anda telah tercatat hari ini.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Kembali
              </button>
            </motion.div>
          ) : (
            <div className="space-y-8 relative z-10">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-4 tracking-tight">Pilih Status Kehadiran</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'present', label: 'Hadir', desc: 'Bekerja Normal' },
                    { id: 'sick', label: 'Sakit', desc: 'Perlu Bukti' },
                    { id: 'leave', label: 'Izin', desc: 'Keperluan Lain' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatus(s.id as any)}
                      className={`p-4 rounded-2xl border-2 transition-all text-left ${
                        status === s.id 
                          ? 'border-brand bg-brand/5 ring-4 ring-brand/5' 
                          : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <p className={`font-bold text-sm mb-1 ${status === s.id ? 'text-brand' : 'text-gray-900'}`}>{s.label}</p>
                      <p className="text-[10px] text-gray-400 font-medium leading-tight">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${location ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600 animate-pulse'}`}>
                   <MapPin size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase text-gray-400 mb-1">Lokasi Perangkat</p>
                   <p className="text-xs font-bold text-gray-600">
                     {location ? 'Lokasi Terdeteksi' : 'Sedang mencari lokasi...'}
                   </p>
                </div>
              </div>

              <button
                disabled={loading}
                onClick={handleAttendance}
                className="w-full py-4 bg-brand hover:bg-brand/90 disabled:bg-gray-200 text-white font-bold rounded-2xl shadow-lg shadow-brand/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Simpan Presensi Hari Ini <Clock size={20} /></>
                )}
              </button>
            </div>
          )}
          
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand/5 rounded-full blur-3xl" />
        </div>

        {/* History / Info */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 relative z-10">Status Terakhir</h3>
            {lastAttendance ? (
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">Tanggal:</span>
                  <span className="font-bold">{lastAttendance.date}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">Jam:</span>
                  <span className="font-bold">{lastAttendance.timestamp?.toDate ? lastAttendance.timestamp.toDate().toLocaleTimeString() : 'Baru saja'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60 font-medium">Status:</span>
                   <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                    lastAttendance.status === 'present' ? 'bg-green-500' : 'bg-orange-500'
                  }`}>
                    {lastAttendance.status}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-white/60 text-sm font-medium italic relative z-10">Belum ada data absensi.</p>
            )}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-10 translate-y-10" />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 shrink-0 flex items-center justify-center">
               <AlertCircle size={20} />
             </div>
             <div>
               <h4 className="font-bold text-gray-900 text-sm mb-1">Informasi Penting</h4>
               <p className="text-xs text-gray-500 font-medium leading-relaxed">
                 Pastikan GPS Anda aktif sebelum melakukan absensi. Batas waktu absensi pagi adalah jam 08:00 WIB.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
