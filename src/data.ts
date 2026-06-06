import { Milestone, PediatricVisit } from './types';

export const INITIAL_MILESTONES: Milestone[] = [
  // 0-2 Mesi
  {
    id: 'm1_motor_head',
    monthRange: '0-2 mesi',
    startMonth: 0,
    endMonth: 2,
    category: 'motor',
    title: 'Solleva la testa a pancia in giù',
    description: 'Quando si trova a pancia in giù (tummy time), riesce a sollevare momentaneamente la testa e a girarla di lato.',
    tips: [
      'Fai fare brevi sessioni di "Tummy Time" (pancia in giù) più volte al giorno, anche solo per 1-2 minuti, sulla tua pancia o su un tappeto morbido.',
      'Sostieni sempre la testa del neonato quando lo tieni in braccio o lo sollevi.'
    ]
  },
  {
    id: 'm1_cognitive_focus',
    monthRange: '0-2 mesi',
    startMonth: 0,
    endMonth: 2,
    category: 'cognitive',
    title: 'Fissazione visiva e inseguimento',
    description: 'Fissa brevemente un volto o un oggetto a forte contrasto (bianco/nero o colori caldi) a circa 20-30 cm di distanza.',
    tips: [
      'Mostra carte o libri illustrati a contrasto elevato (figure geometriche bianche e nere).',
      'Avvicinati al viso del bambino e parlagli dolcemente muovendoti piano a destra e a sinistra.'
    ]
  },
  {
    id: 'm1_language_cry',
    monthRange: '0-2 mesi',
    startMonth: 0,
    endMonth: 2,
    category: 'language',
    title: 'Reazione a suoni intensi e pianto differenziato',
    description: 'Si spaventa o si gira in risposta a rumori forti. Sviluppa diversi tipi di pianto per fame, sonno o fastidio.',
    tips: [
      'Impara a distinguere il tono del pianto (allattamento, pannolino, bisogno di calore).',
      'Parla a voce bassa ed evita rumori improvvisi o troppo forti vicino alla culla.'
    ]
  },
  {
    id: 'm1_social_smile',
    monthRange: '0-2 mesi',
    startMonth: 0,
    endMonth: 2,
    category: 'social',
    title: 'Sorriso endogeno e sociale',
    description: 'Inizia a sorridere spontaneamente (riflesso) e, verso i 2 mesi, risponde con un sorriso intenzionale al volto dei genitori.',
    tips: [
      'Sorridi spesso quando incroci lo sguardo del neonato.',
      'Crea un contatto pelle a pelle frequente per favorire il legame affettivo.'
    ]
  },

  // 3-4 Mesi
  {
    id: 'm3_motor_reach',
    monthRange: '3-4 mesi',
    startMonth: 3,
    endMonth: 4,
    category: 'motor',
    title: 'Sostiene il capo e afferra',
    description: 'Tiene la testa dritta stabilmente se tenuto seduto. Allunga la mano verso gli oggetti e prova ad afferrarli (prensione volontaria).',
    tips: [
      'Posiziona giochini colorati o sonagli sospesi ma vicini alle sue manine affinché provi a colpirli.',
      'Durante il Tummy Time, metti uno specchio infrangibile di fronte a lui per stimolare il sollevamento del busto.'
    ]
  },
  {
    id: 'm3_cognitive_hand',
    monthRange: '3-4 mesi',
    startMonth: 3,
    endMonth: 4,
    category: 'cognitive',
    title: 'Esplorazione delle mani',
    description: 'Tiene le mani aperte, le osserva con interesse ("scoperta delle mani") e le porta frequentemente alla bocca.',
    tips: [
      'Lascia le mani del bambino libere (evita guantini) affinché possa esplorarle con la bocca.',
      'Offri giochini di diverse consistenze e plastica morbida da dentizione sterile.'
    ]
  },
  {
    id: 'm3_language_coo',
    monthRange: '3-4 mesi',
    startMonth: 3,
    endMonth: 4,
    category: 'language',
    title: 'Vocalizzi di benessere (Coohing)',
    description: 'Inizia ad emettere suoni vocalici prolungati (tipo "ooo", "aaa", "guu") per esprimere gioia o rispondere alla tua voce.',
    tips: [
      'Rispondi ai suoi vocalizzi riproducendo gli stessi suoni, instaurando una vera e propria "conversazione".',
      'Canta canzoncine e ripeti filastrocche ritmate.'
    ]
  },
  {
    id: 'm3_social_laugh',
    monthRange: '3-4 mesi',
    startMonth: 3,
    endMonth: 4,
    category: 'social',
    title: 'Risate e gioia diffusa',
    description: 'Ride rumorosamente quando gli si fa il solletico o quando si gioca con lui. Esprime eccitazione muovendo braccia e gambe.',
    tips: [
      'Fai facce buffe e versi divertenti per aiutarlo a sviluppare la risata sonora.',
      'Inizia piccoli giochi di scambio visivo.'
    ]
  },

  // 5-6 Mesi
  {
    id: 'm5_motor_roll',
    monthRange: '5-6 mesi',
    startMonth: 5,
    endMonth: 6,
    category: 'motor',
    title: 'Rotolamento e appoggio seduto',
    description: 'Si gira autonomamente da pancia in su a pancia in giù (e viceversa). Se sostenuto, riesce a stare seduto dritto.',
    tips: [
      'Mettilo su un tappeto da gioco ampio e pulito e incentiva il rotolamento posizionando un giochino di lato.',
      'Non lasciarlo mai incustodito su superfici rialzate come divani o fasciatoi.'
    ]
  },
  {
    id: 'm5_cognitive_reach',
    monthRange: '5-6 mesi',
    startMonth: 5,
    endMonth: 6,
    category: 'cognitive',
    title: 'Passa gli oggetti da una mano all\'altra',
    description: 'Afferra saldamente un giocattolo e lo trasferisce intenzionalmente da una mano all\'altra, esplorandone i dettagli.',
    tips: [
      'Offri blocchi di legno leggeri o anelli di plastica facili da scambiare di mano.',
      'Gioca a "dare e prendere" un oggetto soffice della misura adatta.'
    ]
  },
  {
    id: 'm5_language_babble',
    monthRange: '5-6 mesi',
    startMonth: 5,
    endMonth: 6,
    category: 'language',
    title: 'Inizio della lallazione (Babbling)',
    description: 'Inizia a pronunciare sillabe accoppiate semplici come "ba-ba", "ma-ma", "da-da" in modo casuale.',
    tips: [
      'Usa un linguaggio chiaro, indicando gli oggetti di uso quotidiano con il loro nome corretto ("pappa", "mamma", "papà", "palla").',
      'Sfoglia libri rilegati in cartone spesso, indicando le figure degli animali ed emettendo il rispettivo verso.'
    ]
  },
  {
    id: 'm5_social_mirror',
    monthRange: '5-6 mesi',
    startMonth: 5,
    endMonth: 6,
    category: 'social',
    title: 'Riconosce i familiari e specchio',
    description: 'Distingue chiaramente i volti dei familiari da quelli degli estranei. Reagisce positivamente alla propria immagine riflessa nello specchio.',
    tips: [
      'Gioca al gioco del "Cucù" coprendoti il viso con le mani o con un fazzoletto morbido.',
      'Crea piccoli scambi di sorrisi davanti allo specchio indicando te e lui.'
    ]
  },

  // 7-9 Mesi
  {
    id: 'm7_motor_sit',
    monthRange: '7-9 mesi',
    startMonth: 7,
    endMonth: 9,
    category: 'motor',
    title: 'Siede da solo e gattona o striscia',
    description: 'Resta seduto stabilmente senza appoggio e senza cadere. Inizia a strisciare, spostarsi sul sederino o gattonare sulle ginocchia.',
    tips: [
      'Metti in sicurezza la casa (copri prese elettriche, angoli di mobili, scale) poiché ora è autonomo nei movimenti.',
      'Siediti sul pavimento con le gambe divaricate e lascia che il bambino si arrampichi e sperimenti la quadrupedia.'
    ]
  },
  {
    id: 'm7_cognitive_object',
    monthRange: '7-9 mesi',
    startMonth: 7,
    endMonth: 9,
    category: 'cognitive',
    title: 'Permanenza dell\'oggetto',
    description: 'Capisce che gli oggetti continuano ad esistere anche quando sono nascosti. Prova a cercare un giocattolo rimosso dalla sua vista.',
    tips: [
      'Nascondi parzialmente o totalmente un giocattolo sotto una coperta mentre ti osserva, poi chiedigli "Dov\'è il peluche?" spingendolo a cercarlo.',
      'Gioca con scatole a incastro o secchielli da riempire e svuotare.'
    ]
  },
  {
    id: 'm7_language_name',
    monthRange: '7-9 mesi',
    startMonth: 7,
    endMonth: 9,
    category: 'language',
    title: 'Risponde al proprio nome',
    description: 'Gira immediatamente la testa e sorride quando viene chiamato per nome. Comprende il significato di "No" (anche se non sempre ubbidisce).',
    tips: [
      'Chiamalo costantemente col suo nome di battesimo, riducendo l\'uso di soli vezzeggiativi quando devi attirare l\'attenzione.',
      'Utilizza un tono di voce fermo ma non arrabbiato quando utilizzi il "No" di sicurezza.'
    ]
  },
  {
    id: 'm7_social_stranger',
    monthRange: '7-9 mesi',
    startMonth: 7,
    endMonth: 9,
    category: 'social',
    title: 'Ansia da separazione ed diffidenza',
    description: 'Può piangere o aggrapparsi ai genitori se si avvicina un estraneo o se si esce dalla stanza. È una tappa fondamentale di attaccamento.',
    tips: [
      'Se devi allontanarti, salutalo sempre con serenità e rassicuralo che tornerai; non sparire all\'improvviso.',
      'Accetta questa fase con pazienza, si tratta di una normale maturazione dell\'indipendenza affettiva.'
    ]
  },

  // 10-12 Mesi
  {
    id: 'm10_motor_stand',
    monthRange: '10-12 mesi',
    startMonth: 10,
    endMonth: 12,
    category: 'motor',
    title: 'In piedi con appoggio e primi passi',
    description: 'Si tira in piedi autonomamente aggrappandosi a mobili o ringhiere. Cammina lateralmente appoggiandosi ("navigazione costiera") o muove i primi passi da solo.',
    tips: [
      'Incentiva la camminata tenendo il bimbo per le manine o offrendo un carrello primi passi stabile e zavorrato.',
      'Lascialo a piedi nudi il più possibile quando è in casa per migliorare lo sviluppo dell\'arco plantare e la propriocezione.'
    ]
  },
  {
    id: 'm10_cognitive_point',
    monthRange: '10-12 mesi',
    startMonth: 10,
    endMonth: 12,
    category: 'cognitive',
    title: 'Indica con l\'indice (Pointing)',
    description: 'Indica col dito oggetti o scene per condividere l\'interesse o chiedere qualcosa (attenzione condivisa). Sa usare gli oggetti secondo la loro funzione (es. pettine in testa).',
    tips: [
      'Guarda nella direzione indicata dal bimbo e descrivi ad alta voce l\'oggetto: "Sì, vedi il gatto fuori dalla finestra!"',
      'Incentiva l\'uso di giochini funzionali come una tazza giocattolo per "bere", o un cucchiaio per "mangiare".'
    ]
  },
  {
    id: 'm10_language_word',
    monthRange: '10-12 mesi',
    startMonth: 10,
    endMonth: 12,
    category: 'language',
    title: 'Prime parole con significato',
    description: 'Dice 1-3 parole semplici dotandole di significato preciso (es. "Mamma", "Papà", "Pappa", "Acqua") oltre ai versi imitativi.',
    tips: [
      'Ripeti correttamente la parola abbozzata: se dice "Aca", rispondi "Sì, l\'acqua! Vuoi bere l\'acqua?"',
      'Racconta storie brevi ogni sera prima di dormire, stimolando la memoria delle parole.'
    ]
  },
  {
    id: 'm10_social_wave',
    monthRange: '10-12 mesi',
    startMonth: 10,
    endMonth: 12,
    category: 'social',
    title: 'Saluta con la mano e coopera',
    description: 'Saluta con la mano dicendo "ciao-ciao" e gioca a dare e baciare. Aiuta ad estendere le braccia o infilare le maniche mentre lo si veste.',
    tips: [
      'Incoraggia i gesti sociali quotidiani (battere le mani "batti-le-manine", fare ciao con la manina).',
      'Coinvolgilo nel rito del vestirsi facendogli "indovinare" dove inserire la manina.'
    ]
  }
];

