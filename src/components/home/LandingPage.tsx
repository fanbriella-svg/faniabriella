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
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-lg flex items-center justify-center text-white font-bold">PU</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">SMK Prima Unggul</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 bg-brand text-white rounded-full font-medium hover:bg-brand/90 transition-colors">
              Login Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6">
              <MapPin size={14} /> Tangerang Selatan
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6">
              Membangun Masa Depan <span className="text-brand">Cemerlang</span> Bersama Kami.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              SMK Prima Unggul merupakan lembaga pendidikan kejuruan yang berfokus pada pengembangan kompetensi siswa yang relevan dengan kebutuhan industri.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/login" className="px-8 py-4 bg-brand text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-brand/20 transition-all">
                Mulai Belajar Sekarang <ChevronRight size={20} />
              </Link>
              <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">
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
            <div className="aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden">
               <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" 
                alt="Students" 
                className="w-full h-full object-cover grayscale-[0.2]"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Float Cards */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-[200px]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <CheckCircle2 size={24} />
                </div>
                <span className="font-bold text-gray-900">Terakreditasi A</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">Standar kualitas pendidikan nasional terbaik.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Siswa Aktif', value: '1,200+', icon: <Users /> },
            { label: 'Tenaga Pengajar', value: '85+', icon: <GraduationCap /> },
            { label: 'Lulusan Terserap', value: '92%', icon: <CheckCircle2 /> },
            { label: 'Mitra Industri', value: '50+', icon: <BookOpen /> },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Majors */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Jurusan Unggulan</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Kami menyediakan 6 kompetensi keahlian yang dirancang untuk menghasilkan lulusan yang siap kerja dan mandiri.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majors.map((major, i) => (
              <motion.div
                key={major.code}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-brand group-hover:text-white transition-colors mb-6 font-bold">
                  {major.code}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{major.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{major.desc}</p>
                <button className="text-brand font-bold text-sm flex items-center gap-1">
                  Lihat Detail <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 border-t border-white/10 pt-12 text-center md:text-left md:flex justify-between items-center text-sm">
          <div className="mb-6 md:mb-0">
            <div className="font-bold text-lg mb-2 flex items-center gap-2">
              <div className="w-6 h-6 bg-brand rounded flex items-center justify-center text-white text-xs">PU</div>
              SMK Prima Unggul
            </div>
            <p className="text-gray-400">Jl. Raya Puspiptek, Tangerang Selatan, Banten.</p>
          </div>
          <p className="text-gray-500">© 2026 SMK Prima Unggul. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
