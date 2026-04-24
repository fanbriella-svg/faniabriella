import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../App';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { 
  LayoutDashboard, 
  UserCheck, 
  Users, 
  BarChart3, 
  UserPlus, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  PenTool
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function AppLayout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/app', icon: <LayoutDashboard size={18} />, roles: ['admin', 'guru', 'tenaga_kependidikan', 'siswa'] },
    { name: 'Presensi Mandiri', path: '/app/absensi-karyawan', icon: <UserCheck size={18} />, roles: ['admin', 'guru', 'tenaga_kependidikan'] },
    { name: 'Presensi Siswa', path: '/app/absensi-siswa', icon: <Users size={18} />, roles: ['admin', 'guru'] },
    { name: 'Rekap Absensi', path: '/app/rekap-absensi', icon: <BarChart3 size={18} />, roles: ['admin', 'guru', 'tenaga_kependidikan'] },
    { name: 'Data Siswa', path: '/app/data-siswa', icon: <UserPlus size={18} />, roles: ['admin'] },
    { name: 'User Control', path: '/app/user-management', icon: <Settings size={18} />, roles: ['admin'] },
    { name: 'Ujian Online', path: '/app/ujian', icon: <PenTool size={18} />, roles: ['siswa', 'admin', 'guru'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-surface overflow-hidden font-sans">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            className="fixed lg:static w-[220px] h-full bg-slate-900 text-white z-50 flex flex-col shrink-0 border-r border-slate-800"
          >
            <div className="p-6 h-14 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-brand rounded flex items-center justify-center text-white text-[10px] font-black">PU</div>
                <span className="font-bold text-sm uppercase tracking-tighter">SMK PU PORTAL</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <p className="px-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Navigation</p>
              <div className="space-y-0.5">
                {filteredMenu.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                     end={item.path === '/app'}
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-6 py-2.5 text-[11px] font-bold uppercase tracking-wider transition-all border-r-[3px] ${
                        isActive 
                          ? 'bg-brand/10 text-brand border-brand' 
                          : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white'
                      }`
                    }
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="p-6 mt-auto border-t border-slate-800">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 font-bold text-xs">
                    {user?.displayName?.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-white truncate">{user?.displayName}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase truncate">{user?.role?.replace('_', ' ')}</p>
                  </div>
               </div>
               <button 
                onClick={handleLogout}
                className="w-full py-2 bg-rose-500/10 text-rose-500 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
               >
                 <LogOut size={12} /> Sign Out
               </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-40 shadow-sm">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
               <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-900 border border-slate-200 p-1 rounded transition-colors">
                 <Menu size={18} />
               </button>
            )}
            <div>
              <h1 className="font-bold text-slate-900 leading-none mb-1 text-sm uppercase tracking-tight">
                {menuItems.find(i => i.path === location.pathname)?.name || 'DASHBOARD'}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="w-8 h-8 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
               <Bell size={16} />
             </button>
             <div className="h-8 w-px bg-slate-200" />
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-slate-900">{user?.displayName}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">{user?.role?.replace('_', ' ')}</p>
               </div>
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
