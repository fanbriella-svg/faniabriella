import { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { Search, Save, CheckCircle2, Users, School, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function StudentAttendance() {
  const [students, setStudents] = useState<any[]>([]);
  const [selectedMajor, setSelectedMajor] = useState('TKJ');
  const [selectedClass, setSelectedClass] = useState('X');
  const [attendance, setAttendance] = useState<{ [id: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const classes = ['X', 'XI', 'XII'];
  const majors = ['TKJ', 'DKV', 'AK', 'BC', 'MPLB', 'BD'];

  useEffect(() => {
    fetchStudents();
  }, [selectedMajor, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('major', '==', selectedMajor),
        where('class', '==', selectedClass)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setStudents(data);
      
      // Reset attendance map
      const initial: { [id: string]: string } = {};
      data.forEach(s => initial[s.id] = 'present');
      setAttendance(initial);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const batchPromises = Object.entries(attendance).map(([studentId, status]) => {
        return addDoc(collection(db, 'attendance'), {
          studentId,
          type: 'student',
          status,
          date: today,
          timestamp: serverTimestamp(),
          major: selectedMajor,
          class: selectedClass
        });
      });
      await Promise.all(batchPromises);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Absensi Siswa</h2>
          <p className="text-[11px] text-slate-500 font-medium">Manajemen kehadiran siswa per kelas dan jurusan.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Filters */}
          <div className="relative">
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 font-bold text-xs text-slate-700 shadow-sm focus:ring-2 focus:ring-brand/10 transition-all outline-none"
            >
              {classes.map(c => <option key={c} value={c}>Kelas {c}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 font-bold text-xs text-slate-700 shadow-sm focus:ring-2 focus:ring-brand/10 transition-all outline-none"
            >
              {majors.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="hd-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
               <Users size={16} />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-900">Daftar Siswa</p>
               <p className="text-[10px] text-slate-400 font-bold uppercase">{students.length} Siswa</p>
             </div>
          </div>

          <button
            disabled={saving || students.length === 0}
            onClick={handleSave}
            className={`px-6 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
              success ? 'bg-emerald-500 text-white' : 'bg-brand text-white hover:opacity-90'
            }`}
          >
            {saving ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <><CheckCircle2 size={16} /> Tersimpan!</>
            ) : (
              <><Save size={16} /> Simpan Absensi</>
            )}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="hd-table-th">Siswa</th>
                <th className="hd-table-th text-center">Hadir</th>
                <th className="hd-table-th text-center">Sakit</th>
                <th className="hd-table-th text-center">Izin</th>
                <th className="hd-table-th text-center">Alfa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium text-sm italic">Memuat data...</td>
                  </tr>
                ) : students.length === 0 ? (
                   <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium text-sm italic">Tidak ada data.</td>
                  </tr>
                ) : (
                  students.map((student, i) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="hd-table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-[10px]">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-xs leading-none mb-1">{student.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 leading-none">{student.nisn}</p>
                          </div>
                        </div>
                      </td>
                      {['present', 'sick', 'leave', 'absent'].map(status => (
                        <td key={status} className="hd-table-td text-center">
                           <input 
                            type="radio" 
                            name={`att-${student.id}`}
                            checked={attendance[student.id] === status}
                            onChange={() => setAttendance(prev => ({ ...prev, [student.id]: status }))}
                            className={`w-4 h-4 cursor-pointer accent-brand`}
                          />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
