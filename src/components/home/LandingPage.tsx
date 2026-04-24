import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const majors = [
    { code: 'TKJ', name: 'Teknik Komputer & Jaringan', desc: 'Membangun infrastruktur jaringan dan sistem IT modern.' },
    { code: 'DKV', name: 'Desain Komunikasi Visual', desc: 'Mengeksplorasi kreativitas melalui desain grafis dan multimedia.' },
    { code: 'AK', name: 'Akuntansi', desc: 'Manajemen keuangan dan pembukuan profesional.' },
    { code: 'BC', name: 'Broadcasting', desc: 'Produksi konten media televisi dan radio kreatif.' },
    { code: 'MPLB', name: 'Manajemen Perkantoran', desc: 'Administrasi perkantoran dan manajemen bisnis.' },
    { code: 'BD', name: 'Bisnis Digital', desc: 'Pemasaran online dan pengelolaan e-commerce.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white font-bold text-sm">PU</div>
            <span className="font-bold text-lg tracking-tight text-slate-900">SMK Prima Unggul</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-sm">
              Login Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/5 text-brand text-[10px] font-bold uppercase tracking-wider mb-6 border border-brand/10">
              <MapPin size={12} /> Tangerang Selatan
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
              Membangun Masa Depan <span className="text-brand">Cemerlang</span> Bersama Kami.
            </h1>
            <p className="text-base text-slate-500 font-medium mb-8 max-w-lg leading-relaxed">
              SMK Prima Unggul merupakan lembaga pendidikan kejuruan yang berfokus pada pengembangan kompetensi siswa yang relevan dengan kebutuhan industri.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-6 py-3 bg-brand text-white rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm text-xs uppercase tracking-wider">
                Mulai Belajar Sekarang <ChevronRight size={16} />
              </Link>
              <button className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-lg font-bold hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider">
                Profil Sekolah
              </button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
               <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                alt="Students" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Float Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 max-w-[180px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={20} />
                </div>
                <span className="font-bold text-slate-900 text-xs">Terakreditasi A</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Standar kualitas pendidikan nasional terbaik.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Siswa Aktif', value: '1,200+', icon: <Users size={18} /> },
            { label: 'Tenaga Pengajar', value: '85+', icon: <GraduationCap size={18} /> },
            { label: 'Lulusan Terserap', value: '92%', icon: <CheckCircle2 size={18} /> },
            { label: 'Mitra Industri', value: '50+', icon: <BookOpen size={18} /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 text-brand mb-4 shadow-sm">
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Majors */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Jurusan Unggulan</h2>
            <p className="text-slate-500 text-sm font-medium max-w-2xl mx-auto">Kami menyediakan 6 kompetensi keahlian yang dirancang untuk menghasilkan lulusan yang siap kerja dan mandiri.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {majors.map((major, i) => (
              <motion.div
                key={major.code}
                whileHover={{ y: -2 }}
                className="p-8 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-brand group-hover:text-white transition-colors mb-6 font-bold text-xs">
                  {major.code}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-3">{major.name}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-6">{major.desc}</p>
                <button className="text-brand font-bold text-xs flex items-center gap-1 uppercase tracking-wider">
                  Lihat Detail <ChevronRight size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <div className="font-bold text-base mb-2 flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 bg-brand rounded flex items-center justify-center text-white text-[10px]">PU</div>
              SMK Prima Unggul
            </div>
            <p className="text-slate-400 text-xs font-medium">Jl. Raya Puspiptek, Tangerang Selatan, Banten.</p>
          </div>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">© 2026 SMK Prima Unggul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
