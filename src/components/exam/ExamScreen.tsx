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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shrink-0">
            <School size={20} />
          </div>
          <div>
             <h1 className="font-extrabold text-gray-900 leading-tight text-sm md:text-base truncate max-w-[200px] md:max-w-md">
               {exam.title}
             </h1>
             <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{exam.major} • KKM 50</p>
          </div>
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
           {!finished && (
             <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl border ${timeLeft < 300 ? 'bg-red-50 border-red-100 text-red-600 animate-pulse' : 'bg-gray-50 border-gray-100 text-gray-900'}`}>
                <Timer size={20} />
                <span className="font-mono font-bold text-xl">{formatTime(timeLeft)}</span>
             </div>
           )}
           <button 
            onClick={() => navigate('/app/ujian')}
            className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
           >
             <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
           </button>
        </div>
      </header>

      {finished ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-10 md:p-16 rounded-[3rem] shadow-xl border border-gray-100 text-center max-w-xl w-full"
          >
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 ${score >= 50 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
               <CheckCircle2 size={48} />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Ujian Selesai!</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed">
              Terima kasih telah mengerjakan ujian dengan jujur. Hasil Anda telah tersimpan secara otomatis di sistem.
            </p>
            
            <div className="bg-gray-50 rounded-3xl p-8 mb-10">
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Nilai Akhir</p>
               <div className={`text-7xl font-black mb-4 ${score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                 {score}
               </div>
               <div className={`inline-flex px-4 py-2 rounded-full text-xs font-black uppercase tracking-tighter ${score >= 50 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                 {score >= 50 ? 'Lulus (KKM 50)' : 'Tidak Lulus'}
               </div>
            </div>

            <button 
              onClick={() => navigate('/app/ujian')}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors"
            >
              Kembali ke Beranda
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row pb-20 lg:pb-0 h-full overflow-hidden">
          {/* Question View */}
          <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-8">
               <div className="flex items-center justify-between">
                 <div className="px-4 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                   Soal {currentIdx + 1} dari {exam.questions.length}
                 </div>
                 <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${currentQ.difficulty === 'hard' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                   {currentQ.difficulty === 'hard' ? 'Sulit' : 'Mudah'}
                 </div>
               </div>

               <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
                 {currentQ.question}
               </h2>

               <div className="space-y-4">
                 {currentQ.options.map((option, i) => (
                   <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`w-full p-5 text-left rounded-2xl border-2 transition-all flex items-center gap-4 ${
                      answers[currentQ.id] === i 
                        ? 'border-brand bg-brand/5 ring-4 ring-brand/5' 
                        : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                   >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-colors ${
                       answers[currentQ.id] === i ? 'bg-brand text-white' : 'bg-gray-50 text-gray-400'
                     }`}>
                       {String.fromCharCode(65 + i)}
                     </div>
                     <span className={`font-bold text-sm md:text-base ${answers[currentQ.id] === i ? 'text-gray-900' : 'text-gray-600'}`}>
                       {option}
                     </span>
                   </button>
                 ))}
               </div>
            </div>
          </div>

          {/* Question Grid Sidebar */}
          <div className="w-full lg:w-96 bg-white border-l border-gray-100 p-8 overflow-y-auto hidden lg:block">
            <h3 className="font-extrabold text-gray-900 mb-6">Navigasi Soal</h3>
            <div className="grid grid-cols-5 gap-3 mb-12">
               {exam.questions.map((q, i) => (
                 <button
                  key={q.id}
                  onClick={() => setCurrentIdx(i)}
                  className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-all border-2 ${
                    currentIdx === i 
                      ? 'border-brand bg-brand text-white' 
                      : answers[q.id] !== undefined
                        ? 'border-brand/40 bg-brand/5 text-brand'
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                  }`}
                 >
                   {i + 1}
                 </button>
               ))}
            </div>

            <div className="p-6 bg-gray-50 rounded-3xl space-y-4">
               <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                 <span>Progres</span>
                 <span>{Math.round((Object.keys(answers).length / exam.questions.length) * 100)}%</span>
               </div>
               <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand transition-all duration-300" 
                    style={{ width: `${(Object.keys(answers).length / exam.questions.length) * 100}%` }}
                  />
               </div>
               <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                 Jawaban akan tersimpan otomatis setiap kali Anda memilih opsi.
               </p>
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mt-8 py-4 bg-gray-900 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-lg"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Selesaikan Ujian <Flag size={18} /></>
              )}
            </button>
          </div>

          {/* Mobile Navigation bar */}
          <div className="fixed bottom-0 left-0 w-full lg:hidden bg-white border-t border-gray-100 p-4 grid grid-cols-3 gap-4">
            <button 
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx(prev => prev - 1)}
              className="p-3 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 disabled:opacity-50"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={handleSubmit}
              className="bg-brand text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-brand/20"
            >
              Selesai
            </button>

            <button 
              disabled={currentIdx === exam.questions.length - 1}
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="p-3 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 disabled:opacity-50"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
