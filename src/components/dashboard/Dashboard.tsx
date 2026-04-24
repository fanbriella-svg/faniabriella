import { useAuth } from '../../App';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Calendar,
  ChevronRight,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: 'Total Siswa', value: '1,248', detail: '▲ TKJ, DKV, AK, BC', color: 'text-emerald-500' },
    { label: 'Kehadiran Hari Ini', value: '98.2%', detail: 'Sangat Baik', color: 'text-emerald-500' },
    { label: 'Guru Aktif', value: '52', detail: 'Sedang Mengajar', color: 'text-slate-500' },
    { label: 'KKM Standar', value: '50', detail: 'Batas Kelulusan', color: 'text-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner (Modified to fit High Density better) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand rounded-xl p-8 text-white relative overflow-hidden shadow-sm"
      >
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-2">Selamat Datang</p>
          <h2 className="text-3xl font-bold mb-4">{user?.displayName}</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md text-xs font-bold border border-white/10">
              <Clock size={14} /> {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-md text-xs font-bold border border-white/10">
              <Calendar size={14} /> {time.toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="hd-card p-4"
          >
            <p className="text-[11px] font-medium text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mb-1">{stat.value}</p>
            <span className={`text-[11px] font-bold ${stat.color}`}>{stat.detail}</span>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table View matching High Density */}
        <div className="lg:col-span-2 hd-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold">Absensi Siswa Terbaru</h3>
            <button className="text-rose-600 font-bold text-[11px] uppercase tracking-wider">Lihat Semua</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="hd-table-th">NIS</th>
                  <th className="hd-table-th">Nama Siswa</th>
                  <th className="hd-table-th">Kelas / Jurusan</th>
                  <th className="hd-table-th">Waktu</th>
                  <th className="hd-table-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { nis: '2021001', name: 'Ahmad Fauzi', class: 'XII - TKJ', time: '07:15:32', status: 'HADIR' },
                  { nis: '2021045', name: 'Budi Santoso', class: 'XI - DKV', time: '07:22:10', status: 'HADIR' },
                  { nis: '2021089', name: 'Citra Lestari', class: 'XII - AK', time: '07:45:01', status: 'TERLAMBAT' },
                  { nis: '2021112', name: 'Dewi Rahayu', class: 'X - MPLB', time: '07:10:45', status: 'HADIR' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="hd-table-td text-slate-500">{item.nis}</td>
                    <td className="hd-table-td font-bold">{item.name}</td>
                    <td className="hd-table-td">{item.class}</td>
                    <td className="hd-table-td font-mono text-xs">{item.time}</td>
                    <td className="hd-table-td">
                      <span className={`badge ${item.status === 'HADIR' ? 'badge-present' : 'badge-late'}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule */}
        <div className="hd-card p-6">
          <h3 className="text-sm font-bold mb-6">Jadwal Hari Ini</h3>
          <div className="space-y-4">
            {[
              { time: '07:00 - 08:30', name: 'Matematika Dasar', room: 'Lab TKJ 1' },
              { time: '08:45 - 10:15', name: 'Produktif DKV', room: 'Studio 1' },
              { time: '10:30 - 12:00', name: 'Bahasa Indonesia', room: 'R. 104' },
            ].map((schedule, i) => (
              <div key={i} className="pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{schedule.time}</p>
                <p className="font-bold text-slate-800 text-sm">{schedule.name}</p>
                <p className="text-[11px] text-slate-500 font-medium">{schedule.room}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
