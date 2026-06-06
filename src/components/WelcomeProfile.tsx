import React, { useState } from 'react';
import { BabyProfile } from '../types';
import { Baby, Calendar, Scale, Ruler, HeartHandshake, Settings, Save, AlertCircle } from 'lucide-react';

interface WelcomeProfileProps {
  profile: BabyProfile | null;
  onSaveProfile: (profile: BabyProfile) => void;
}

export default function WelcomeProfile({ profile, onSaveProfile }: WelcomeProfileProps) {
  const [isEditing, setIsEditing] = useState(!profile);
  const [name, setName] = useState(profile?.name || '');
  const [birthDate, setBirthDate] = useState(profile?.birthDate || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');
  const [bWeight, setBWeight] = useState(profile?.birthWeight?.toString() || '');
  const [bHeight, setBHeight] = useState(profile?.birthHeight?.toString() || '');
  const [bHeadCirc, setBHeadCirc] = useState(profile?.birthHeadCirc?.toString() || '');
  const [errorMsg, setErrorMsg] = useState('');

  // Sesso theme configuration
  const genderColor = gender === 'male' ? 'text-[#4A5D4E]' : 'text-[#D79A81]';
  const borderActive = gender === 'male' ? 'border-[#4A5D4E]' : 'border-[#D79A81]';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedWeight = parseFloat(bWeight);
    const parsedHeight = parseFloat(bHeight);
    const parsedHeadCirc = parseFloat(bHeadCirc);

    if (!name.trim()) {
      setErrorMsg('Per favore, specifica il nome o soprannome del neonato.');
      return;
    }
    if (!birthDate) {
      setErrorMsg('Per favore, imposta la data di nascita.');
      return;
    }
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      setErrorMsg('Per favore, scrivi un peso alla nascita valido.');
      return;
    }
    if (isNaN(parsedHeight) || parsedHeight <= 0) {
      setErrorMsg('Per favore, specifica l\'altezza alla nascita.');
      return;
    }
    if (isNaN(parsedHeadCirc) || parsedHeadCirc <= 0) {
      setErrorMsg('Per favore, specifica la circonferenza cranica.');
      return;
    }

    const newProfile: BabyProfile = {
      name: name.trim(),
      birthDate,
      gender,
      birthWeight: parsedWeight,
      birthHeight: parsedHeight,
      birthHeadCirc: parsedHeadCirc
    };

    onSaveProfile(newProfile);
    setIsEditing(false);
  };

  // Age calculator to detail: exact months, weeks and days
  const calculateDetailedAge = () => {
    if (!profile) return '';
    const birth = new Date(profile.birthDate);
    const now = new Date();
    const diffTime = now.getTime() - birth.getTime();
    if (diffTime < 0) return 'Data nel futuro? 😮';

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30.4375);
    const remainingDays = Math.floor(diffDays % 30.4375);
    const weeks = Math.floor(remainingDays / 7);
    const days = Math.floor(remainingDays % 7);

    let parts = [];
    if (months > 0) parts.push(`${months} ${months === 1 ? 'mese' : 'mesi'}`);
    if (weeks > 0) parts.push(`${weeks} ${weeks === 1 ? 'settimana' : 'settimane'}`);
    if (days > 0 || parts.length === 0) parts.push(`${days} ${days === 1 ? 'giorno' : 'giorni'}`);

    return parts.join(', ') + ' di vita meravigliosa';
  };

  if (isEditing) {
    return (
      <div className="max-w-2xl mx-auto bg-white border border-[#D1CEC4] rounded-none p-6 sm:p-8 shadow-sm">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 bg-[#F2F0E9] text-[#4A5D4E] rounded-none border border-[#D1CEC4] flex items-center justify-center mx-auto">
            <Baby size={24} />
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-[#4A5D4E]">Benvenuto in Piccoli Passi ✨</h2>
          <p className="text-xs text-[#8A867A] uppercase tracking-widest max-w-sm mx-auto">
            Profilo di crescita neonatale
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-[#D79A81]/10 text-[#C1856C] text-xs p-3 rounded-none border border-[#D79A81]/30 flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#8A867A] mb-1.5">Soprannome/Nome</label>
              <input
                type="text"
                placeholder="Es. Leonardo, Sofia"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E] focus:ring-1 focus:ring-[#4A5D4E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#8A867A] mb-1.5">Sesso biologico neonato</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`text-xs p-2.5 rounded-none border font-bold uppercase tracking-wider text-center cursor-pointer transition ${
                    gender === 'male' ? 'border-[#4A5D4E] bg-[#4A5D4E] text-white' : 'border-[#D1CEC4] text-[#8A867A] bg-white hover:bg-[#F2F0E9]'
                  }`}
                >
                  Maschietto
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`text-xs p-2.5 rounded-none border font-bold uppercase tracking-wider text-center cursor-pointer transition ${
                    gender === 'female' ? 'border-[#D79A81] bg-[#D79A81] text-white' : 'border-[#D1CEC4] text-[#8A867A] bg-white hover:bg-[#F2F0E9]'
                  }`}
                >
                  Femminuccia
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#8A867A] mb-1.5">Data di Nascita</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#8A867A] mb-1.5">Peso alla nascita (kg)</label>
              <input
                type="number"
                step="0.001"
                placeholder="Es. 3.250"
                value={bWeight}
                onChange={(e) => setBWeight(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#8A867A] mb-1.5">Altezza nascita (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Es. 49.5"
                value={bHeight}
                onChange={(e) => setBHeight(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[#8A867A] mb-1.5">C. Cranica (cm)</label>
              <input
                type="number"
                step="0.1"
                placeholder="Es. 34.0"
                value={bHeadCirc}
                onChange={(e) => setBHeadCirc(e.target.value)}
                required
                className="w-full text-xs p-2.5 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#4A5D4E] text-white hover:bg-[#3C4D3F] text-xs font-bold uppercase tracking-widest rounded-none border border-[#4A5D4E] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Save size={14} />
                Salva Profilo
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // Profile Active State Card view - stylized as custom geometric sidebar tab
  const sideColorBorder = profile.gender === 'male' ? 'border-l-[#4A5D4E]' : 'border-l-[#D79A81]';
  const profIconBg = profile.gender === 'male' ? 'bg-[#E8E4D9] text-[#4A5D4E]' : 'bg-[#F2F0E9] text-[#D79A81]';

  return (
    <div className={`p-6 bg-white border-y border-r border-l-4 ${sideColorBorder} border-[#D1CEC4] rounded-none transition-all flex flex-col md:flex-row md:items-center justify-between gap-6`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-none border border-[#D1CEC4] ${profIconBg} flex items-center justify-center shadow-xs shrink-0`}>
          <Baby size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#2C2C2C]">{profile.name}</h2>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 border rounded-none whitespace-nowrap ${profile.gender === 'male' ? 'bg-[#E8E4D9] border-[#D1CEC4] text-[#4A5D4E]' : 'bg-[#F2F0E9] border-[#D1CEC4] text-[#D79A81]'}`}>
              {profile.gender === 'male' ? 'Maschietto' : 'Femminuccia'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8A867A] font-medium mt-1">
            <Calendar size={13} className="shrink-0 text-[#4A5D4E]" />
            <span>Nato il: <b>{new Date(profile.birthDate).toLocaleDateString('it-IT')}</b> • </span>
            <span className="font-semibold text-[#2C2C2C]">{calculateDetailedAge()}</span>
          </div>

          {/* Mini-grid of birth indices for memory */}
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[10px] font-mono uppercase tracking-wider text-[#8A867A]">
            <span className="flex items-center gap-1"><Scale size={11} className="text-[#4A5D4E]" /> Nascita: <b className="text-[#2C2C2C]">{profile.birthWeight.toFixed(3)} kg</b></span>
            <span className="flex items-center gap-1"><Ruler size={11} className="text-[#4A5D4E]" /> Lunghezza: <b className="text-[#2C2C2C]">{profile.birthHeight} cm</b></span>
            <span className="flex items-center gap-1"><HeartHandshake size={11} className="text-[#4A5D4E]" /> C. Cranica: <b className="text-[#2C2C2C]">{profile.birthHeadCirc} cm</b></span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-xs py-2 px-3 border border-[#D1CEC4] bg-white text-[#8A867A] hover:bg-[#F2F0E9] hover:text-[#2C2C2C] rounded-none transition flex items-center gap-1.5 cursor-pointer font-bold uppercase tracking-widest"
        >
          <Settings size={13} />
          <span>Modifica</span>
        </button>
      </div>
    </div>
  );
}
