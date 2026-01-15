import React from 'react';

const Contact: React.FC = () => {
  const locations = [
    { name: 'Groslay', address: 'Zone Industrielle, 95410 Groslay', phone: '01 23 45 67 89' },
    { name: 'Montmorency', address: 'Avenue Jean Monnet, 95160 Montmorency', phone: '01 23 45 67 90' },
    { name: 'Île-de-France', address: 'Secteur Parisien', phone: '01 23 45 67 91' }
  ];

  return (
    <main className="pt-24">
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-wider">
            Contact
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                Formulaire de contact
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Nom</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-[#FF6B00] focus:outline-none transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Prénom</label>
                    <input
                      type="text"
                      className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-[#FF6B00] focus:outline-none transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-[#FF6B00] focus:outline-none transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Téléphone</label>
                  <input
                    type="tel"
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-[#FF6B00] focus:outline-none transition-colors"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Sujet</label>
                  <select className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-[#FF6B00] focus:outline-none transition-colors">
                    <option>Demande de devis</option>
                    <option>Information produit</option>
                    <option>Service après-vente</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2 uppercase tracking-wide">Message</label>
                  <textarea
                    className="w-full bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-[#FF6B00] focus:outline-none transition-colors h-40 resize-none"
                    placeholder="Décrivez votre projet ou votre demande..."
                  ></textarea>
                </div>
                <button className="bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                  Envoyer
                </button>
              </form>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-wide">
                Nos agences
              </h2>
              <div className="space-y-6 mb-8">
                {locations.map((loc, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 p-6">
                    <h3 className="text-[#FF6B00] font-bold uppercase tracking-wide mb-2">{loc.name}</h3>
                    <p className="text-gray-400 text-sm mb-1">{loc.address}</p>
                    <p className="text-gray-400 text-sm">{loc.phone}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 border border-gray-700 p-6">
                <h3 className="text-white font-bold uppercase tracking-wide mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Lundi - Vendredi</span>
                    <span>7h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Samedi</span>
                    <span>8h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Dimanche</span>
                    <span>Fermé</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-gray-800 border border-gray-700 p-6">
                <h3 className="text-white font-bold uppercase tracking-wide mb-4">Carte</h3>
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
