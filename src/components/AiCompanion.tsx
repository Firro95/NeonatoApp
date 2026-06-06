import React, { useState, useEffect, useRef } from 'react';
import { BabyProfile, ChatMessage, GrowthLog, PediatricVisit } from '../types';
import { Bot, Send, Sparkles, BrainCircuit, Loader2, RefreshCw, AlertCircle, Info, Stethoscope } from 'lucide-react';

interface AiCompanionProps {
  gender: 'male' | 'female';
  profile: BabyProfile | null;
  logs: GrowthLog[];
  visits: PediatricVisit[];
  achievedIds: string[];
}

export default function AiCompanion({ gender, profile, logs, visits, achievedIds }: AiCompanionProps) {
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Ciao papà o mamma! Sono il tuo Assistente Pediatrico Virtuale AI 👶✨.
Posso rispondere a tutte le tue domande sullo svezzamento (pappe), sui ritmi di sonno/nanna, sulla gestione delle coliche neonatali, sui vaccini o su giochi utili per sviluppare le tappe psicomotorie del tuo piccolo.

*Come posso esserti utile oggi? Puoi chiedermi dubbi o consigli.*`,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Tips State
  const [aiTips, setAiTips] = useState<string[]>([]);
  const [isTipsLoading, setIsTipsLoading] = useState(false);
  const [tipsError, setTipsError] = useState('');
  const [hasApiKey, setHasApiKey] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const themeColor = gender === 'male' ? 'text-[#4A5D4E]' : 'text-[#D79A81]';
  const sideColorBorder = gender === 'male' ? 'border-l-[#4A5D4E]' : 'border-l-[#D79A81]';
  const activeBtnTheme = 'bg-[#4A5D4E] hover:bg-[#3C4D3F] border-[#4A5D4E] text-white';

  // Calculate baby age in months
  const getBabyAgeMonths = () => {
    if (!profile) return 0;
    const birth = new Date(profile.birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 30.4375; // average days in month
  };

  const babyAgeMonths = getBabyAgeMonths();

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatLoading]);

  // Fetch Personalized AI Tips on component mount or data update
  const fetchAiTips = async () => {
    if (!profile) return;
    setIsTipsLoading(true);
    setTipsError('');

    const latestLog = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).pop();
    const completedVisits = visits.filter(v => v.done).map(v => v.title);

    try {
      const res = await fetch('/api/gemini/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          gender: profile.gender,
          ageMonths: babyAgeMonths,
          weight: latestLog ? latestLog.weight : profile.birthWeight,
          height: latestLog ? latestLog.height : profile.birthHeight,
          headCirc: latestLog ? latestLog.headCirc : profile.birthHeadCirc,
          achievedMilestones: achievedIds,
          completedVisits
        })
      });

      if (!res.ok) {
        throw new Error("Errore del server durante il recupero dei consigli.");
      }

      const data = await res.json();
      if (data.success === false && data.error) {
        setHasApiKey(false);
      }
      if (data.tips && Array.isArray(data.tips)) {
        setAiTips(data.tips);
      } else {
        throw new Error("Formato risposta non valido.");
      }
    } catch (err: any) {
      console.error(err);
      setTipsError("Impossibile caricare i consigli personalizzati dall'AI in tempo reale.");
      // Fallback Static recommendations tailored to age
      setAiTips(getFallbackTipsForAge(babyAgeMonths));
    } finally {
      setIsTipsLoading(false);
    }
  };

  // Run on mount or when profile details shift
  useEffect(() => {
    fetchAiTips();
  }, [profile?.birthDate, logs.length, visits.length, achievedIds.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsgText = chatInput.trim();
    setChatInput('');

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          chatHistory: messages,
          babyContext: profile ? {
            name: profile.name,
            gender: profile.gender,
            birthDate: profile.birthDate,
            ageMonths: babyAgeMonths,
            currentWeight: logs[logs.length - 1]?.weight || profile.birthWeight,
            currentHeight: logs[logs.length - 1]?.height || profile.birthHeight,
          } : undefined
        })
      });

      if (!res.ok) {
        throw new Error("Errore di rete");
      }

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.reply || "Mi spiace, non sono riuscito a elaborare una risposta. Riprova più tardi.",
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);

    } catch (error) {
      console.error(error);
      const errReply: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "Ouch! Ho riscontrato qualche difficoltà tecnica a connettermi con l'intelligenza centrale. Assicurati che il server sia attivo o riprova tra pochi secondi.",
        timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errReply]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper dictionary of standard static developmental tips by age (Italy standard guidelines)
  const getFallbackTipsForAge = (months: number) => {
    if (months <= 2) {
      return [
        "Incentiva il Tummy Time posizionando il neonato a pancia in giù per 2-3 minuti dopo ogni pisolino diurno per rinforzare collo e schiena.",
        "Favorisci la messa a fuoco visiva stringendolo vicino al tuo viso a circa 25cm di distanza ed emettendo dondolii simmetrici.",
        "Parla dolcemente al piccolo durante l'allattamento o il cambio pannolino; la tua voce è la sua principale sorgente di sicurezza.",
        "Controlla frequentemente il benessere posteriore e asseconda un allattamento a richiesta esclusivo o artificiale prescritto."
      ];
    } else if (months <= 4) {
      return [
        "Disponi sonagli colorati e anelli da dentizione davanti alle sue mani per incentivare ad allungare spontaneamente la mano ed afferrare.",
        "Rispondi ad ogni suo vocalizzo imitando lo stesso suono; crei così la struttura neuronale per i turni di parola comunicativi.",
        "Fai piccoli esercizi guidati piegando gentilmente le gambine verso l'addome a 'bicicletta' per favorire l'eliminazione dell'aria intestinale.",
        "Stabilirai la routine della nanna serale mantenendo orari regolari di bagno rilassante e letture a bassa voce."
      ];
    } else if (months <= 6) {
      return [
        "Svezzamento imminente: se mostra interesse attivo al vostro cibo e siede dritto sostenuto, parlane con il Pediatra al 4° Bilancio.",
        "Fornisci libri da bagnetto in plastica morbida o specchietti infrangibili per incentivare il rotolamento sul tappeto di tessuto.",
        "Evita l'uso prolungato di sdraiette o seggiolini; un ampio tappeto con giochi stimola molto meglio l'iniziativa fisica.",
        "Pronuncia filastrocche ritmate sillabando chiaro parole comuni (Mamma, Papà, Pappa) per sintonizzare la lallazione."
      ];
    } else if (months <= 9) {
      return [
        "Svezzamento: proponi pappe bilanciate con consistenze diverse e introduci gradualmente piccoli bocconi morbidi se mastica bene.",
        "Nascondi un giocattolo sotto una coperta per farglielo cercare; promuovi la comprensione della 'permanenza degli oggetti'.",
        "Metti in sicurezza tutte le prese della corrente della stanza, dacché inizierà a spostarsi o dondolarsi a quattro zampe.",
        "Saluta sempre con calma prima di uscire dalla stanza per alleviare l'ansia da separazione tipica di questa fase cognitiva."
      ];
    } else {
      return [
        "Favorisci il cammino scalzo in casa per sviluppare l'equilibrio dei piedini e la percezione del terreno.",
        "Incoraggia l'indicazione (pointing): guarda sempre nella direzione mostrata dal neonato e pronuncia correttamente il nome dell'oggetto.",
        "Introduci piccoli bicchieri con doppi manici per fargli imparare a bere l'acqua autonomamente bandendo i vecchi biberon graduati.",
        "Leggete storie illustrate insieme ogni sera, incoraggiandolo a girare le pagine spesse e ripetere suoni onomatopeici."
      ];
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT BLOCK: AI Growth Tips Generator on each milestone */}
      <div className="lg:col-span-5 space-y-5">
        <div className="bg-[#E8E4D9] border border-[#D1CEC4] rounded-none p-5 shadow-sm relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <span className="text-[9px] font-black tracking-widest bg-white border border-[#D1CEC4] text-[#4A5D4E] px-2 py-0.5 rounded-none uppercase">
              Consigli Personalizzati AI
            </span>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-1.5 text-[#4A5D4E] uppercase tracking-wide">
                <Sparkles size={16} className="text-[#D79A81] shrink-0" />
                Tips di Sviluppo Personalizzati
              </h3>
              <button
                onClick={fetchAiTips}
                disabled={isTipsLoading}
                className="p-1 hover:bg-[#F2F0E9] border border-[#D1CEC4] rounded-none bg-white text-[#4A5D4E] transition cursor-pointer"
                title="Sincronizza consigli"
              >
                <RefreshCw size={13} className={isTipsLoading ? 'animate-spin' : ''} />
              </button>
            </div>
            <p className="text-xs text-[#2C2C2C] leading-relaxed font-medium">
              Analisi di <b className="text-[#4A5D4E]">{profile?.name}</b> ({babyAgeMonths.toFixed(1)} mesi). Ecco le stimolazioni raccomandate per la crescita fisica e psicomotoria:
            </p>
          </div>
        </div>

        {/* Loading / Error or Tips display */}
        <div className="bg-white border border-[#D1CEC4] rounded-none p-4 sm:p-5 shadow-none space-y-4">
          {isTipsLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-[#4A5D4E]" size={28} />
              <p className="text-xs text-[#8A867A] uppercase tracking-wider font-bold">L'AI sta analizzando i parametri...</p>
            </div>
          ) : tipsError ? (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 p-3.5 rounded-none bg-[#F9F7F2] text-[#8A867A] text-xs border border-[#D1CEC4] leading-normal font-medium">
                <AlertCircle size={15} className="text-[#D79A81] shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <p className="font-bold uppercase text-[#4A5D4E] text-[10px] tracking-wider mb-0.5">Nessun Secret configurato</p>
                  <p>Mostro i consigli di crescita OMS predefiniti di alta qualità compilati dal nostro archivio.</p>
                </div>
              </div>
              <ul className="space-y-3 select-none">
                {aiTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[#2C2C2C] leading-relaxed flex items-start gap-3 bg-white border-y border-r border-l-4 border-l-[#D79A81] border-[#D1CEC4] p-3.5 rounded-none font-medium">
                    <span className="text-[#D79A81] font-mono font-bold text-xs shrink-0">0{idx+1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-3.5">
              {!hasApiKey && (
                <div className="bg-[#F9F7F2] rounded-none p-3.5 border border-[#D1CEC4] flex items-start gap-2.5 mb-3 leading-normal">
                  <Info size={14} className="text-[#D79A81] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#A29F94] font-semibold uppercase tracking-tight">
                    Senza <b>GEMINI_API_KEY</b> nei Secrets, stai vedendo consigli standard OMS per {Math.round(babyAgeMonths)} mesi. Configura la chiave per sbloccare l'AI generativa personalizzata.
                  </p>
                </div>
              )}
              <ul className="space-y-3">
                {aiTips.map((tip, idx) => (
                  <li key={idx} className="text-xs text-[#2C2C2C] leading-relaxed flex items-start gap-3 bg-white border-y border-r border-l-4 border-l-[#4A5D4E] border-[#D1CEC4] p-3.5 rounded-none font-medium hover:bg-[#F2F0E9]/30 transition">
                    <span className={`font-mono font-bold text-xs shrink-0 ${themeColor}`}>0{idx+1}.</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3.5 flex items-center gap-1.5 border-t border-[#D1CEC4] mt-4">
                <Stethoscope size={13} className="text-[#D79A81]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#A29F94]">I consigli AI non sostituiscono il parere del medico.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT BLOCK: Pediatric Chat Assistant */}
      <div className="lg:col-span-7 bg-white border border-[#D1CEC4] rounded-none shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat header */}
        <div className="bg-[#F2F0E9] border-b border-[#D1CEC4] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-none bg-white border border-[#D1CEC4] text-[#4A5D4E]">
              <Bot size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[#2C2C2C] text-xs sm:text-sm uppercase tracking-wide">Assistente Pediatrico Virtuale AI</h3>
              <p className="text-[10px] text-[#8A867A] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-none bg-[#4A5D4E] block"></span>
                Informatore Pediatrico Istantaneo (OMS / SSN)
              </p>
            </div>
          </div>
        </div>

        {/* Chat Bubbles scroll-area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#F9F7F2]/45">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
            >
              <div
                className={`p-3 text-xs leading-relaxed font-medium rounded-none ${
                  msg.sender === 'user'
                    ? 'bg-[#4A5D4E] text-white'
                    : 'bg-white text-[#2C2C2C] border-y border-r border-l-4 border-l-[#D79A81] border-[#D1CEC4]'
                }`}
              >
                <span className="whitespace-pre-line">{msg.text}</span>
              </div>
              <span className="text-[9px] font-mono text-[#8A867A] mt-1 pl-1 pr-1 font-bold">{msg.timestamp}</span>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex flex-col max-w-[85%] mr-auto items-start animate-pulse">
              <div className="p-3.5 bg-white border-y border-r border-l-4 border-l-[#D79A81] border-[#D1CEC4] rounded-none flex items-center gap-2">
                <Loader2 size={13} className="animate-spin text-[#8A867A]" />
                <span className="text-xs text-[#8A867A] font-bold uppercase tracking-widest text-[10px]">L'AI sta digitando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Form panel inputs */}
        <div className="bg-white border-t border-[#D1CEC4] p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2.5">
            <input
              type="text"
              placeholder={profile ? `Chiedi un consiglio (Es: Come gestire le coliche di ${profile.name}?)` : 'Chiedi un consiglio...'}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={isChatLoading}
              className="flex-1 text-xs border border-[#D1CEC4] bg-white outline-none p-3.5 rounded-none text-[#2C2C2C] focus:border-[#4A5D4E]"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatLoading}
              className={`p-3 px-4 rounded-none cursor-pointer border transition flex items-center justify-center ${
                !chatInput.trim() || isChatLoading
                  ? 'bg-[#F2F0E9] border-[#D1CEC4] text-[#A29F94] cursor-not-allowed'
                  : activeBtnTheme
              }`}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
