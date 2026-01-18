import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Material {
  id: number;
  name_ru: string;
  name_fr: string;
  name_en: string;
  consumption: number;
  unit: string;
  coats: number;
}

interface CalculateursProps {
  theme: 'dark' | 'light';
}

const Calculateurs: React.FC<CalculateursProps> = ({ theme }) => {
  const { i18n } = useTranslation();
const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/calculator-materials');
      const data = await response.json();
      if (data.success) {
        setMaterials(data.data);
        if (data.data.length > 0) {
          setSelectedMaterial(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const getMaterialName = (material: Material) => {
    const lang = i18n.language;
    switch (lang) {
      case 'ru': return material.name_ru;
      case 'en': return material.name_en;
      default: return material.name_fr;
    }
  };
  const [area, setArea] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const isLight = theme === 'light';

  const calculate = () => {
    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0 || !selectedMaterial) {
      setResult(null);
      return;
    }
    const quantity = areaNum * selectedMaterial.consumption * selectedMaterial.coats;
    setResult(Math.ceil(quantity * 10) / 10);
  };

  const cardClass = `relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] ${
    isLight 
      ? 'bg-white/30 hover:bg-white/50' 
      : 'bg-transparent hover:bg-white/5'
  } backdrop-blur-sm border border-white/10`;

  const iconBgClass = `w-16 h-16 mb-6 flex items-center justify-center rounded-xl ${
    isLight ? 'bg-white/30' : 'bg-white/5'
  }`;

  const inputClass = `w-full px-4 py-3 rounded-lg transition-colors focus:outline-none ${
    isLight 
      ? 'bg-white/40 border border-white/20 text-black focus:border-[#FF6B00]' 
      : 'bg-black/20 border border-white/10 text-white focus:border-[#FF6B00]'
  }`;

  const textClass = isLight ? 'text-black' : 'text-white';
  const descClass = isLight ? 'text-gray-700' : 'text-gray-300';
  const labelClass = isLight ? 'text-gray-600' : 'text-gray-400';

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>NOS</span>{' '}
              <span className="text-[#FF6B00]">CALCULATEURS</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Outils pratiques pour estimer vos besoins en matériaux et optimiser vos projets.
              <br />
              Calculs précis pour vos chantiers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 to-transparent" />
              <div className="relative p-6">
                <div className={iconBgClass}>
                  <svg className={`w-8 h-8 ${
                    isLight ? 'text-gray-600' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide ${textClass}`}>
                  MiMo-V2
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${descClass}`}>
                  Calculateur de consommation de matériaux pour vos projets de construction et rénovation.
                </p>
                <span className="text-green-400 text-sm font-medium uppercase tracking-wide">
                  Fonctionnel
                </span>

                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-xs uppercase tracking-wide mb-2 ${labelClass}`}>
                        Matériau
                      </label>
                      <select
                        className={inputClass}
                        value={selectedMaterial?.id || ''}
                        onChange={(e) => {
                          const mat = materials.find(m => m.id === parseInt(e.target.value));
                          if (mat) setSelectedMaterial(mat);
                        }}
                        disabled={!selectedMaterial}
                      >
                        {materials.map((mat) => (
                          <option key={mat.id} value={mat.id}>
                            {getMaterialName(mat)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={`block text-xs uppercase tracking-wide mb-2 ${labelClass}`}>
                        Surface (m²)
                      </label>
                      <input
                        type="number"
                        className={inputClass}
                        placeholder="Ex: 25"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && calculate()}
                      />
                    </div>

                    <button
                      onClick={calculate}
                      className="w-full bg-[#FF6B00] text-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-[#FF8533] transition-colors duration-200 rounded-lg"
                    >
                      Calculer
                    </button>

                    {result !== null && selectedMaterial && (
                      <div className={`p-4 mt-4 rounded-lg ${
                        isLight ? 'bg-white/40 border border-white/20' : 'bg-black/20 border border-white/10'
                      }`}>
                        <p className={`text-xs uppercase tracking-wide mb-1 ${labelClass}`}>
                          Quantité estimée
                        </p>
                        <p className="text-[#FF6B00] text-2xl font-bold">
                          {result} <span className="text-sm">{selectedMaterial.unit.split('/')[0]}</span>
                        </p>
                        <p className={`text-xs mt-2 ${labelClass}`}>
                          {selectedMaterial.coats > 1 ? `(${selectedMaterial.coats} couches recommandées)` : '(1 couche)'}
                        </p>
                      </div>
                    )}

                    {selectedMaterial && (
                      <div className={`text-xs mt-4 ${labelClass}`}>
                        <p>Consommation: {selectedMaterial.consumption} {selectedMaterial.unit}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 to-transparent" />
              <div className="relative p-6">
                <div className={iconBgClass}>
                  <svg className={`w-8 h-8 ${
                    isLight ? 'text-gray-600' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide ${textClass}`}>
                  Calculateur de surface
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${descClass}`}>
                  Estimez la surface à couvrir pour vos revêtements de sol et muraux.
                </p>
                <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-wide">
                  Bientôt disponible
                </span>
              </div>
            </div>

            <div className={cardClass}>
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/10 to-transparent" />
              <div className="relative p-6">
                <div className={iconBgClass}>
                  <svg className={`w-8 h-8 ${
                    isLight ? 'text-gray-600' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide ${textClass}`}>
                  Calculateur de quantité
                </h3>
                <p className={`text-sm leading-relaxed mb-4 ${descClass}`}>
                  Déterminez la quantité exacte de matériaux nécessaire pour votre chantier.
                </p>
                <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-wide">
                  Bientôt disponible
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Calculateurs;