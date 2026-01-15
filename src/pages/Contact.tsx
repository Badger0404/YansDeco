import React from 'react';

interface ContactProps {
  theme: 'dark' | 'light';
}

const Contact: React.FC<ContactProps> = ({ theme }) => {
  const isLight = theme === 'light';
  
  const locations = [
    { name: 'Groslay', address: 'Zone Industrielle, 95410 Groslay', phone: '01 23 45 67 89' },
    { name: 'Montmorency', address: 'Avenue Jean Monnet, 95160 Montmorency', phone: '01 23 45 67 90' },
    { name: 'Île-de-France', address: 'Secteur Parisien', phone: '01 23 45 67 91' }
  ];

  const inputClass = `w-full px-4 py-3 transition-colors focus:outline-none ${
    isLight 
      ? 'bg-white border border-gray-300 text-black placeholder-gray-500 focus:border-[#FF6B00]' 
      : 'bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-[#FF6B00]'
  }`;

  const cardClass = `p-6 transition-all duration-300 ${
    isLight 
      ? 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg' 
      : 'bg-gray-800/80 backdrop-blur-md border border-gray-700'
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
            Contact
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className={`text-2xl font-bold mb-6 uppercase tracking-wide ${
                isLight ? 'text-black' : 'text-white'
              }`}>
                Formulaire de contact
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm mb-2 uppercase tracking-wide ${
                      isLight ? 'text-gray-700' : 'text-gray-400'
                    }`}>Nom</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm mb-2 uppercase tracking-wide ${
                      isLight ? 'text-gray-700' : 'text-gray-400'
                    }`}>Prénom</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm mb-2 uppercase tracking-wide ${
                    isLight ? 'text-gray-700' : 'text-gray-400'
                  }`}>Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 uppercase tracking-wide ${
                    isLight ? 'text-gray-700' : 'text-gray-400'
                  }`}>Téléphone</label>
                  <input
                    type="tel"
                    className={inputClass}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 uppercase tracking-wide ${
                    isLight ? 'text-gray-700' : 'text-gray-400'
                  }`}>Sujet</label>
                  <select className={inputClass}>
                    <option>Demande de devis</option>
                    <option>Information produit</option>
                    <option>Service après-vente</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm mb-2 uppercase tracking-wide ${
                    isLight ? 'text-gray-700' : 'text-gray-400'
                  }`}>Message</label>
                  <textarea
                    className={`${inputClass} h-40 resize-none`}
                    placeholder="Décrivez votre projet ou votre demande..."
                  ></textarea>
                </div>
                <button className="bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                  Envoyer
                </button>
              </form>
            </div>

            <div>
              <h2 className={`text-2xl font-bold mb-6 uppercase tracking-wide ${
                isLight ? 'text-black' : 'text-white'
              }`}>
                Nos agences
              </h2>
              <div className="space-y-6 mb-8">
                {locations.map((loc, index) => (
                  <div key={index} className={cardClass}>
                    <h3 className="text-[#FF6B00] font-bold uppercase tracking-wide mb-2">{loc.name}</h3>
                    <p className={`text-sm mb-1 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{loc.address}</p>
                    <p className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>{loc.phone}</p>
                  </div>
                ))}
              </div>

              <div className={cardClass}>
                <h3 className={`font-bold uppercase tracking-wide mb-4 ${
                  isLight ? 'text-black' : 'text-white'
                }`}>Horaires d'ouverture</h3>
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span>Lundi - Vendredi</span>
                    <span>7h00 - 18h00</span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span>Samedi</span>
                    <span>8h00 - 17h00</span>
                  </div>
                  <div className={`flex justify-between ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </div>

              <div className={`mt-8 ${cardClass}`}>
                <h3 className={`font-bold uppercase tracking-wide mb-4 ${
                  isLight ? 'text-black' : 'text-white'
                }`}>Carte</h3>
                <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d209744.5877158955!2d2.224599285644086!3d48.89565071186338!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e6650377a5514b%3A0x4d26b24471303767!2s95410%20Groslay!5e0!3m2!1sfr!2sfr!4v1699900000000!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Yan's Deco - Groslay"
                    className="w-full h-full min-h-[300px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;