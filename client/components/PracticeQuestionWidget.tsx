'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';
import { useLocale } from '@/src/contexts/LocaleContext';

const questions = [
  {
    id: 1,
    trade: 'CMEQ',
    topicFr: 'Code de l\'électricité — Protection des circuits',
    topicEn: 'Electrical Code — Circuit Protection',
    stemFr: 'Une résistance de 240 Ω est connectée à une source de 120 V. Quel est le courant qui la traverse ?',
    stemEn: 'A 240 Ω resistor is connected to a 120 V source. What current flows through it?',
    optionsFr: ['0,25 A', '0,5 A', '1 A', '2 A'],
    optionsEn: ['0.25 A', '0.5 A', '1 A', '2 A'],
    correctIndex: 1,
    explanationFr: 'Selon la loi d\'Ohm : I = V/R = 120 V / 240 Ω = 0,5 A. C\'est un calcul fondamental du Code de l\'électricité du Québec — Chapitre V.',
    explanationEn: 'By Ohm\'s Law: I = V/R = 120 V / 240 Ω = 0.5 A. This is a fundamental calculation from the Québec Electrical Code — Chapter V.',
    ref: 'Loi d\'Ohm — Code construction Québec, Chapitre V',
  },
  {
    id: 2,
    trade: 'CMMTQ',
    topicFr: 'Plomberie — Tuyauterie',
    topicEn: 'Plumbing — Piping',
    stemFr: 'Quel type de tuyau est le plus couramment utilisé pour l\'alimentation en eau potable dans les résidences au Québec ?',
    stemEn: 'Which type of pipe is most commonly used for potable water supply in Québec residences?',
    optionsFr: ['PVC', 'ABS', 'Cuivre type M', 'PEX'],
    optionsEn: ['PVC', 'ABS', 'Copper type M', 'PEX'],
    correctIndex: 3,
    explanationFr: 'Le PEX (polyéthylène réticulé) est devenu le standard pour l\'alimentation en eau potable résidentielle au Québec en raison de sa flexibilité, sa résistance au gel et sa facilité d\'installation.',
    explanationEn: 'PEX (cross-linked polyethylene) has become the standard for residential potable water supply in Québec due to its flexibility, freeze resistance, and ease of installation.',
    ref: 'Code de plomberie du Québec — Chapitre III, B51',
  },
  {
    id: 3,
    trade: 'QBQ',
    topicFr: 'Soudage — Procédés',
    topicEn: 'Welding — Processes',
    stemFr: 'Quel procédé de soudage utilise un fil-électrode continu et un gaz de protection pour produire la soudure ?',
    stemEn: 'Which welding process uses a continuous wire electrode and shielding gas to produce the weld?',
    optionsFr: ['SMAW', 'GMAW', 'FCAW', 'GTAW'],
    optionsEn: ['SMAW', 'GMAW', 'FCAW', 'GTAW'],
    correctIndex: 1,
    explanationFr: 'Le GMAW (Gas Metal Arc Welding), aussi appelé MIG/MAG, utilise un fil-électrode continu alimenté automatiquement et un gaz de protection (Argon/CO₂) pour protéger le bain de fusion.',
    explanationEn: 'GMAW (Gas Metal Arc Welding), also called MIG/MAG, uses a continuously fed wire electrode and shielding gas (Argon/CO₂) to protect the weld pool.',
    ref: 'CSA W47.1 — Qualification des entreprises de soudage',
  },
  {
    id: 4,
    trade: 'HVAC',
    topicFr: 'Thermodynamique — Cycles',
    topicEn: 'Thermodynamics — Cycles',
    stemFr: 'Quel composant du cycle de réfrigération augmente la pression du réfrigérant ?',
    stemEn: 'Which component of the refrigeration cycle increases the refrigerant pressure?',
    optionsFr: ['Évaporateur', 'Détendeur', 'Compresseur', 'Condenseur'],
    optionsEn: ['Evaporator', 'Expansion valve', 'Compressor', 'Condenser'],
    correctIndex: 2,
    explanationFr: 'Le compresseur aspire le réfrigérant à basse pression et le comprime à haute pression, augmentant sa température. C\'est le cœur du cycle de réfrigération.',
    explanationEn: 'The compressor draws in low-pressure refrigerant and compresses it to high pressure, raising its temperature. It is the heart of the refrigeration cycle.',
    ref: 'Principes de thermodynamique — Cycle de réfrigération à compression',
  },
  {
    id: 5,
    trade: 'MVL',
    topicFr: 'Moteurs diesel — Injection',
    topicEn: 'Diesel Engines — Injection',
    stemFr: 'Quelle est la pression d\'injection typique d\'un système Common Rail sur un moteur diesel lourd moderne ?',
    stemEn: 'What is the typical injection pressure of a Common Rail system on a modern heavy-duty diesel engine?',
    optionsFr: ['100-500 bars', '1 000-3 000 bars', '50-100 bars', '5 000-10 000 bars'],
    optionsEn: ['100-500 bar', '1,000-3,000 bar', '50-100 bar', '5,000-10,000 bar'],
    correctIndex: 1,
    explanationFr: 'Les systèmes Common Rail modernes injectent le carburant à des pressions de 1 000 à 3 000 bars pour une atomisation optimale, une combustion plus complète et des émissions réduites.',
    explanationEn: 'Modern Common Rail systems inject fuel at pressures of 1,000 to 3,000 bar for optimal atomization, more complete combustion, and reduced emissions.',
    ref: 'Manuel d\'entretien moteur diesel — Système Common Rail',
  },
  {
    id: 6,
    trade: 'CMEQ',
    topicFr: 'Code de l\'électricité — Mise à la terre',
    topicEn: 'Electrical Code — Grounding',
    stemFr: 'Selon le Code de construction du Québec, quelle est la couleur obligatoire du fil de mise à la terre ?',
    stemEn: 'According to the Québec Construction Code, what is the mandatory color for the grounding conductor?',
    optionsFr: ['Noir', 'Rouge', 'Vert ou dénudé', 'Blanc'],
    optionsEn: ['Black', 'Red', 'Green or bare', 'White'],
    correctIndex: 2,
    explanationFr: 'Le conducteur de mise à la terre doit être vert, ou vert avec un filet jaune, ou dénudé. C\'est une exigence fondamentale du Code pour assurer la sécurité des installations.',
    explanationEn: 'The grounding conductor must be green, or green with a yellow stripe, or bare. This is a fundamental Code requirement for installation safety.',
    ref: 'CCQ Chapitre V — Conducteurs de mise à la terre',
  },
];