export const INITIAL_VISITS: PediatricVisit[] = [
  {
    id: 'v1_bilancio',
    title: '1° Bilancio di Salute',
    recommendedAgeRange: '15 - 30 giorni',
    ageMonths: 0.7,
    description: 'Primo controllo essenziale per valutare il recupero dal calo ponderale iniziale, l\'adattamento alla vita extrauterina e l\'avvio dell\'allattamento.',
    checks: [
      'Rilevazione di peso, lunghezza e circonferenza cranica per inserimento curve di crescita.',
      'Esame clinico generale ed neurologico (riflessi arcaici: Moro, suzione, prensione rettiliana).',
      'Controllo della cicatrizzazione del cordone ombelicale.',
      'Valutazione dello screening uditivo e metabolico neonatale.'
    ],
    vaccines: [
      'Nessun vaccino previsto in questo bilancio (si discute solo la profilassi e il calendario vaccinale imminente).'
    ],
    parentQuestions: [
      'Come posso essere sicuro che stia assumendo abbastanza latte?',
      'Qual è il ritmo e la consistenza delle evacuazioni considerate normali?',
      'Come gestire il singhiozzo o piccoli rigurgiti frequenti?',
      'Come procedere con l\'integrazione giornaliera di Vitamina D?'
    ],
    done: false
  },
  {
    id: 'v2_bilancio',
    title: '2° Bilancio di Salute',
    recommendedAgeRange: '2 - 3 mesi',
    ageMonths: 2.5,
    description: 'Verifica lo sviluppo motorio iniziale, l\'inseguimento della vista e il sorriso sociale. Si discute e coordina il primo ciclo di vaccinazioni.',
    checks: [
      'Rilevazione parametri di crescita (Peso/Altezza/Circonferenza cranica).',
      'Valutazione sostegno del capo in posizione ventrale e simmetria posturale.',
      'Controllo inseguimento visivo a 180° e reazione agli stimoli uditivi.',
      'Verifica ecosonografia delle anche (solito screening italiano del 2°-3° mese).'
    ],
    vaccines: [
      '1ª dose Vaccino Esavalente (Difterite, Tetano, Pertosse, Polio, Epatite B, Hib)',
      '1ª dose Vaccino Anti-Pneumococcico coniugato',
      '1ª o 2ª dose Anti-Rotavirus (orale)'
    ],
    parentQuestions: [
      'È corretto che stia sveglio più a lungo durante il giorno?',
      'Come posso lenire i fastidi legati alle coliche gassose serali?',
      'Pancia in giù (Tummy Time): quanto tempo deve farlo al giorno?',
      'Cosa fare in caso di febbre o malessere dopo la prima sessione di vaccini?'
    ],
    done: false
  },
  {
    id: 'v3_bilancio',
    title: '3° Bilancio di Salute',
    recommendedAgeRange: '4 - 5 mesi',
    ageMonths: 4.5,
    description: 'Controllo intermedio mirato sulla prensione manuale volontaria dei giochi, vocalizzi persistenti e coordinazione oculo-manuale.',
    checks: [
      'Misura parametri fisici e aggiornamento percentili.',
      'Esame dello sviluppo motorio: afferra attivamente e gioca con le proprie mani.',
      'Rilevazione della stabilità del capo ed esplorazione dell\'ambiente circostante.'
    ],
    vaccines: [
      '2ª dose Vaccino Esavalente',
      '2ª dose Vaccino Anti-Pneumococcico',
      '2ª dose Vaccino Anti-Meningococco B (se previsto in calendario regionale)'
    ],
    parentQuestions: [
      'Inizio a vedere molta bava, stanno spuntando i primi dentini?',
      'A che ora o dopo quale segnale è consigliabile iniziare a metterlo a dormire?',
      'Come programmare l\'introduzione di cibi diversi dal latte (Svezzamento/Autosvezzamento) nel prossimo mese?'
    ],
    done: false
  },
  {
    id: 'v4_bilancio',
    title: '4° Bilancio di Salute',
    recommendedAgeRange: '6 - 7 mesi',
    ageMonths: 6.5,
    description: 'Verifica la stabilità della postura seduta con o senza appoggio. Tappa chiave per impostare lo svezzamento introducendo le prime pappe.',
    checks: [
      'Monitoraggio della curva di crescita fisica.',
      'Valutazione della capacità di stare seduto dritto e dei tentativi di rotolamento.',
      'Ispezione della cavità orale per la comparsa dei primi incisivi inferiori.',
      'Verifica della scomparsa del riflesso di estrusione della lingua (fondamentale per svezzare).'
    ],
    vaccines: [
      'Eventuale dose di richiamo Antinfluenzale stagionale (se idoneo e raccomandato dal pediatra).'
    ],
    parentQuestions: [
      'Come posso strutturare le prime pappe? Che alimenti introdurre per primi?',
      'Il bambino rifiuta il cucchiaino: devo insistere o aspettare?',
      'Quanta acqua deve bere adesso che mangia cibi solidi?',
      'Come favorire l\'autonomia del sonno notturno?'
    ],
    done: false
  },
  {
    id: 'v5_bilancio',
    title: '5° Bilancio di Salute',
    recommendedAgeRange: '8 - 9 mesi',
    ageMonths: 8.5,
    description: 'Valutazione dello spostamento autonomo (strisciare, gattonare), svezzamento avanzato con masticazione di piccoli pezzetti, coordinazione dita (presa a pinza).',
    checks: [
      'Aggiornamento peso, statura e circonferenza del cranio.',
      'Controllo capacità di afferrare piccoli frammenti di cibo con pollice e indice.',
      'Verifica della lallazione ripetitiva (sillabazione "ba-ba", "da-da").',
      'Esame dei riflessi di difesa laterale e seduta solida senza cuscini.'
    ],
    vaccines: [
      'Nessun vaccino obbligatorio standard in questa esatta finestra, richiamo Meningococco B.'
    ],
    parentQuestions: [
      'Non gattona ma si sposta strisciando all\'indietro, è normale?',
      'Posso iniziare a offrirgli cibo a pezzetti morbidi dalle nostre portate (Autosvezzamento)?',
      'Come comportarsi di fronte all\'improvvisa paura degli estranei e pianto quando mi allontano?'
    ],
    done: false
  },
  {
    id: 'v6_bilancio',
    title: '6° Bilancio di Salute',
    recommendedAgeRange: '11 - 12 mesi',
    ageMonths: 11.5,
    description: 'Traguardo del primo compleanno. Valutazione della stazione eretta, primi passi, comprensione delle parole e coordinazione manipolativa complessa.',
    checks: [
      'Misura di crescita e bilancio generale del primo anno.',
      'Controllo appoggio dei piedi e cammino assistito o autonomo.',
      'Valutazione delle prime paroline con intento comunicativo.',
      'Esame della vista e controllo dei test di screening visivo nazionali (e.g., stereotesti).'
    ],
    vaccines: [
      '3ª dose Vaccino Esavalente',
      '3ª dose Vaccino Anti-Pneumococcico',
      '1ª dose Vaccino MPRV (Morbillo, Parotite, Rosolia, Varicella)',
      '1ª dose Vaccino Anti-Meningococco C o ACWY'
    ],
    parentQuestions: [
      'Non cammina ancora da solo a un anno, dobbiamo preoccuparci?',
      'Come passare dal latte artificiale/materno esclusivo al latte vaccino intero o crescita?',
      'Quante ore di sonno (compresi i pisolini) sono indicate adesso?',
      'Come gestire i primi capricci espressivi o morsi/lanci di oggetti?'
    ],
    done: false
  }
];

