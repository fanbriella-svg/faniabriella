import { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { db, Exam } from '../../services/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { BookOpen, Clock, FileText, ChevronRight, AlertCircle, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function ExamList() {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, [user]);

  const fetchExams = async () => {
    setLoading(true);
    try {
      // For demo, if no exams in DB, we'll show sample ones
      const q = query(collection(db, 'exams'), where('major', 'in', [user?.major || 'TKJ', 'Common']));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Exam));
      
      if (data.length === 0) {
        // Mock data
        setExams([
          {
             id: 'exam-1',
             title: 'Ujian Akhir Semester - Dasar Jaringan',
             major: 'TKJ',
             duration: 60,
             questions: Array(30).fill(null).map((_, i) => ({
                id: `q-${i}`,
                question: `Ini adalah pertanyaan nomor ${i + 1}. Apa hasil dari 2 + 2?`,
                options: ['3', '4', '5', '6'],
                answer: 1,
                difficulty: i < 15 ? 'easy' : 'hard'
             }))
          },
          {
            id: 'exam-2',
            title: 'Kuis Mingguan - Desain Grafis',
            major: 'DKV',
            duration: 30,
            questions: []
          }
        ]);
      } else {
        setExams(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 leading-tight">Ujian Online</h2>
        <p className="text-[11px] text-slate-500 font-medium tracking-tight">Daftar ujian tersedia untuk dikerjakan hari ini.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium italic text-sm">Memuat daftar ujian...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 font-medium italic text-sm">Tidak ada ujian aktif.</div>
        ) : (
          exams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -2 }}
              className="hd-card p-6 flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100">
                  {exam.major}
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-4 leading-snug flex-1">
                {exam.title}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <Clock size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-tight">Durasi</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">{exam.duration} Min</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                    <BookOpen size={12} />
                    <span className="text-[9px] font-bold uppercase tracking-tight">Soal</span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">{exam.questions.length} Butir</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/ujian/${exam.id}`)}
                className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all group text-xs uppercase tracking-wider"
              >
                Kerjakan <Play size={14} className="fill-current" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 shrink-0 flex items-center justify-center">
          <AlertCircle size={16} />
        </div>
        <div>
           <h4 className="font-bold text-orange-900 text-xs mb-1">Petunjuk Ujian</h4>
           <p className="text-[11px] text-orange-700/80 font-medium leading-relaxed">
             Pastikan koneksi internet stabil sebelum memulai. Sekali dimulai, waktu akan terus berjalan meskipun Anda menutup browser. Nilai KKM untuk semua mata pelajaran adalah 50.
           </p>
        </div>
      </div>
    </div>
  );
}
