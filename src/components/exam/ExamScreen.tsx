import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../App';
import { db, Exam, Question } from '../../services/firebase';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Timer, 
  Flag, 
  CheckCircle2, 
  AlertCircle,
  School,
  LogOut
} from 'lucide-react';

export default function ExamScreen() {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft > 0 && !finished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, finished]);

  const fetchExam = async () => {
    setLoading(true);
    try {
      // Logic for fetching or mock
       const mockExam: Exam = {
             id: 'exam-1',
             title: 'Ujian Akhir Semester - Dasar Jaringan',
             major: 'TKJ',
             duration: 60,
             questions: Array(30).fill(null).map((_, i) => ({
                id: `q-${i}`,
                question: `${i + 1}. Apa singkatan dari LAN dalam infrastruktur jaringan komputer?`,
                options: ['Local Area Network', 'Large Access Network', 'Loop Access Node', 'Linked Area Network'],
                answer: 0,
                difficulty: i < 15 ? 'easy' : 'hard'
             }))
          };
      setExam(mockExam);
      setTimeLeft(mockExam.duration * 60);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIdx: number) => {
    if (finished) return;
    setAnswers(prev => ({ ...prev, [exam!.questions[currentIdx].id]: optionIdx }));
  };

  const handleSubmit = async () => {
    if (finished || submitting) return;
    setSubmitting(true);
    
    let correctCount = 0;
    exam?.questions.forEach(q => {
      if (answers[q.id] === q.answer) {
        correctCount++;
      }
    });
    
    const finalScore = Math.round((correctCount / exam!.questions.length) * 100);
    setScore(finalScore);

    try {
      await addDoc(collection(db, 'exam_results'), {
        examId: exam!.id,
        studentId: user?.nisn || user?.uid,
        studentName: user?.displayName,
        score: finalScore,
        answers,
        completedAt: serverTimestamp(),
      });
      setFinished(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold text-gray-400">Menyiapkan Ujian...</div>;
  if (!exam) return <div className="h-screen flex items-center justify-center font-bold text-red-500">Ujian tidak ditemukan.</div>;

  const currentQ = exam.questions[currentIdx];

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-white shrink-0">
            <School size={18} />
          </div>
          <div>
             <h1 className="font-bold text-slate-900 leading-tight text-xs md:text-sm truncate max-w-[150px] md:max-w-md">
               {exam.title}
             </h1>
             <p className="text-[9px] uppercase font-bold text-slate-400 tracking-widest leading-none mt-0.5">{exam.major} • KKM 50</p>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
           {!finished && (
             <div className={`flex items-center gap-2.5 px-4 py-1.5 rounded-lg border ${timeLeft < 300 ? 'bg-rose-50 border-rose-100 text-rose-600 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
                <Timer size={16} />
                <span className="font-mono font-bold text-lg">{formatTime(timeLeft)}</span>
             </div>
           )}
           <button 
            onClick={() => navigate('/app/ujian')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-wider"
           >
             <LogOut size={16} /> <span className="hidden sm:inline">Keluar</span>
           </button>
        </div>
      </header>

      {finished ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-xl shadow-xl border border-slate-200 text-center max-w-md w-full"
          >
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6 ${score >= 50 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
               <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Ujian Selesai!</h2>
            <p className="text-[11px] text-slate-500 font-medium mb-8 leading-relaxed">
              Terima kasih telah mengerjakan ujian dengan jujur. Hasil Anda telah tersimpan secara otomatis di sistem portal akademik.
            </p>
            
            <div className="bg-slate-50 rounded-lg p-6 mb-8 border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nilai Akhir</p>
               <div className={`text-5xl font-black mb-3 ${score >= 50 ? 'text-emerald-600' : 'text-rose-600'}`}>
                 {score}
               </div>
               <div className={`inline-flex px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${score >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                 {score >= 50 ? 'Lulus (KKM 50)' : 'Tidak Lulus'}
               </div>
            </div>

            <button 
              onClick={() => navigate('/app/ujian')}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:opacity-90 transition-all text-xs uppercase tracking-wider shadow-sm"
            >
              Kembali ke Beranda
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row pb-20 lg:pb-0 h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Question View */}
          <div className="flex-1 p-4 lg:p-10 overflow-y-auto bg-slate-50">
            <div className="max-w-3xl mx-auto space-y-6">
               <div className="flex items-center justify-between">
                 <div className="px-3 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                   Soal {currentIdx + 1} / {exam.questions.length}
                 </div>
                 <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${currentQ.difficulty === 'hard' ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                   {currentQ.difficulty === 'hard' ? 'Sulit' : 'Mudah'}
                 </div>
               </div>

               <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-relaxed bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                 {currentQ.question}
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {currentQ.options.map((option, i) => (
                   <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-4 text-left rounded-lg border transition-all flex items-center gap-3 ${
                      answers[currentQ.id] === i 
                        ? 'border-brand bg-brand/5 ring-2 ring-brand/5' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                   >
                     <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm transition-colors shrink-0 ${
                       answers[currentQ.id] === i ? 'bg-brand text-white' : 'bg-slate-100 text-slate-400 font-mono'
                     }`}>
                       {String.fromCharCode(65 + i)}
                     </div>
                     <span className={`font-bold text-[13px] ${answers[currentQ.id] === i ? 'text-slate-900' : 'text-slate-600'}`}>
                       {option}
                     </span>
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Question Grid Sidebar */}
          <div className="w-full lg:w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto hidden lg:block">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-2 mb-8">
               {exam.questions.map((q, i) => (
                 <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`aspect-square rounded-md flex items-center justify-center text-[10px] font-bold transition-all border ${
                    currentIdx === i 
                      ? 'border-brand bg-brand text-white' 
                      : answers[q.id] !== undefined
                        ? 'border-brand/40 bg-brand/5 text-brand shadow-sm'
                        : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                  }`}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg space-y-3 border border-slate-100">
               <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 <span>Progres</span>
                 <span>{Math.round((Object.keys(answers).length / exam.questions.length) * 100)}%</span>
               </div>
               <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand transition-all duration-300" 
                    style={{ width: `${(Object.keys(answers).length / exam.questions.length) * 100}%` }}
                  />
               </div>
               <p className="text-[9px] text-slate-400 font-bold uppercase leading-relaxed">
                 Auto-save aktif.
               </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-6 py-2.5 bg-slate-900 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm text-xs uppercase tracking-wider"
            >
              {submitting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>SELESAI UJIAN <Flag size={14} /></>
              )}
            </button>
          </div>

          {/* Mobile Navigation bar */}
          <div className="fixed bottom-0 left-0 w-full lg:hidden bg-white border-t border-slate-200 p-3 grid grid-cols-3 gap-3 shadow-inner">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={handleSubmit}
              className="bg-brand text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              Selesai
            </button>

            <button 
              disabled={currentIdx === exam.questions.length - 1}
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="p-2.5 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