// Helper to provide smooth calculations of WHO weight/height/head circumference percentiles (50th percentile as baseline + standards)
// Boys and Girls from 0 to 12 months (WHO child growth standards median / SD)
export const WHO_GROWTH_CURVES = {
  male: {
    // month: [15th, 50th, 85th]
    weight: {
      0: [2.9, 3.3, 3.9],
      1: [3.9, 4.5, 5.1],
      2: [4.9, 5.6, 6.3],
      3: [5.7, 6.4, 7.2],
      4: [6.3, 7.0, 7.9],
      5: [6.9, 7.5, 8.4],
      6: [7.3, 7.9, 8.9],
      7: [7.6, 8.3, 9.3],
      8: [8.0, 8.6, 9.7],
      9: [8.3, 8.9, 10.1],
      10: [8.5, 9.2, 10.4],
      11: [8.7, 9.4, 10.7],
      12: [8.9, 9.6, 11.0]
    } as Record<number, number[]>,
    height: {
      0: [48.0, 49.9, 51.8],
      1: [52.8, 54.7, 56.7],
      2: [56.4, 58.4, 60.4],
      3: [59.4, 61.4, 63.5],
      4: [61.8, 63.9, 66.0],
      5: [63.8, 65.9, 68.0],
      6: [65.5, 67.6, 69.8],
      7: [67.0, 69.2, 71.3],
      8: [68.4, 70.6, 72.8],
      9: [69.7, 72.0, 74.2],
      10: [71.0, 73.3, 75.6],
      11: [72.2, 74.5, 76.9],
      12: [73.4, 75.7, 78.1]
    } as Record<number, number[]>,
    headCirc: {
      0: [33.5, 34.5, 35.5],
      1: [36.2, 37.3, 38.4],
      2: [37.9, 39.1, 40.2],
      3: [39.3, 40.5, 41.6],
      4: [40.4, 41.6, 42.7],
      5: [41.3, 42.6, 43.7],
      6: [42.1, 43.3, 44.5],
      7: [42.7, 44.0, 45.1],
      8: [43.3, 44.5, 45.7],
      9: [43.7, 45.0, 46.2],
      10: [44.1, 45.4, 46.6],
      11: [44.5, 45.8, 47.0],
      12: [44.8, 46.1, 47.3]
    } as Record<number, number[]>
  },
  female: {
    weight: {
      0: [2.8, 3.2, 3.7],
      1: [3.6, 4.2, 4.8],
      2: [4.5, 5.1, 5.8],
      3: [5.2, 5.8, 6.6],
      4: [5.7, 6.4, 7.3],
      5: [6.1, 6.9, 7.8],
      6: [6.5, 7.3, 8.2],
      7: [6.9, 7.6, 8.6],
      8: [7.2, 7.9, 9.0],
      9: [7.4, 8.2, 9.3],
      10: [7.7, 8.5, 9.6],
      11: [7.9, 8.7, 9.9],
      12: [8.1, 8.9, 10.1]
    } as Record<number, number[]>,
    height: {
      0: [47.2, 49.1, 51.0],
      1: [51.8, 53.7, 55.6],
      2: [55.0, 57.1, 59.1],
      3: [57.8, 59.8, 61.9],
      4: [60.1, 62.1, 64.3],
      5: [62.0, 64.0, 66.2],
      6: [63.6, 65.7, 67.9],
      7: [65.1, 67.3, 69.5],
      8: [66.5, 68.7, 71.0],
      9: [67.9, 70.1, 72.4],
      10: [69.1, 71.5, 73.8],
      11: [70.3, 72.8, 75.1],
      12: [71.4, 74.0, 76.4]
    } as Record<number, number[]>,
    headCirc: {
      0: [32.9, 33.9, 34.9],
      1: [35.4, 36.5, 37.6],
      2: [37.1, 38.2, 39.3],
      3: [38.4, 39.5, 40.6],
      4: [39.5, 40.6, 41.7],
      5: [40.4, 41.5, 42.6],
      6: [41.1, 42.2, 43.3],
      7: [41.7, 42.8, 43.9],
      8: [42.2, 43.4, 44.5],
      9: [42.7, 43.8, 44.9],
      10: [43.1, 44.2, 45.3],
      11: [43.4, 44.5, 45.6],
      12: [43.7, 44.8, 45.9]
    } as Record<number, number[]>
  }
};

