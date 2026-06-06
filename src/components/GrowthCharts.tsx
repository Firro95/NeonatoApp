import React, { useState } from 'react';
import { BabyProfile, GrowthLog } from '../types';
import { calculatePercentile, WHO_GROWTH_CURVES } from '../data';
import { Ruler, Scale, HeartHandshake, Plus, Trash2, TrendingUp, Info } from 'lucide-react';

interface GrowthChartsProps {
  profile: BabyProfile;
  logs: GrowthLog[];
  onAddLog: (log: Omit<GrowthLog, 'id' | 'monthsAge'>) => void;
  onDeleteLog: (id: string) => void;
}

export default function GrowthCharts({ profile, logs, onAddLog, onDeleteLog }: GrowthChartsProps) {
  const [activeTab, setActiveTab] = useState<'weight' | 'height' | 'headCirc'>('weight');
  const [weightInput, setWeightInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [headCircInput, setHeadCircInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);
  const [notesInput, setNotesInput] = useState('');
  const [formError, setFormError] = useState('');

  const genderLabel = profile.gender === 'male' ? 'Maschietto' : 'Femminuccia';
  const themeColor = profile.gender === 'male' ? 'text-[#4A5D4E]' : 'text-[#D79A81]';
  const activeBtnTheme = 'bg-[#4A5D4E] text-white';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const w = parseFloat(weightInput);
    const h = parseFloat(heightInput);
    const hc = parseFloat(headCircInput);

    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0 || isNaN(hc) || hc <= 0) {
      setFormError('Per favore, inserisci valori positivi validi per Peso, Altezza e Circonferenza Cranica.');
      return;
    }

    onAddLog({
      date: dateInput,
      weight: w,
      height: h,
      headCirc: hc,
      notes: notesInput.trim() || undefined
    });

    // Reset inputs except date
    setWeightInput('');
    setHeightInput('');
    setHeadCircInput('');
    setNotesInput('');
  };

  // Sort logs by date ascending for charts
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get current status summary based on latest log
  const latestLog = sortedLogs[sortedLogs.length - 1] || null;
  const latestWeightPercentile = latestLog ? calculatePercentile('weight', profile.gender, latestLog.monthsAge, latestLog.weight) : null;
  const latestHeightPercentile = latestLog ? calculatePercentile('height', profile.gender, latestLog.monthsAge, latestLog.height) : null;
  const latestHeadCircPercentile = latestLog ? calculatePercentile('headCirc', profile.gender, latestLog.monthsAge, latestLog.headCirc) : null;

  // Render a lovely responsive SVG growth chart
  const renderSvgChart = () => {
    // Width and height of SVG viewport
    const width = 600;
    const height = 300;
    const paddingLeft = 45;
    const paddingRight = 40;
    const paddingTop = 20;
    const paddingBottom = 35;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    // Months range on X axis: 0 to 12
    const minX = 0;
    const maxX = 12;

    // Y values based on property
    let minY = 2;
    let maxY = 13;
    let unit = 'kg';
    let label = 'Peso (kg)';

    if (activeTab === 'height') {
      minY = 40;
      maxY = 85;
      unit = 'cm';
      label = 'Altezza (cm)';
    } else if (activeTab === 'headCirc') {
      minY = 30;
      maxY = 52;
      unit = 'cm';
      label = 'Circonferenza Cranica (cm)';
    }

    // Map month (0-12) to X pixel coordinates
    const getX = (m: number) => {
      return paddingLeft + ((m - minX) / (maxX - minX)) * chartW;
    };

    // Map value (weight, height, etc) to Y pixel coordinates
    const getY = (v: number) => {
      const val = Math.max(minY, Math.min(maxY, v));
      return paddingTop + chartH - ((val - minY) / (maxY - minY)) * chartH;
    };

    // Prepare path data for percentiles
    const whoCurveData = WHO_GROWTH_CURVES[profile.gender][activeTab];
    const pointsP15: string[] = [];
    const pointsP50: string[] = [];
    const pointsP85: string[] = [];

    for (let m = 0; m <= 12; m++) {
      const values = whoCurveData[m];
      if (values) {
        pointsP15.push(`${getX(m)},${getY(values[0])}`);
        pointsP50.push(`${getX(m)},${getY(values[1])}`);
        pointsP85.push(`${getX(m)},${getY(values[2])}`);
      }
    }

    const pathD15 = `M ${pointsP15.join(' L ')}`;
    const pathD50 = `M ${pointsP50.join(' L ')}`;
    const pathD85 = `M ${pointsP85.join(' L ')}`;

    // Generate grid lines
    const xGrid = Array.from({ length: 13 }, (_, i) => i);
    const yGridStep = activeTab === 'weight' ? 1.5 : activeTab === 'height' ? 5 : 2;
    const yGrid: number[] = [];
    for (let y = minY; y <= maxY; y += yGridStep) {
      yGrid.push(y);
    }

    return (
      <div className="relative w-full overflow-x-auto bg-white border border-[#D1CEC4] rounded-none p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2 select-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#8A867A]">{label}</span>
          <div className="flex items-center gap-3 text-[10px] text-[#8A867A] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-[#D79A81] block border-t border-dashed"></span>
              <span>85° Perc.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-[#4A5D4E] block"></span>
              <span>50° Perc.</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-0.5 bg-[#8A867A] block border-t border-dashed"></span>
              <span>15° Perc.</span>
            </div>
          </div>
        </div>

        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px]">
          {/* Horizontal Grid lines & Y labels */}
          {yGrid.map((val) => (
            <g key={`y-${val}`}>
              <line
                x1={getX(0)}
                y1={getY(val)}
                x2={getX(12)}
                y2={getY(val)}
                stroke="#E8E4D9"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={getY(val) + 4}
                textAnchor="end"
                className="text-[10px] font-mono fill-[#8A867A] font-bold"
              >
                {val}
              </text>
            </g>
          ))}

          {/* Vertical Grid lines & X labels */}
          {xGrid.map((m) => (
            <g key={`x-${m}`}>
              <line
                x1={getX(m)}
                y1={getY(minY)}
                x2={getX(m)}
                y2={getY(maxY)}
                stroke="#E8E4D9"
                strokeWidth="1"
              />
              <text
                x={getX(m)}
                y={height - paddingBottom + 16}
                textAnchor="middle"
                className="text-[10px] font-mono fill-[#8A867A] font-bold"
              >
                {m === 0 ? 'Nascita' : `${m}M`}
              </text>
            </g>
          ))}

          {/* WHO Percentiles curves styled geometrically */}
          <path d={pathD15} fill="none" stroke="#8A867A" strokeWidth="1.5" strokeDasharray="3,3" />
          <path d={pathD85} fill="none" stroke="#D79A81" strokeWidth="1.5" strokeDasharray="3,3" />
          <path d={pathD50} fill="none" stroke="#4A5D4E" strokeWidth="2" />

          {/* Baby's Growth Curve in solid Charcoal for premium architectural look */}
          {sortedLogs.length > 0 && (
            <path
              d={`M ${sortedLogs.map(log => `${getX(log.monthsAge)},${getY(activeTab === 'weight' ? log.weight : activeTab === 'height' ? log.height : log.headCirc)}`).join(' L ')}`}
              fill="none"
              stroke="#2C2C2C"
              strokeWidth="2.5"
            />
          )}

          {/* Baby's Growth Points with Tooltips */}
          {sortedLogs.map((log) => {
            const val = activeTab === 'weight' ? log.weight : activeTab === 'height' ? log.height : log.headCirc;
            const cx = getX(log.monthsAge);
            const cy = getY(val);
            const detailPercentile = calculatePercentile(activeTab, profile.gender, log.monthsAge, val);

            return (
              <g key={log.id} className="group cursor-pointer">
                <rect
                  x={cx - 3}
                  y={cy - 3}
                  width="6"
                  height="6"
                  className="fill-[#2C2C2C] stroke-white stroke-1 transition-all group-hover:scale-125"
                />
                {/* Micro tooltip label */}
                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <rect
                    x={cx - 50}
                    y={cy - 38}
                    width="100"
                    height="26"
                    fill="#2C2C2C"
                    className="stroke-[#D1CEC4] stroke-1"
                  />
                  <text
                    x={cx}
                    y={cy - 22}
                    textAnchor="middle"
                    fill="#ffffff"
                    className="text-[9px] font-mono font-bold"
                  >
                    {val} {unit} ({detailPercentile.percentile}°)
                  </text>
                  <polygon
                    points={`${cx - 4},${cy - 12} ${cx + 4},${cy - 12} ${cx},${cy - 8}`}
                    fill="#2C2C2C"
                  />
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Metrics Cards Dashboard (Peso / Altezza / Circonferenza Cranica Latest values) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Weight Card */}
        <button
          onClick={() => setActiveTab('weight')}
          className={`text-left p-5 rounded-none border transition-all ${
            activeTab === 'weight'
              ? 'border-2 border-[#4A5D4E] bg-white shadow-sm'
              : 'border-[#D1CEC4] bg-white hover:bg-[#F2F0E9]/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-none border ${activeTab === 'weight' ? 'bg-[#4A5D4E]/10 border-[#4A5D4E] text-[#4A5D4E]' : 'bg-[#F2F0E9] border-[#D1CEC4] text-[#8A867A]'}`}>
              <Scale size={18} />
            </div>
            {latestLog && (
              <span className={`text-[10px] font-mono font-bold tracking-tight uppercase border rounded-none px-2 py-0.5 ${
                latestWeightPercentile!.percentile < 15 ? 'bg-[#D79A81]/10 text-[#C1856C] border-[#D79A81]/35' : 'bg-[#4A5D4E]/10 text-[#4A5D4E] border-[#4A5D4E]/35'
              }`}>
                Percentile: {latestWeightPercentile?.percentile}°
              </span>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8A867A]">Peso Corporeo</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-light text-[#4A5D4E]">
              {latestLog ? latestLog.weight.toFixed(2) : profile.birthWeight.toFixed(2)}
            </span>
            <span className="text-xs font-bold uppercase text-[#8A867A]">kg</span>
          </div>
          <p className="text-[10px] text-[#A29F94] font-semibold mt-1 uppercase">
            {latestLog ? `Rilevato: ${new Date(latestLog.date).toLocaleDateString('it-IT')}` : 'Altezza alla nascita'}
          </p>
        </button>

        {/* Height Card */}
        <button
          onClick={() => setActiveTab('height')}
          className={`text-left p-5 rounded-none border transition-all ${
            activeTab === 'height'
              ? 'border-2 border-[#4A5D4E] bg-white shadow-sm'
              : 'border-[#D1CEC4] bg-white hover:bg-[#F2F0E9]/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-none border ${activeTab === 'height' ? 'bg-[#4A5D4E]/10 border-[#4A5D4E] text-[#4A5D4E]' : 'bg-[#F2F0E9] border-[#D1CEC4] text-[#8A867A]'}`}>
              <Ruler size={18} />
            </div>
            {latestLog && (
              <span className={`text-[10px] font-mono font-bold tracking-tight uppercase border rounded-none px-2 py-0.5 ${
                latestHeightPercentile!.percentile < 15 ? 'bg-[#D79A81]/10 text-[#C1856C] border-[#D79A81]/35' : 'bg-[#4A5D4E]/10 text-[#4A5D4E] border-[#4A5D4E]/35'
              }`}>
                Percentile: {latestHeightPercentile?.percentile}°
              </span>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8A867A]">Lunghezza / Altezza</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-light text-[#4A5D4E]">
              {latestLog ? latestLog.height.toFixed(1) : profile.birthHeight.toFixed(1)}
            </span>
            <span className="text-xs font-bold uppercase text-[#8A867A]">cm</span>
          </div>
          <p className="text-[10px] text-[#A29F94] font-semibold mt-1 uppercase">
            {latestLog ? `Rilevato: ${new Date(latestLog.date).toLocaleDateString('it-IT')}` : 'Altezza alla nascita'}
          </p>
        </button>

        {/* Head Circumference Card */}
        <button
          onClick={() => setActiveTab('headCirc')}
          className={`text-left p-5 rounded-none border transition-all ${
            activeTab === 'headCirc'
              ? 'border-2 border-[#4A5D4E] bg-white shadow-sm'
              : 'border-[#D1CEC4] bg-white hover:bg-[#F2F0E9]/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-none border ${activeTab === 'headCirc' ? 'bg-[#4A5D4E]/10 border-[#4A5D4E] text-[#4A5D4E]' : 'bg-[#F2F0E9] border-[#D1CEC4] text-[#8A867A]'}`}>
              <HeartHandshake size={18} />
            </div>
            {latestLog && (
              <span className={`text-[10px] font-mono font-bold tracking-tight uppercase border rounded-none px-2 py-0.5 ${
                latestHeadCircPercentile!.percentile < 15 ? 'bg-[#D79A81]/10 text-[#C1856C] border-[#D79A81]/35' : 'bg-[#4A5D4E]/10 text-[#4A5D4E] border-[#4A5D4E]/35'
              }`}>
                Percentile: {latestHeadCircPercentile?.percentile}°
              </span>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#8A867A]">Circonferenza Cranica</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-light text-[#4A5D4E]">
              {latestLog ? latestLog.headCirc.toFixed(1) : profile.birthHeadCirc.toFixed(1)}
            </span>
            <span className="text-xs font-bold uppercase text-[#8A867A]">cm</span>
          </div>
          <p className="text-[10px] text-[#A29F94] font-semibold mt-1 uppercase">
            {latestLog ? `Rilevato: ${new Date(latestLog.date).toLocaleDateString('it-IT')}` : 'Altezza alla nascita'}
          </p>
        </button>
      </div>

      {/* Interactive Active Chart */}
      <div className="bg-[#F2F0E9] border border-[#D1CEC4] rounded-none p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#D1CEC4]/60">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-[#4A5D4E] text-sm flex items-center gap-2">
              <TrendingUp size={18} />
              Curva di Crescita e Percentili OMS
            </h3>
            <p className="text-xs text-[#8A867A] mt-1 leading-normal">
              Confronto della traiettoria di <b className="text-[#2C2C2C]">{profile.name}</b> con le curve di riferimento ufficiali OMS.
            </p>
          </div>
          {/* Chart Tab selector */}
          <div className="flex bg-[#E8E4D9] p-1 border border-[#D1CEC4] rounded-none w-fit">
            <button
              onClick={() => setActiveTab('weight')}
              className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none transition-all cursor-pointer ${activeTab === 'weight' ? activeBtnTheme : 'text-[#8A867A] hover:text-[#2C2C2C]'}`}
            >
              Peso
            </button>
            <button
              onClick={() => setActiveTab('height')}
              className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none transition-all cursor-pointer ${activeTab === 'height' ? activeBtnTheme : 'text-[#8A867A] hover:text-[#2C2C2C]'}`}
            >
              Altezza
            </button>
            <button
              onClick={() => setActiveTab('headCirc')}
              className={`text-[10px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-none transition-all cursor-pointer ${activeTab === 'headCirc' ? activeBtnTheme : 'text-[#8A867A] hover:text-[#2C2C2C]'}`}
            >
              Circ. Cranica
            </button>
          </div>
        </div>

        {renderSvgChart()}

        {latestLog && (
          <div className="mt-4 bg-white border border-[#D1CEC4] rounded-none p-4 flex items-start gap-3">
            <Info size={16} className="text-[#4A5D4E] shrink-0 mt-0.5" />
            <p className="text-xs text-[#2C2C2C] leading-relaxed">
              <span className="font-bold text-[#4A5D4E] uppercase tracking-wider text-[10px] block mb-1">Diagnostica Crescita</span>
              L'ultimo controllo mostra un valore di{' '}
              <b className="text-slate-900 font-mono">
                {activeTab === 'weight'
                  ? `${latestLog.weight} kg (Percentile: ${latestWeightPercentile?.text})`
                  : activeTab === 'height'
                  ? `${latestLog.height} cm (Percentile: ${latestHeightPercentile?.text})`
                  : `${latestLog.headCirc} cm (Percentile: ${latestHeadCircPercentile?.text})`}
              </b>
              . Una traiettoria di crescita che segue fedelmente un percentile indica il corretto svezzamento e assorbimento nutritivo.
            </p>
          </div>
        )}
      </div>

      {/* Split section: New entry form + History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form to log progress */}
        <div className="lg:col-span-5 bg-white border border-[#D1CEC4] rounded-none p-5 shadow-none">
          <h4 className="font-bold uppercase tracking-wider text-[#4A5D4E] text-xs mb-4 flex items-center gap-2">
            <Plus size={16} />
            Nuovo Rilevamento Crescita
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-[#D79A81]/15 text-[#C1856C] text-xs p-3 border border-[#D79A81]/40 rounded-none font-bold">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A867A] mb-1">Data Rilevazione</label>
                <input
                  type="date"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full text-xs p-2 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A867A] mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.001"
                  min="1"
                  max="30"
                  placeholder="Es. 5.250"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  required
                  className="w-full text-xs p-2 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A867A] mb-1">Altezza (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="110"
                  placeholder="Es. 58.5"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  required
                  className="w-full text-xs p-2 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A867A] mb-1">C. Cranica (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  min="25"
                  max="60"
                  placeholder="Es. 39.4"
                  value={headCircInput}
                  onChange={(e) => setHeadCircInput(e.target.value)}
                  required
                  className="w-full text-xs p-2 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8A867A] mb-1">Note e Osservazioni</label>
              <input
                type="text"
                placeholder="Es. Spuntato incisivo inferiore, ecc."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-[#D1CEC4] rounded-none focus:outline-none focus:border-[#4A5D4E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#4A5D4E] text-white hover:bg-[#3C4D3F] border border-[#4A5D4E] text-xs font-bold uppercase tracking-widest rounded-none flex justify-center items-center gap-2 cursor-pointer transition-all"
            >
              <Plus size={14} />
              Aggiungi Registrazione
            </button>
          </form>
        </div>

        {/* Historic list */}
        <div className="lg:col-span-7 bg-white border border-[#D1CEC4] rounded-none p-5 shadow-none overflow-hidden flex flex-col">
          <h4 className="font-bold uppercase tracking-wider text-[#4A5D4E] text-xs mb-4">Registro Cronologico Misurazioni</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#D1CEC4] text-[#8A867A] font-bold uppercase tracking-wider text-[10px] pb-2">
                  <th className="py-2">Età</th>
                  <th className="py-2">Peso</th>
                  <th className="py-2">Altezza</th>
                  <th className="py-2">C. Cranica</th>
                  <th className="py-2">Annotazioni</th>
                  <th className="py-2 text-right">Azione</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4D9]">
                {/* Always show Birth values first as immutable guide from state */}
                <tr className="text-slate-700 bg-[#F2F0E9]/40 font-mono">
                  <td className="py-3 pl-2">
                    <span className="font-sans font-bold text-[#4A5D4E]">Nascita</span>
                    <span className="block text-[9px] text-[#8A867A] font-sans font-semibold">{new Date(profile.birthDate).toLocaleDateString('it-IT')}</span>
                  </td>
                  <td className="py-3 font-bold">{profile.birthWeight.toFixed(3)} kg</td>
                  <td className="py-3 font-bold">{profile.birthHeight} cm</td>
                  <td className="py-3 font-bold">{profile.birthHeadCirc} cm</td>
                  <td className="py-3 text-[11px] italic text-[#8A867A] font-sans">Parametri di Nascita</td>
                  <td className="py-3 text-right"></td>
                </tr>

                {sortedLogs.map((log) => (
                  <tr key={log.id} className="text-[#2C2C2C] hover:bg-[#F2F0E9]/50 font-mono">
                    <td className="py-3">
                      <span className="font-sans font-bold text-[#4A5D4E]">
                        {log.monthsAge === 0 ? 'Nascita' : log.monthsAge < 1 ? `${Math.round(log.monthsAge * 30.4)} gg` : `${log.monthsAge.toFixed(1)} mesi`}
                      </span>
                      <span className="block text-[9px] text-[#8A867A] font-sans font-semibold">{new Date(log.date).toLocaleDateString('it-IT')}</span>
                    </td>
                    <td className="py-3 font-bold">{log.weight.toFixed(3)} kg</td>
                    <td className="py-3 font-bold">{log.height} cm</td>
                    <td className="py-3 font-bold">{log.headCirc} cm</td>
                    <td className="py-3 text-[11px] font-sans text-slate-600 max-w-[130px] truncate" title={log.notes}>
                      {log.notes || '-'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onDeleteLog(log.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 rounded-none hover:bg-red-50 transition cursor-pointer"
                        title="Cancella log"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
