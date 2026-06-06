import { useState } from 'react';
import { Milestone, MilestoneCategory } from '../types';
import { INITIAL_MILESTONES } from '../data';
import { CheckCircle2, ChevronRight, Activity, BrainCircuit, MessageSquareCode, Smile, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MilestoneTrackerProps {
  gender: 'male' | 'female';
  achievedIds: string[];
  onToggleMilestone: (id: string) => void;
  babyAgeMonths: number;
}

export default function MilestoneTracker({ gender, achievedIds, onToggleMilestone, babyAgeMonths }: MilestoneTrackerProps) {
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>('0-2 mesi');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<MilestoneCategory | 'all'>('all');
  const [expandedMilestoneId, setExpandedMilestoneId] = useState<string | null>(null);

  const themeColor = gender === 'male' ? 'text-[#4A5D4E]' : 'text-[#D79A81]';
  const themeProgress = 'bg-[#4A5D4E]';

  const ageRanges = ['0-2 mesi', '3-4 mesi', '5-6 mesi', '7-9 mesi', '10-12 mesi'];

  // Filter milestones based on active range and category
  const filteredMilestones = INITIAL_MILESTONES.filter((m) => {
    const matchesAge = m.monthRange === selectedAgeRange;
    const matchesCategory = activeCategoryFilter === 'all' || m.category === activeCategoryFilter;
    return matchesAge && matchesCategory;
  });

  // Calculate overall milestone completion stats
  const totalMilestonesCount = INITIAL_MILESTONES.length;
  const completedMilestonesCount = achievedIds.length;
  const overallPercentage = Math.round((completedMilestonesCount / totalMilestonesCount) * 100);

  // Category Icon & Color mapping helper
  const getCategoryTheme = (cat: MilestoneCategory) => {
    switch (cat) {
      case 'motor':
        return {
          icon: <Activity size={14} />,
          title: 'Motore',
          bg: 'bg-[#F2F0E9] text-[#A29F94] border-[#D1CEC4]',
          accent: 'border-l-4 border-l-[#D79A81]'
        };
      case 'cognitive':
        return {
          icon: <BrainCircuit size={14} />,
          title: 'Cognitivo',
          bg: 'bg-[#F2F0E9] text-[#4A5D4E] border-[#D1CEC4]',
          accent: 'border-l-4 border-l-[#4A5D4E]'
        };
      case 'language':
        return {
          icon: <MessageSquareCode size={14} />,
          title: 'Linguaggio',
          bg: 'bg-[#F2F0E9] text-[#4A5D4E] border-[#D1CEC4]',
          accent: 'border-l-4 border-l-[#4A5D4E]'
        };
      case 'social':
        return {
          icon: <Smile size={14} />,
          title: 'Sociale',
          bg: 'bg-[#F2F0E9] text-[#D79A81] border-[#D1CEC4]',
          accent: 'border-l-4 border-l-[#D79A81]'
        };
    }
  };

  // Helper to detect if a specific age range is appropriate for the baby's actual age
  const getRecommendedRangeForAge = (months: number) => {
    if (months <= 2.2) return '0-2 mesi';
    if (months <= 4.2) return '3-4 mesi';
    if (months <= 6.2) return '5-6 mesi';
    if (months <= 9.2) return '7-9 mesi';
    return '10-12 mesi';
  };

  const recommendedRange = getRecommendedRangeForAge(babyAgeMonths);

  return (
    <div className="space-y-6">
      {/* Milestone Statistics Board */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-white border border-[#D1CEC4] rounded-none p-5">
        <div className="md:col-span-4 text-center md:text-left">
          <h3 className="font-bold uppercase tracking-wider text-[#4A5D4E] text-xs sm:text-sm flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles size={16} className={themeColor} />
            Evoluzione Psicomotoria del Bimbo
          </h3>
          <p className="text-2xs text-[#8A867A] uppercase tracking-wider mt-1.5 leading-normal">
            Verifica i traguardi nel primo anno di vita.
          </p>
        </div>
        <div className="md:col-span-5">
          <div className="flex justify-between text-[11px] font-bold uppercase text-[#2C2C2C] mb-1.5">
            <span>Tappe Raggiunte</span>
            <span className="font-mono text-[#4A5D4E]">{completedMilestonesCount} / {totalMilestonesCount} ({overallPercentage}%)</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-[#E8E4D9] h-2.5 rounded-none overflow-hidden border border-[#D1CEC4]/40">
            <motion.div
              className={`h-full ${themeProgress}`}
              initial={{ width: 0 }}
              animate={{ width: `${overallPercentage}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
        <div className="md:col-span-3 text-center md:text-right">
          <div className="text-[10px] text-[#4A5D4E] font-bold uppercase tracking-wider bg-[#E8E4D9] border border-[#D1CEC4] rounded-none px-3.5 py-2 inline-block text-left leading-normal">
            💡 <b>Fascia Attuale: {recommendedRange}</b><br />
            <span className="text-[#8A867A] text-[9px] font-normal lowercase italic">Il neonato ha ora {babyAgeMonths.toFixed(1)} mesi.</span>
          </div>
        </div>
      </div>

      {/* Tabs selectors for Age ranges */}
      <div className="flex bg-white border border-[#D1CEC4] rounded-none p-1 overflow-x-auto gap-1 shadow-2xs select-none">
        {ageRanges.map((range) => {
          const isRecommended = range === recommendedRange;
          return (
            <button
              key={range}
              onClick={() => setSelectedAgeRange(range)}
              className={`text-xs px-4 py-2.5 rounded-none font-bold uppercase tracking-wider shrink-0 flex items-center gap-2 cursor-pointer transition-all ${
                selectedAgeRange === range
                  ? 'bg-[#4A5D4E] text-white'
                  : 'text-[#8A867A] hover:bg-[#F2F0E9] hover:text-[#2C2C2C]'
              }`}
            >
              {range}
              {isRecommended && (
                <span className={`w-2 h-2 rounded-none ${selectedAgeRange === range ? 'bg-white' : 'bg-[#D79A81]'}`} title="Consigliato per età" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filters for Categories */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-[#D1CEC4] pb-4">
        <button
          onClick={() => setActiveCategoryFilter('all')}
          className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none cursor-pointer border transition-all ${
            activeCategoryFilter === 'all'
              ? 'bg-[#2C2C2C] border-[#2C2C2C] text-white'
              : 'bg-white border-[#D1CEC4] text-[#8A867A] hover:bg-[#F2F0E9]'
          }`}
        >
          Tutte le Scadenze / Aree
        </button>
        <button
          onClick={() => setActiveCategoryFilter('motor')}
          className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none cursor-pointer border flex items-center gap-1.5 transition-all ${
            activeCategoryFilter === 'motor'
              ? 'bg-[#D79A81] border-[#D79A81] text-white'
              : 'bg-white border-[#D1CEC4] text-[#8A867A] hover:bg-[#F2F0E9]/55'
          }`}
        >
          <Activity size={12} />
          Motricità
        </button>
        <button
          onClick={() => setActiveCategoryFilter('cognitive')}
          className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none cursor-pointer border flex items-center gap-1.5 transition-all ${
            activeCategoryFilter === 'cognitive'
              ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white'
              : 'bg-white border-[#D1CEC4] text-[#8A867A] hover:bg-[#F2F0E9]/55'
          }`}
        >
          <BrainCircuit size={12} />
          Cognitivo
        </button>
        <button
          onClick={() => setActiveCategoryFilter('language')}
          className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none cursor-pointer border flex items-center gap-1.5 transition-all ${
            activeCategoryFilter === 'language'
              ? 'bg-[#4A5D4E] border-[#4A5D4E] text-white'
              : 'bg-white border-[#D1CEC4] text-[#8A867A] hover:bg-[#F2F0E9]/55'
          }`}
        >
          <MessageSquareCode size={12} />
          Linguaggio
        </button>
        <button
          onClick={() => setActiveCategoryFilter('social')}
          className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none cursor-pointer border flex items-center gap-1.5 transition-all ${
            activeCategoryFilter === 'social'
              ? 'bg-[#D79A81] border-[#D79A81] text-white'
              : 'bg-white border-[#D1CEC4] text-[#8A867A] hover:bg-[#F2F0E9]/55'
          }`}
        >
          <Smile size={12} />
          Sociale
        </button>
      </div>

      {/* Milestones grid list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMilestones.length > 0 ? (
          filteredMilestones.map((milestone) => {
            const isCompleted = achievedIds.includes(milestone.id);
            const isExpanded = expandedMilestoneId === milestone.id;
            const categoryTheme = getCategoryTheme(milestone.category);

            return (
              <div
                key={milestone.id}
                className={`border rounded-none p-4 transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'border-2 border-[#4A5D4E] bg-white'
                    : 'border-[#D1CEC4] bg-white hover:bg-[#F2F0E9]/20'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-none border ${categoryTheme.bg} flex items-center gap-1.5`}>
                      {categoryTheme.icon}
                      {categoryTheme.title}
                    </span>
                    <button
                      onClick={() => onToggleMilestone(milestone.id)}
                      className={`cursor-pointer group flex items-center gap-1.5 p-0.5 transition-all ${
                        isCompleted ? 'text-[#4A5D4E]' : 'text-slate-300 hover:text-[#4A5D4E]'
                      }`}
                      title={isCompleted ? 'Segna come incompiuta' : 'Segna come raggiunta'}
                    >
                      <CheckCircle2 size={18} className="transition group-hover:scale-110" />
                      <span className="text-[10px] font-black uppercase tracking-wider select-none">
                        {isCompleted ? 'Raggiunto' : 'Da Raggiungere'}
                      </span>
                    </button>
                  </div>

                  <h4 className="font-bold text-[#2C2C2C] text-sm mt-1">{milestone.title}</h4>
                  <p className="text-xs text-[#8A867A] mt-1.5 line-clamp-3 leading-relaxed font-medium">
                    {milestone.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#D1CEC4]/60 flex flex-col gap-2">
                  <button
                    onClick={() => setExpandedMilestoneId(isExpanded ? null : milestone.id)}
                    className="text-[10px] font-black uppercase tracking-wider text-[#4A5D4E] hover:text-[#3C4D3F] flex items-center gap-1.5 cursor-pointer w-fit self-start"
                  >
                    <BookOpen size={13} />
                    {isExpanded ? 'Chiudi Suggerimenti & Tips' : 'Vedi Suggerimenti & Tips 💡'}
                    <ChevronRight size={12} className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-[#F2F0E9] border border-[#D1CEC4] rounded-none p-3.5 mt-1"
                      >
                        <p className="text-[9px] font-extrabold text-[#4A5D4E] uppercase tracking-widest mb-2 flex items-center gap-1">
                          🔔 Esercizi consigliati e stimolazione:
                        </p>
                        <ul className="space-y-2">
                          {milestone.tips.map((tip, idx) => (
                            <li key={idx} className="text-xs text-[#2C2C2C] pl-2 border-l-2 border-l-[#4A5D4E] leading-relaxed">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })
        ) : (
          <div className="md:col-span-2 text-center py-12 bg-white border border-dashed border-[#D1CEC4] rounded-none select-none">
            <span className="text-xs text-[#8A867A] uppercase tracking-wider font-bold">Nessuna tappa trovata per questi filtri.</span>
          </div>
        )}
      </div>
    </div>
  );
}
