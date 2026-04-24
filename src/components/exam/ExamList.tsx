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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Ujian Online</h2>
        <p className="text-gray-500 font-medium tracking-tight">Daftar ujian tersedia untuk dikerjakan hari ini.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium">Memuat daftar ujian...</div>
        ) : exams.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 font-medium italic">Tidak ada ujian aktif untuk Anda.</div>
        ) : (
          exams.map((exam) => (
            <motion.div
              key={exam.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {exam.major}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug flex-1">
                {exam.title}
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <Clock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Durasi</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{exam.duration} Menit</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <BookOpen size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight">Soal</span>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{exam.questions.length} Butir</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/ujian/${exam.id}`)}
                className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors group"
              >
                Kerjakan Sekarang <Play size={18} className="fill-current group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 shrink-0 flex items-center justify-center">
          <AlertCircle size={20} />
        </div>
        <div>
           <h4 className="font-bold text-orange-900 text-sm mb-1">Petunjuk Ujian</h4>
           <p className="text-xs text-orange-700/80 font-medium leading-relaxed">
             Pastikan koneksi internet stabil sebelum memulai. Sekali dimulai, waktu akan terus berjalan meskipun Anda menutup browser. Nilai KKM untuk semua mata pelajaran adalah 50.
           </p>
        </div>
      </div>
    </div>
  );
}