// Simple calculator to estimate WHO percentile based on weight, height, or head circumference at physical age
export function calculatePercentile(
  type: 'weight' | 'height' | 'headCirc',
  gender: 'male' | 'female',
  months: number,
  value: number
): { percentile: number; text: string } {
  // Clamp month representation (0 to 12)
  const m = Math.max(0, Math.min(12, Math.round(months)));
  const curves = WHO_GROWTH_CURVES[gender][type][m];
  if (!curves) return { percentile: 50, text: 'Normale (50°)' };

  const [p15, p50, p85] = curves;

  if (value < p15) {
    const minEst = Math.max(1, Math.round(15 * (value / p15)));
    return { percentile: minEst, text: `Sotto la media (< 15° pc)` };
  } else if (value >= p15 && value < p50) {
    const rangeVal = p50 - p15;
    const progress = (value - p15) / rangeVal;
    const est = Math.round(15 + progress * 35);
    return { percentile: est, text: `Media-bassa (~ ${est}° pc)` };
  } else if (value >= p50 && value < p85) {
    const rangeVal = p85 - p50;
    const progress = (value - p50) / rangeVal;
    const est = Math.round(50 + progress * 35);
    return { percentile: est, text: `Media-alta (~ ${est}° pc)` };
  } else {
    const maxEst = Math.min(99, Math.round(85 + 14 * (value / p85 - 1)));
    return { percentile: maxEst, text: `Sopra la media (> 85° pc)` };
  }
}
