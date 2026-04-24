import React, { useState, useEffect } from 'react';
import { db, auth } from '../../services/firebase';
import { collection, query, getDocs, doc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Shield, 
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    displayName: '',
    email: '',
    role: 'siswa',
    major: 'TKJ',
    nisn: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'));
      const snap = await getDocs(q);
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for adding user (In real app, use a Cloud Function)
    try {
       await addDoc(collection(db, 'users'), {
         ...newUser,
         uid: `mock-${Date.now()}`
       });
       setShowAddModal(false);
       fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Hapus user ini selamanya?')) {
      await deleteDoc(doc(db, 'users', id));
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.nisn?.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-[11px] text-slate-500 font-medium">Kelola akun guru, staff, dan siswa SMK Prima Unggul.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2 bg-brand text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-sm hover:opacity-90 transition-all uppercase tracking-wider"
        >
          <UserPlus size={16} /> TAMBAH USER
        </button>
      </div>

      <div className="hd-card">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Cari user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand/10 transition-all outline-none"
            />
          </div>
          <button className="px-3 py-2 text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Filter size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="hd-table-th">Identitas</th>
                <th className="hd-table-th">Role</th>
                <th className="hd-table-th">Jurusan</th>
                <th className="hd-table-th text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic text-sm">Memuat data...</td></tr>
              ) : filteredUsers.map((user, i) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="hd-table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200 uppercase text-[10px]">
                        {user.displayName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-xs mb-0.5">{user.displayName}</p>
                        <p className="text-[10px] font-mono text-slate-400 leading-none">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hd-table-td">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                       <Shield size={10} /> {user.role?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="hd-table-td">
                    <span className="text-[11px] font-bold text-slate-600">{user.major || '-'}</span>
                  </td>
                  <td className="hd-table-td">
                     <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-brand transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(user.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={14} /></button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl w-full max-w-lg shadow-xl relative z-10 overflow-hidden"
            >
               <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-sm font-bold text-slate-900">Tambah User Baru</h3>
                 <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={20} /></button>
               </div>
               <form onSubmit={handleAddUser} className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Nama Lengkap</label>
                      <input type="text" onChange={e => setNewUser({...newUser, displayName: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Email Sekolah</label>
                      <input type="email" onChange={e => setNewUser({...newUser, email: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Password</label>
                      <input type="password" onChange={e => setNewUser({...newUser, password: e.target.value})} required className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Role Akses</label>
                      <select onChange={e => setNewUser({...newUser, role: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all appearance-none cursor-pointer">
                        <option value="siswa">Siswa</option>
                        <option value="guru">Guru</option>
                        <option value="tenaga_kependidikan">Staff / Kependidikan</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Jurusan</label>
                      <select onChange={e => setNewUser({...newUser, major: e.target.value})} className="w-full px-3 py-2 bg-slate-50 rounded-lg font-bold text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand/10 transition-all appearance-none cursor-pointer">
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
                    <button type="submit" className="flex-1 py-2.5 bg-brand text-white font-bold rounded-lg text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.98] transition-all">
                      Simpan User
                    </button>
                    <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg text-xs uppercase tracking-wider hover:bg-slate-200 transition-all">
                      Batal
                    </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
