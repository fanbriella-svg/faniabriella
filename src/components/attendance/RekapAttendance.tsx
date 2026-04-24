import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, getDocs, orderBy, where, limit } from 'firebase/firestore';
import { BarChart3, Users, Briefcase, Filter, Download, Calendar as CalIcon } from 'lucide-react';
import { motion } from 'motion/react';

export default function RekapAttendance() {
  const [activeTab, setActiveTab] = useState<'karyawan' | 'siswa'>('karyawan');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'attendance'),
        where('type', '==', activeTab === 'karyawan' ? 'employee' : 'student'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
      const snap = await getDocs(q);
      setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Rekap Absensi</h2>
          <p className="text-[11px] text-slate-500 font-medium">Laporan riwayat kehadiran seluruh ekosistem sekolah.</p>
        </div>
        
        <button className="px-6 py-2 bg-brand text-white font-bold rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-wider">
          <Download size={16} /> DOWNLOAD LAPORAN
        </button>
      </div>

      <div className="hd-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('karyawan')}
            className={`flex-1 md:flex-none md:min-w-[180px] flex items-center justify-center gap-2 py-2.5 rounded-md font-bold text-xs transition-all ${
              activeTab === 'karyawan' ? 'bg-brand text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Briefcase size={14} /> Absensi Karyawan
          </button>
          <button 
            onClick={() => setActiveTab('siswa')}
            className={`flex-1 md:flex-none md:min-w-[180px] flex items-center justify-center gap-2 py-2.5 rounded-md font-bold text-xs transition-all ${
              activeTab === 'siswa' ? 'bg-brand text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Users size={14} /> Absensi Siswa
          </button>
        </div>

        <div className="p-4 border-b border-slate-50 bg-white flex flex-wrap gap-2 items-center">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
             <CalIcon size={14} className="text-slate-400" />
             <span className="text-[10px] font-bold text-slate-600">Bulan Ini (April 2026)</span>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
             <Filter size={14} className="text-slate-400" />
             <span className="text-[10px] font-bold text-slate-600">Semua Jurusan</span>
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="hd-table-th">Identitas</th>
                <th className="hd-table-th">Tanggal / Waktu</th>
                <th className="hd-table-th">Status</th>
                <th className="hd-table-th text-right">Lokasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {loading ? (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic text-sm">Memuat riwayat...</td></tr>
               ) : data.length === 0 ? (
                 <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold italic text-sm">Belum ada data.</td></tr>
               ) : data.map((item) => (
                 <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                   <td className="hd-table-td">
                     <p className="font-bold text-slate-800 text-xs">{item.userName || item.studentId || 'N/A'}</p>
                     <p className="text-[10px] font-mono text-slate-400">{item.userId || item.studentId}</p>
                   </td>
                   <td className="hd-table-td">
                     <p className="text-xs font-bold text-slate-600 mb-0.5">{item.date}</p>
                     <p className="text-[10px] font-mono text-slate-400">
                       {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleTimeString() : 'N/A'}
                     </p>
                   </td>
                   <td className="hd-table-td">
                      <span className={`badge ${
                        item.status === 'present' ? 'badge-present' : 
                        item.status === 'sick' ? 'bg-blue-100 text-blue-700' :
                        'badge-absent'
                      }`}>
                        {item.status}
                      </span>
                   </td>
                   <td className="hd-table-td text-right">
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {item.location?.substring(0, 20)}...
                      </span>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
