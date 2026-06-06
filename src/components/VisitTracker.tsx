import React, { useState } from 'react';
import { PediatricVisit, GrowthLog } from '../types';
import { Calendar, Syringe, CopyCheck, FileText, Check, Plus, Trash, Stethoscope, HelpCircle } from 'lucide-react';

interface VisitTrackerProps {
  gender: 'male' | 'female';
  visits: PediatricVisit[];
  onToggleVisitDone: (id: string) => void;
  onUpdateVisit: (id: string, updatedFields: Partial<PediatricVisit>) => void;
  onAddGrowthLog: (log: Omit<GrowthLog, 'id' | 'monthsAge'>) => void;
}

export default function VisitTracker({ gender, visits, onToggleVisitDone, onUpdateVisit, onAddGrowthLog }: VisitTrackerProps) {
  const [selectedVisitId, setSelectedVisitId] = useState<string>(visits[0]?.id || '');
  const [newCustomQuestion, setNewCustomQuestion] = useState('');

  // Growth logs state on form inside visit
  const [vWeight, setVWeight] = useState('');
  const [vHeight, setVHeight] = useState('');
  const [vHeadCirc, setVHeadCirc] = useState('');
  const [vLogDate, setVLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [growthSuccessMsg, setGrowthSuccessMsg] = useState('');

  const themeColor = gender === 'male' ? 'text-[#4A5D4E]' : 'text-[#D79A81]';
  const themeBorderActive = 'border-2 border-[#4A5D4E] bg-[#F2F0E9]/30';
  const activeBtnTheme = 'bg-[#4A5D4E] hover:bg-[#3C4D3F] border-[#4A5D4E] text-white';

  const selectedVisit = visits.find((v) => v.id === selectedVisitId);

  const handleCustomQuestionAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisit || !newCustomQuestion.trim()) return;

    const currentCustom = selectedVisit.customQuestions || [];
    onUpdateVisit(selectedVisit.id, {
      customQuestions: [...currentCustom, newCustomQuestion.trim()]
    });
    setNewCustomQuestion('');
  };

  const handleCustomQuestionDelete = (idx: number) => {
    if (!selectedVisit) return;
    const currentCustom = selectedVisit.customQuestions || [];
    onUpdateVisit(selectedVisit.id, {
      customQuestions: currentCustom.filter((_, i) => i !== idx)
    });
  };

  const handleNotesChange = (notes: string) => {
    if (!selectedVisit) return;
    onUpdateVisit(selectedVisit.id, { pediatricianNotes: notes });
  };

  const handleDateChange = (date: string) => {
    if (!selectedVisit) return;
    onUpdateVisit(selectedVisit.id, { scheduledDate: date });
    setVLogDate(date);
  };

  const handleSyncGrowth = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(vWeight);
    const h = parseFloat(vHeight);
    const hc = parseFloat(vHeadCirc);

    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(hc) || hc <= 0) {
      alert('Per favore inserisci valori positivi validi per il peso, altezza e circonferenza cranica.');
      return;
    }

    // Save to growth log database!
    onAddGrowthLog({
      date: vLogDate,
      weight: w,
      height: h,
      headCirc: hc,
      notes: `Misurato al controllo: ${selectedVisit?.title}`
    });

    // Also update locally in visit object (optional caching)
    onUpdateVisit(selectedVisitId, {
      weightGained: w,
      heightGained: h,
      headCircGained: hc,
      actualDate: vLogDate
    });

    setVWeight('');
    setVHeight('');
    setVHeadCirc('');
    setGrowthSuccessMsg('Parametri sintonizzati automaticamente con la curva crescita! 📊');

    setTimeout(() => {
      setGrowthSuccessMsg('');
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT COLUMN: Checkups List */}
      <div className="lg:col-span-4 space-y-3">
        <div className="bg-white border border-[#D1CEC4] rounded-none p-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8A867A]">Calendario Bilanci Medici</p>
          <p className="text-2xs text-[#8A867A] mt-1.5 leading-normal">I controlli obbligatori OMS pianificati per il neonato nel primo anno.</p>
        </div>
        <div className="space-y-2 select-none">
          {visits.map((visit) => {
            const isSelected = visit.id === selectedVisitId;
            return (
              <button
                key={visit.id}
                onClick={() => {
                  setSelectedVisitId(visit.id);
                  setGrowthSuccessMsg('');
                }}
                className={`w-full text-left p-3.5 rounded-none border transition-all cursor-pointer flex justify-between items-center ${
                  isSelected
                    ? themeBorderActive
                    : 'border-[#D1CEC4] bg-white hover:bg-[#F2F0E9]/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#2C2C2C] text-xs sm:text-sm">{visit.title}</h4>
                    {visit.done && (
                      <span className="bg-[#4A5D4E]/10 border border-[#4A5D4E]/20 text-[#4A5D4E] text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-none uppercase">
                        Svolta ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-[#4A5D4E] font-bold mt-1 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={10} />
                    {visit.recommendedAgeRange}
                  </p>
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisitDone(visit.id);
                  }}
                  className={`p-1.5 rounded-none cursor-pointer border transition-all ${
                    visit.done
                      ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white'
                      : 'bg-white border-[#D1CEC4] text-[#8A867A] hover:bg-[#F2F0E9]'
                  }`}
                  title={visit.done ? 'Segna come non completata' : 'Segna come completata'}
                >
                  <Check size={14} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Visit Details & Tools */}
      <div className="lg:col-span-8">
        {selectedVisit ? (
          <div className="bg-white border border-[#D1CEC4] rounded-none p-5 sm:p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CEC4]/60 pb-5">
              <div>
                <span className="text-[9px] text-[#4A5D4E] font-bold px-2 py-0.5 rounded-none bg-[#E8E4D9] border border-[#D1CEC4] uppercase tracking-widest">
                  Controllo Pediatrico Periodico
                </span>
                <h3 className="font-bold text-[#2C2C2C] text-base sm:text-lg mt-2 flex items-center gap-1.5">
                  <Stethoscope size={18} className="text-[#4A5D4E]" />
                  {selectedVisit.title} ({selectedVisit.recommendedAgeRange})
                </h3>
                <p className="text-xs text-[#8A867A] mt-1.5 leading-relaxed">{selectedVisit.description}</p>
              </div>

              {/* Status block info */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[9px] text-[#8A867A] font-black uppercase tracking-wider">STATO VISITA</p>
                  <p className={`text-xs font-mono font-bold uppercase tracking-wider ${selectedVisit.done ? 'text-[#4A5D4E]' : 'text-[#D79A81]'}`}>
                    {selectedVisit.done ? 'Effettuata ✓' : 'In Programma'}
                  </p>
                </div>
                <button
                  onClick={() => onToggleVisitDone(selectedVisit.id)}
                  className={`px-3 py-2 border rounded-none text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                    selectedVisit.done
                      ? 'bg-[#E8E4D9] border-[#D1CEC4] text-[#2C2C2C] hover:bg-[#F2F0E9]'
                      : 'bg-[#4A5D4E] border-[#4A5D4E] text-white hover:bg-[#3C4D3F]'
                  }`}
                >
                  {selectedVisit.done ? 'Riapri' : 'Segna Svolta'}
                </button>
              </div>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Doctor Standard Controls & Vaccines */}
              <div className="space-y-4">
                <div className="bg-[#F2F0E9] border border-[#D1CEC4] rounded-none p-4 space-y-3">
                  <h4 className="font-bold text-[#4A5D4E] text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <Stethoscope size={13} />
                    Valutazioni Preventive Mediche:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedVisit.checks.map((check, idx) => (
                      <li key={idx} className="text-xs text-[#2C2C2C] leading-relaxed flex items-start gap-1.5">
                        <span className="text-[#4A5D4E] font-bold mt-1">•</span>
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {selectedVisit.vaccines && selectedVisit.vaccines.length > 0 && (
                  <div className="bg-[#F9F7F2] border border-[#D1CEC4] rounded-none p-4 space-y-3">
                    <h4 className="font-bold text-[#D79A81] text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                      <Syringe size={13} />
                      Immunizzazioni e Vaccini Previsti:
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedVisit.vaccines.map((vac, idx) => (
                        <li key={idx} className="text-[#2C2C2C] text-xs leading-relaxed flex items-start gap-1.5">
                          <Check size={11} className="text-[#D79A81] shrink-0 mt-1" />
                          <span>{vac}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Checklist questions */}
              <div className="space-y-4">
                <div className="bg-[#F2F0E9] border border-[#D1CEC4] rounded-none p-4 space-y-3">
                  <h4 className="font-bold text-[#4A5D4E] text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <HelpCircle size={13} />
                    Consigliate da chiedere al Pediatra:
                  </h4>
                  <ul className="space-y-2">
                    {selectedVisit.parentQuestions.map((q, idx) => (
                      <li key={idx} className="text-xs text-[#2C2C2C] leading-normal flex items-start gap-2">
                        <span className="text-[#D79A81] shrink-0 select-none">❔</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Custom questions manager */}
                <div className="bg-white border border-[#D1CEC4] rounded-none p-4 space-y-3">
                  <h4 className="font-bold text-[#2C2C2C] text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <CopyCheck size={13} className="text-[#4A5D4E]" />
                    Miei dubbi o quesiti personali:
                  </h4>

                  {selectedVisit.customQuestions && selectedVisit.customQuestions.length > 0 ? (
                    <ul className="space-y-2 divide-y divide-[#E8E4D9]">
                      {selectedVisit.customQuestions.map((q, idx) => (
                        <li key={idx} className="text-xs text-[#2C2C2C] pt-2 flex justify-between items-start gap-2">
                          <span className="flex items-start gap-1.5">
                            <span className="text-[#4A5D4E] font-bold shrink-0">✔</span>
                            <span>{q}</span>
                          </span>
                          <button
                            onClick={() => handleCustomQuestionDelete(idx)}
                            className="text-slate-400 hover:text-red-500 cursor-pointer p-0.5"
                          >
                            <Trash size={12} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-[#8A867A] italic">Nessuna domanda annotata finora. Inserisci un quesito per la visita medica.</p>
                  )}

                  <form onSubmit={handleCustomQuestionAdd} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="E.g. Sonno agitato o rigurgiti?"
                      value={newCustomQuestion}
                      onChange={(e) => setNewCustomQuestion(e.target.value)}
                      className="text-xs p-2 border border-[#D1CEC4] rounded-none flex-1 bg-white focus:outline-none focus:border-[#4A5D4E]"
                    />
                    <button
                      type="submit"
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-2 bg-[#4A5D4E] hover:bg-[#3C4D3F] border border-[#4A5D4E] text-white rounded-none cursor-pointer"
                    >
                      Agg.
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Notes & Physical parameters recorded at checkup */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-[#D1CEC4]/65">
              {/* Doctor notes textblock */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center gap-2">
                  <FileText size={15} className="text-[#4A5D4E]" />
                  <span className="text-[10px] font-bold text-[#4A5D4E] uppercase tracking-widest">Prescrizioni e Note Pediatriche</span>
                </div>
                <textarea
                  rows={5}
                  placeholder="Annota qui le indicazioni nutrizionali del pediatra, integratori di vitamina D prescritte, schemi svezzamento, ecc..."
                  value={selectedVisit.pediatricianNotes || ''}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  className="w-full text-xs p-3 border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E] bg-[#F9F7F2]/45 font-medium leading-relaxed text-[#2C2C2C]"
                />
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-[#8A867A]">Data Prenotata Controllo:</span>
                  <input
                    type="date"
                    value={selectedVisit.scheduledDate || ''}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="text-xs p-1.5 border border-[#D1CEC4] rounded-none bg-white font-mono text-[#2C2C2C] focus:outline-none"
                  />
                </div>
              </div>

              {/* Growth Parameters Log recorded in actual visit */}
              <div className="md:col-span-5 bg-[#F2F0E9] border border-[#D1CEC4] rounded-none p-4.5 flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-[#4A5D4E] text-[10px] uppercase tracking-widest flex items-center gap-1.5 mb-2">
                    📊 Rilevamento Misure della Visita
                  </h4>
                  <p className="text-[10px] text-[#8A867A] leading-normal mb-3 uppercase">
                    Inserisci i parametri fisici registrati dal dottore per sintonizzarli con il grafico.
                  </p>

                  <form onSubmit={handleSyncGrowth} className="space-y-2">
                    <div className="flex items-center justify-between gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A867A]">Peso (kg):</label>
                      <input
                        type="number"
                        step="0.001"
                        placeholder="Es. 4.350"
                        value={vWeight}
                        onChange={(e) => setVWeight(e.target.value)}
                        required
                        className="text-xs p-1 bg-white border border-[#D1CEC4] rounded-none w-28 text-right pr-2 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A867A]">Altezza (cm):</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Es. 54.0"
                        value={vHeight}
                        onChange={(e) => setVHeight(e.target.value)}
                        required
                        className="text-xs p-1 bg-white border border-[#D1CEC4] rounded-none w-28 text-right pr-2 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-[#8A867A]">C. Cranica (cm):</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Es. 37.2"
                        value={vHeadCirc}
                        onChange={(e) => setVHeadCirc(e.target.value)}
                        required
                        className="text-xs p-1 bg-white border border-[#D1CEC4] rounded-none w-28 text-right pr-2 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#4A5D4E] border border-[#4A5D4E] text-white hover:bg-[#3C4D3F] text-[10px] font-bold uppercase tracking-widest rounded-none cursor-pointer transition"
                    >
                      Sincronizza e Registra 📈
                    </button>
                  </form>
                </div>

                {growthSuccessMsg && (
                  <div className="mt-3 bg-white border border-[#D1CEC4] text-[#4A5D4E] text-[10px] font-bold uppercase tracking-widest p-2.5 rounded-none leading-normal">
                    {growthSuccessMsg}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-[#D1CEC4] rounded-none select-none">
            <p className="text-sm text-[#8A867A] uppercase tracking-wider font-bold">Nessun controllo selezionato.</p>
          </div>
        )}
      </div>
    </div>
  );
}