export default function PracticeQuestionWidget() {
  const { t, locale } = useLocale();
  const isFr = locale === 'fr';
  const [question] = useState(() => questions[Math.floor(Math.random() * questions.length)]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (idx: number) => {
    if (revealed) return;
    setSelectedIndex(idx);
    setRevealed(true);
  };

  const isCorrect = selectedIndex === question.correctIndex;
  const answered = revealed;
  const stem = isFr ? question.stemFr : question.stemEn;
  const options = isFr ? question.optionsFr : question.optionsEn;
  const explanation = isFr ? question.explanationFr : question.explanationEn;
  const topic = isFr ? question.topicFr : question.topicEn;

  const tradeColors: Record<string, string> = {
    CMEQ: '#3B82F6',
    CMMTQ: '#06B6D4',
    QBQ: '#8B5CF6',
    HVAC: '#F59E0B',
    MVL: '#10B981',
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#06B6D4]/5 via-transparent to-[#3B82F6]/5" />
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <Zap className="inline w-6 h-6 text-[#F59E0B] -mt-1 mr-2" />
            <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">
              {isFr ? 'Essayez une vraie question d\'examen' : 'Try a Real Exam Question'}
            </span>
          </h2>
          <p className="text-[#94A3B8] max-w-xl mx-auto">
            {isFr
              ? 'Testez vos connaissances avec une question réelle. Sélectionnez votre réponse ci-dessous.'
              : 'Test your knowledge with a real exam question. Select your answer below.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A2035] to-[#0A0E1A] p-6 md:p-8 shadow-xl"
        >
          {/* Trade + Topic badge */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: tradeColors[question.trade] || '#3B82F6' }}
            >
              ?
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: tradeColors[question.trade] || '#3B82F6' }}>
              {question.trade} — {topic}
            </span>
          </div>

          {/* Question stem */}
          <p className="text-sm md:text-base text-[#F8FAFC] font-medium leading-relaxed mb-6">
            {stem}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {options.map((opt, idx) => {
              let optionStyle = 'border border-white/10 bg-white/[0.03] hover:border-[#3B82F6]/30 hover:bg-white/[0.06]';

              if (!answered) {
                optionStyle = 'border border-white/10 bg-white/[0.03] hover:border-[#3B82F6]/30 hover:bg-white/[0.06] cursor-pointer';
              } else if (idx === question.correctIndex) {
                optionStyle = 'border border-green-500/50 bg-green-500/10';
              } else if (idx === selectedIndex && !isCorrect) {
                optionStyle = 'border border-red-500/50 bg-red-500/10';
              } else {
                optionStyle = 'border border-white/5 bg-white/[0.02] opacity-50';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  className={`w-full text-left p-3 md:p-4 rounded-xl transition-all duration-200 ${optionStyle}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 mt-0.5 ${
                        answered && idx === question.correctIndex
                          ? 'bg-green-500 text-white'
                          : answered && idx === selectedIndex && !isCorrect
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-[#94A3B8]'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm md:text-sm text-[#94A3B8] leading-relaxed">
                      {opt}
                    </span>
                    {answered && idx === question.correctIndex && (
                      <span className="text-green-500 text-sm flex-shrink-0 ml-auto font-bold">✓</span>
                    )}
                    {answered && idx === selectedIndex && !isCorrect && (
                      <span className="text-red-500 text-sm flex-shrink-0 ml-auto font-bold">✗</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Result & Explanation */}
          {answered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div
                className={`p-4 rounded-xl mb-4 ${
                  isCorrect
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-red-500/10 border border-red-500/30'
                }`}
              >
                <p className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                  {isCorrect
                    ? (isFr ? '✅ Correct !' : '✅ Correct!')
                    : (isFr ? '❌ Pas tout à fait.' : '❌ Not quite.')}
                </p>
                <p className="text-xs md:text-sm text-[#94A3B8] leading-relaxed">
                  {explanation}
                </p>
                {question.ref && (
                  <p className="text-xs text-[#64748B] mt-2 italic">
                    {isFr ? 'Référence : ' : 'Reference: '}{question.ref}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/auth/register"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white text-sm font-semibold hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-300"
                >
                  {isFr ? 'Plus de 3 000 questions → Commencer gratuitement' : '3,000+ questions → Start Free'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
