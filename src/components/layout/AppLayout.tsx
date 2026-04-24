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
    { name: 'Dashboard', path: '/app', icon: <LayoutDashboard size={20} />, roles: ['admin', 'guru', 'tenaga_kependidikan', 'siswa'] },
    { name: 'Absensi Mandiri', path: '/app/absensi-karyawan', icon: <UserCheck size={20} />, roles: ['admin', 'guru', 'tenaga_kependidikan'] },
    { name: 'Absensi Siswa', path: '/app/absensi-siswa', icon: <Users size={20} />, roles: ['admin', 'guru'] },
    { name: 'Rekap Absensi', path: '/app/rekap-absensi', icon: <BarChart3 size={20} />, roles: ['admin', 'guru', 'tenaga_kependidikan'] },
    { name: 'Data Siswa', path: '/app/data-siswa', icon: <UserPlus size={20} />, roles: ['admin'] },
    { name: 'User Management', path: '/app/user-management', icon: <Settings size={20} />, roles: ['admin'] },
    { name: 'Ujian Online', path: '/app/ujian', icon: <PenTool size={20} />, roles: ['siswa', 'admin', 'guru'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            className="fixed lg:static w-[240px] h-full bg-brand text-white z-50 flex flex-col shrink-0"
          >
            <div className="p-6 h-16 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight">SMK PUU</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/60">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
              {filteredMenu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                   end={item.path === '/app'}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all border-l-4 ${
                      isActive 
                        ? 'bg-white/10 text-white border-brand-light' 
                        : 'text-white/70 border-transparent hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="shrink-0 scale-90">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </div>

            <div className="p-6 mt-auto opacity-60">
              <p className="text-[11px] leading-relaxed">
                Tangerang Selatan<br />
                SMK Prima Unggul © 2026
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
               <button onClick={() => setIsSidebarOpen(true)} className="text-slate-500 hover:text-slate-900">
                 <Menu size={20} />
               </button>
            )}
            <div>
              <h1 className="font-bold text-slate-900 leading-none mb-1">
                {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <p className="text-xs font-bold text-slate-900">{user?.displayName}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase">{user?.role?.replace('_', ' ')}</p>
               </div>
               <button 
                onClick={handleLogout}
                className="px-4 py-1.5 border border-red-500 text-red-500 rounded-md text-[11px] font-bold uppercase tracking-wider hover:bg-red-50 transition-colors"
               >
                 LOGOUT
               </button>
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
