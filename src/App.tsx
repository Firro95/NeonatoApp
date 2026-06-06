import { useState, useEffect } from 'react';
import { AppState, BabyProfile, GrowthLog, PediatricVisit } from './types';
import { INITIAL_VISITS } from './data';
import WelcomeProfile from './components/WelcomeProfile';
import GrowthCharts from './components/GrowthCharts';
import MilestoneTracker from './components/MilestoneTracker';
import VisitTracker from './components/VisitTracker';
import AiCompanion from './components/AiCompanion';
import { Sparkles, TrendingUp, BookOpen, Stethoscope, Heart, Bot, HelpCircle } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>({
    profile: null,
    growthLogs: [],
    achievements: [],
    visits: INITIAL_VISITS,
    chatHistory: [],
  });

  const [activeSegment, setActiveSegment] = useState<'charts' | 'milestones' | 'visits' | 'ai'>('charts');

  // Load state from localStorage on init
  useEffect(() => {
    const cached = localStorage.getItem('baby_first_year_state');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Ensure visits lists are matched with any newly defined metrics structure
        if (!parsed.visits || parsed.visits.length === 0) {
          parsed.visits = INITIAL_VISITS;
        }
        setState(parsed);
      } catch (err) {
        console.error('Failed to parse cached stats', err);
      }
    }
  }, []);

  // Save state to localStorage on modification
  const saveState = (newState: AppState) => {
    setState(newState);
    localStorage.setItem('baby_first_year_state', JSON.stringify(newState));
  };

  const handleSaveProfile = (newProfile: BabyProfile) => {
    // Sync initial mock logs to let charts immediately render nicely with WHO curves if empty
    let initialLogs: GrowthLog[] = [];
    if (state.growthLogs.length === 0) {
      // Calculate a log at 1.5 months as demonstration
      const birth = new Date(newProfile.birthDate);
      const oneMonthLater = new Date(birth.getTime() + 45 * 24 * 60 * 60 * 1000); // 45 days
      initialLogs = [
        {
          id: 'initial_demo',
          date: oneMonthLater.toISOString().split('T')[0],
          monthsAge: 1.5,
          weight: newProfile.birthWeight + 1.350, // Typical growth of ~1kg in 1st phase
          height: newProfile.birthHeight + 4.5,
          headCirc: newProfile.birthHeadCirc + 2.4,
          notes: 'Peso registrato come controllo del primo mese.'
        }
      ];
    }

    const updated = {
      ...state,
      profile: newProfile,
      growthLogs: initialLogs.length > 0 ? initialLogs : state.growthLogs,
    };
    saveState(updated);
  };

  const calculateMonthsAge = (logDate: string): number => {
    if (!state.profile) return 0;
    const birth = new Date(state.profile.birthDate);
    const log = new Date(logDate);
    const diffTime = log.getTime() - birth.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return Math.max(0, diffDays / 30.4375); // average days per month
  };

  const handleAddGrowthLog = (newLog: Omit<GrowthLog, 'id' | 'monthsAge'>) => {
    const ageMonths = calculateMonthsAge(newLog.date);
    const completeLog: GrowthLog = {
      ...newLog,
      id: Math.random().toString(),
      monthsAge: ageMonths,
    };

    const updated = {
      ...state,
      growthLogs: [...state.growthLogs, completeLog],
    };
    saveState(updated);
  };

  const handleDeleteGrowthLog = (id: string) => {
    const updated = {
      ...state,
      growthLogs: state.growthLogs.filter((log) => log.id !== id),
    };
    saveState(updated);
  };

  const handleToggleMilestone = (milestoneId: string) => {
    const isAchieved = state.achievements.some((a) => a.milestoneId === milestoneId);
    let updatedAchievements = [];

    if (isAchieved) {
      updatedAchievements = state.achievements.filter((a) => a.milestoneId !== milestoneId);
    } else {
      updatedAchievements = [
        ...state.achievements,
        { milestoneId, achievedAt: new Date().toISOString().split('T')[0] },
      ];
    }

    saveState({
      ...state,
      achievements: updatedAchievements,
    });
  };

  const handleToggleVisitDone = (visitId: string) => {
    const updatedVisits = state.visits.map((v) => {
      if (v.id === visitId) {
        return { ...v, done: !v.done, actualDate: !v.done ? new Date().toISOString().split('T')[0] : undefined };
      }
      return v;
    });

    saveState({
      ...state,
      visits: updatedVisits,
    });
  };

  const handleUpdateVisit = (visitId: string, updatedFields: Partial<PediatricVisit>) => {
    const updatedVisits = state.visits.map((v) => {
      if (v.id === visitId) {
        return { ...v, ...updatedFields };
      }
      return v;
    });

    saveState({
      ...state,
      visits: updatedVisits,
    });
  };

  const getBabyAgeMonthsGlobal = () => {
    if (!state.profile) return 0;
    const birth = new Date(state.profile.birthDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays / 30.4375;
  };

  const achievedMilestoneIds = state.achievements.map((a) => a.milestoneId);
  const babyAgeMonths = getBabyAgeMonthsGlobal();

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased text-[#2C2C2C]">
      {/* Top Banner Applet */}
      <header className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row items-end justify-between gap-4 border-b-2 border-[#D1CEC4] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4A5D4E] text-white rounded-none flex items-center justify-center shrink-0">
            <Heart size={20} className="fill-white/10" />
          </div>
          <div>
            <h1 id="app-title" className="text-3xl font-light tracking-tight text-[#4A5D4E]">
              Piccoli <span className="font-bold">Passi</span>
              <span className="ml-2 text-[10px] bg-[#E8E4D9] text-[#4A5D4E] border border-[#D1CEC4] font-bold uppercase px-2 py-0.5 rounded-none font-mono">
                SVILUPPO & VISITE
              </span>
            </h1>
            <p className="text-xs uppercase tracking-widest text-[#8A867A] mt-1">Monitoraggio Sviluppo Primo Anno</p>
          </div>
        </div>

        {/* Dynamic global quick stats in the theme's box look */}
        {state.profile && (
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
            <div className="px-4 py-2 bg-[#E8E4D9] rounded-none text-xs font-bold uppercase tracking-tighter border border-[#D1CEC4] text-[#2C2C2C]">
              Profilo: <span className="font-mono">{state.profile.name}</span>
            </div>
            <div className="px-4 py-2 bg-[#4A5D4E] text-white rounded-none text-xs font-bold uppercase tracking-tighter border border-[#4A5D4E]">
              {achievedMilestoneIds.length} Tappe • Bilancio {state.visits.filter((v) => v.done).length}/6
            </div>
          </div>
        )}
      </header>

      {/* Main Container Area */}
      <main className="max-w-6xl mx-auto">
        <WelcomeProfile profile={state.profile} onSaveProfile={handleSaveProfile} />

        {state.profile ? (
          <div className="mt-8 space-y-6">
            {/* Tab Navigation Menu (Geometric) */}
            <div className="border-b border-[#D1CEC4]">
              <nav className="grid grid-cols-2 md:grid-cols-4 gap-1">
                <button
                  onClick={() => setActiveSegment('charts')}
                  className={`py-3 px-4 border text-center font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                    activeSegment === 'charts'
                      ? 'border-2 border-[#4A5D4E] bg-white text-[#4A5D4E] shadow-sm font-black'
                      : 'border-[#D1CEC4] bg-[#E8E4D9]/40 text-[#8A867A] hover:bg-[#F2F0E9] hover:text-[#2C2C2C]'
                  }`}
                >
                  <TrendingUp size={15} />
                  Crescita Fisica 📈
                </button>
                <button
                  onClick={() => setActiveSegment('milestones')}
                  className={`py-3 px-4 border text-center font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                    activeSegment === 'milestones'
                      ? 'border-2 border-[#4A5D4E] bg-white text-[#4A5D4E] shadow-sm font-black'
                      : 'border-[#D1CEC4] bg-[#E8E4D9]/40 text-[#8A867A] hover:bg-[#F2F0E9] hover:text-[#2C2C2C]'
                  }`}
                >
                  <BookOpen size={15} />
                  Tappe Sviluppo 🌟
                </button>
                <button
                  onClick={() => setActiveSegment('visits')}
                  className={`py-3 px-4 border text-center font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                    activeSegment === 'visits'
                      ? 'border-2 border-[#4A5D4E] bg-white text-[#4A5D4E] shadow-sm font-black'
                      : 'border-[#D1CEC4] bg-[#E8E4D9]/40 text-[#8A867A] hover:bg-[#F2F0E9] hover:text-[#2C2C2C]'
                  }`}
                >
                  <Stethoscope size={15} />
                  Visite Mediche 🩺
                </button>
                <button
                  onClick={() => setActiveSegment('ai')}
                  className={`py-3 px-4 border text-center font-bold text-xs uppercase tracking-wider cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-2 ${
                    activeSegment === 'ai'
                      ? 'border-2 border-[#4A5D4E] bg-white text-[#4A5D4E] shadow-sm font-black'
                      : 'border-[#D1CEC4] bg-[#E8E4D9]/40 text-[#8A867A] hover:bg-[#F2F0E9] hover:text-[#2C2C2C]'
                  }`}
                >
                  <Bot size={15} />
                  Consigli AI Assistant 🤖
                </button>
              </nav>
            </div>

            {/* Render selected child Segment */}
            <div className="pt-2 animate-fade-in">
              {activeSegment === 'charts' && (
                <GrowthCharts
                  profile={state.profile}
                  logs={state.growthLogs}
                  onAddLog={handleAddGrowthLog}
                  onDeleteLog={handleDeleteGrowthLog}
                />
              )}

              {activeSegment === 'milestones' && (
                <MilestoneTracker
                  gender={state.profile.gender}
                  achievedIds={achievedMilestoneIds}
                  onToggleMilestone={handleToggleMilestone}
                  babyAgeMonths={babyAgeMonths}
                />
              )}

              {activeSegment === 'visits' && (
                <VisitTracker
                  gender={state.profile.gender}
                  visits={state.visits}
                  onToggleVisitDone={handleToggleVisitDone}
                  onUpdateVisit={handleUpdateVisit}
                  onAddGrowthLog={handleAddGrowthLog}
                />
              )}

              {activeSegment === 'ai' && (
                <AiCompanion
                  gender={state.profile.gender}
                  profile={state.profile}
                  logs={state.growthLogs}
                  visits={state.visits}
                  achievedIds={achievedMilestoneIds}
                />
              )}
            </div>
          </div>
        ) : (
          /* Profile Unspecified fallback */
          <div className="my-12 text-center py-16 bg-white border border-[#D1CEC4] rounded-none max-w-lg mx-auto p-8">
            <HelpCircle size={44} className="text-[#8A867A] mx-auto mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A5D4E]">Iniziamo il cammino!</h3>
            <p className="text-xs text-[#8A867A] mt-2 max-w-xs mx-auto leading-relaxed">
              Per favore compila il questionario di benvenuto qui sopra per inizializzare il percorso di crescita del neonato.
            </p>
          </div>
        )}
      </main>

      {/* Footer Bar */}
      <footer className="mt-16 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-[#8A867A] border-t-2 border-[#D1CEC4] pt-6 max-w-6xl mx-auto">
        <div className="flex gap-8">
          <span>© 2026 Piccoli Passi</span>
          <span className="text-[#4A5D4E]">Dati Sincronizzati</span>
        </div>
        <div className="flex gap-4">
          <span>Informativa OMS</span>
        </div>
      </footer>
    </div>
  );
}
