import React, { useState } from 'react';

interface Material {
  name: string;
  consumption: number;
  unit: string;
  coats: number;
}

interface CalculateursProps {
  theme: 'dark' | 'light';
}

const materials: Material[] = [
  { name: 'Peinture acrylique', consumption: 0.15, unit: 'litres/m²', coats: 2 },
  { name: 'Peinture glycéro', consumption: 0.12, unit: 'litres/m²', coats: 2 },
  { name: 'Sous-couche', consumption: 0.10, unit: 'litres/m²', coats: 1 },
  { name: 'Carrelage mural', consumption: 1.1, unit: 'm²/m²', coats: 1 },
  { name: 'Carrelage sol', consumption: 1.05, unit: 'm²/m²', coats: 1 },
  { name: 'Colle à carrelage', consumption: 3.5, unit: 'kg/m²', coats: 1 },
  { name: 'Ragréage sol', consumption: 1.5, unit: 'kg/m²/mm', coats: 1 },
  { name: 'Enduit de lissage', consumption: 1.0, unit: 'kg/m²/mm', coats: 1 },
  { name: 'Mortier de réparation', consumption: 1.9, unit: 'kg/m²/mm', coats: 1 },
];

const Calculateurs: React.FC<CalculateursProps> = ({ theme }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(materials[0]);
  const [area, setArea] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const isLight = theme === 'light';

  const calculate = () => {
    const areaNum = parseFloat(area);
    if (isNaN(areaNum) || areaNum <= 0) {
      setResult(null);
      return;
    }
    const quantity = areaNum * selectedMaterial.consumption * selectedMaterial.coats;
    setResult(Math.ceil(quantity * 10) / 10);
  };

  const cardClass = `p-8 transition-all duration-200 group ${
    isLight 
      ? 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg hover:border-[#FF6B00]' 
      : 'bg-gray-800 border border-gray-700 hover:border-[#FF6B00]'
  }`;

  const iconBgClass = isLight ? 'bg-gray-100' : 'bg-gray-700';
  const inputClass = `w-full px-4 py-2 transition-colors focus:outline-none ${
    isLight 
      ? 'bg-white border border-gray-300 text-black focus:border-[#FF6B00]' 
      : 'bg-gray-700 border border-gray-600 text-white focus:border-[#FF6B00]'
  }`;

  return (
    <main className="pt-24">
      <section className={`py-16 transition-colors duration-500 ${
        isLight ? 'bg-transparent' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-8 uppercase tracking-wider ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Calculateurs
          </h1>
          <p className={`mb-12 max-w-2xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Outils pratiques pour estimer vos besoins en matériaux et optimiser vos projets.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={cardClass}>
              <div className={`w-16 h-16 mb-6 flex items-center justify-center ${iconBgClass}`}>
                <svg className={`w-8 h-8 transition-colors ${
                  isLight ? 'text-gray-600 group-hover:text-[#FF6B00]' : 'text-gray-400 group-hover:text-[#FF6B00]'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide transition-colors ${
                isLight ? 'text-black group-hover:text-[#FF6B00]' : 'text-white group-hover:text-[#FF6B00]'
              }`}>
                MiMo-V2
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Calculateur de consommation de matériaux pour vos projets de construction et rénovation.
              </p>
              <span className="text-green-400 text-sm font-medium uppercase tracking-wide">
                Fonctionnel
              </span>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs uppercase tracking-wide mb-2 ${
                      isLight ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Matériau
                    </label>
                    <select
                      className={inputClass}
                      value={selectedMaterial.name}
                      onChange={(e) => {
                        const mat = materials.find(m => m.name === e.target.value);
                        if (mat) setSelectedMaterial(mat);
                      }}
                    >
                      {materials.map((mat) => (
                        <option key={mat.name} value={mat.name}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs uppercase tracking-wide mb-2 ${
                      isLight ? 'text-gray-600' : 'text-gray-400'
                    }`}>
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
                    className="w-full bg-[#FF6B00] text-black px-6 py-3 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                  >
                    Calculer
                  </button>

                  {result !== null && (
                    <div className={`p-4 mt-4 border ${
                      isLight ? 'bg-gray-100 border-gray-200' : 'bg-gray-700/50 border-gray-600'
                    }`}>
                      <p className={`text-xs uppercase tracking-wide mb-1 ${
                        isLight ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        Quantité estimée
                      </p>
                      <p className="text-[#FF6B00] text-2xl font-bold">
                        {result} <span className="text-sm">{selectedMaterial.unit.split('/')[0]}</span>
                      </p>
                      <p className={`text-xs mt-2 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                        {selectedMaterial.coats > 1 ? `(${selectedMaterial.coats} couches recommandées)` : '(1 couche)'}
                      </p>
                    </div>
                  )}

                  <div className={`text-xs mt-4 ${isLight ? 'text-gray-500' : 'text-gray-500'}`}>
                    <p>Consommation: {selectedMaterial.consumption} {selectedMaterial.unit}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={cardClass}>
              <div className={`w-16 h-16 mb-6 flex items-center justify-center ${iconBgClass}`}>
                <svg className={`w-8 h-8 transition-colors ${
                  isLight ? 'text-gray-600 group-hover:text-[#FF6B00]' : 'text-gray-400 group-hover:text-[#FF6B00]'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide transition-colors ${
                isLight ? 'text-black group-hover:text-[#FF6B00]' : 'text-white group-hover:text-[#FF6B00]'
              }`}>
                Calculateur de surface
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Estimez la surface à couvrir pour vos revêtements de sol et muraux.
              </p>
              <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-wide">
                Bientôt disponible
              </span>
            </div>

            <div className={cardClass}>
              <div className={`w-16 h-16 mb-6 flex items-center justify-center ${iconBgClass}`}>
                <svg className={`w-8 h-8 transition-colors ${
                  isLight ? 'text-gray-600 group-hover:text-[#FF6B00]' : 'text-gray-400 group-hover:text-[#FF6B00]'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold mb-3 uppercase tracking-wide transition-colors ${
                isLight ? 'text-black group-hover:text-[#FF6B00]' : 'text-white group-hover:text-[#FF6B00]'
              }`}>
                Calculateur de quantité
              </h3>
              <p className={`text-sm leading-relaxed mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                Déterminez la quantité exacte de matériaux nécessaire pour votre chantier.
              </p>
              <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-wide">
                Bientôt disponible
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Calculateurs;