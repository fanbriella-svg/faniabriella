import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { UserPlus, Search, Trash2, Filter, Download, ChevronDown, Save, CheckCircle2, Users, XCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function StudentManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', nisn: '', major: 'TKJ', class: 'X' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'students'));
      const snap = await getDocs(q);
      setStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDoc(collection(db, 'students'), newStudent);
    setShowAdd(false);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Hapus data siswa ini?')) {
      await deleteDoc(doc(db, 'students', id));
      fetchStudents();
    }
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Siswa</h2>
          <p className="text-[11px] text-slate-500 font-medium">Master data seluruh siswa SMK Prima Unggul.</p>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg flex items-center gap-2 shadow-sm text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">
            <Download size={14} /> EXPORT
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="px-6 py-2 bg-brand text-white font-bold rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 active:scale-95 transition-all text-xs uppercase tracking-wider"
          >
            <UserPlus size={16} /> TAMBAH SISWA
          </button>
        </div>
      </div>

      <div className="hd-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
              type="text" 
              placeholder="Cari siswa..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand/10 transition-all outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="px-3 py-2 bg-slate-50 text-slate-400 border border-slate-200 rounded-lg hover:text-slate-900 transition-colors"><Filter size={16} /></button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="hd-table-th">Nama / NISN</th>
                <th className="hd-table-th text-center">Kelas</th>
                <th className="hd-table-th text-center">Jurusan</th>
                <th className="hd-table-th text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic text-sm">Memuat data...</td></tr>
              ) : filtered.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="hd-table-td">
                     <p className="font-bold text-slate-800 text-xs mb-0.5">{s.name}</p>
                     <p className="text-[10px] font-mono font-bold text-slate-400 leading-none">{s.nisn}</p>
                  </td>
                  <td className="hd-table-td text-center font-bold text-xs text-slate-700">{s.class}</td>
                  <td className="hd-table-td text-center">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">{s.major}</span>
                  </td>
                  <td className="hd-table-td">
                    <div className="flex items-center justify-center gap-2">
                       <button onClick={() => handleDelete(s.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-xl w-full max-w-md shadow-xl relative z-10 overflow-hidden"
           >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Input Data Siswa</h3>
                <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
              </div>
              <form onSubmit={handleAdd} className="p-6 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Nama Lengkap</label>
                     <input type="text" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                   </div>
                   <div className="col-span-2">
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">NISN</label>
                     <input type="text" required value={newStudent.nisn} onChange={e => setNewStudent({...newStudent, nisn: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Kelas</label>
                      <select value={newStudent.class} onChange={e => setNewStudent({...newStudent, class: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all appearance-none cursor-pointer">
                        <option value="X">X</option>
                        <option value="XI">XI</option>
                        <option value="XII">XII</option>
                      </select>
                   </div>
                   <div>
                     <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Jurusan</label>
                      <select value={newStudent.major} onChange={e => setNewStudent({...newStudent, major: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all appearance-none cursor-pointer">
                        <option value="TKJ">TKJ</option>
                        <option value="DKV">DKV</option>
                        <option value="AK">AK</option>
                        <option value="BC">BC</option>
                        <option value="MPLB">MPLB</option>
                        <option value="BD">BD</option>
                      </select>
                   </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                   <button type="submit" className="flex-1 py-2.5 bg-brand text-white font-bold rounded-lg text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">Simpan Data</button>
                   <button type="button" onClick={() => setShowAdd(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-slate-200 transition-all">Batal</button>
                 </div>
              </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}
