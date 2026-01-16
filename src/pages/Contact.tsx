import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Linkedin, ExternalLink } from 'lucide-react';

interface ContactProps {
  theme: 'dark' | 'light';
}

const Contact: React.FC<ContactProps> = ({ theme }) => {
  const isLight = theme === 'light';

  const cardClass = `rounded-2xl p-8 transition-all duration-300 border ${
    isLight 
      ? 'bg-white/40 backdrop-blur-md border-white/20' 
      : 'bg-black/40 backdrop-blur-md border-white/10'
  }`;

  const textClass = isLight ? 'text-black' : 'text-white';
  const textSecondaryClass = isLight ? 'text-gray-700' : 'text-gray-300';
  const iconClass = isLight ? 'text-gray-600' : 'text-gray-400';

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>OÙ NOUS</span>{' '}
              <span className="text-[#FF6B00]">TROUVER</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Venez découvrir nos produits et bénéficier de conseils personnalisés dans nos établissements.
              <br />
              Une équipe qualifiée vous attend.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className={cardClass}>
              <div className="mb-6">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-4 ${textClass}`}>
                  <MapPin className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  Notre localisation
                </h2>
                <p className={`text-sm mb-4 ${textSecondaryClass}`}>
                  1 Rue Magnier Bédu, 95410 Groslay
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1+Rue+Magnier+B%C3%A9du+95410+Groslay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-[#FF8533] transition-colors text-sm font-medium"
                >
                  Ouvrir dans Google Maps
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="rounded-xl overflow-hidden h-80 border border-white/10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2622.785234567890!2d2.3500000000000003!3d48.980000000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e665037a5514b%3A0x0000000000000000!2s1+Rue+Magnier+B%C3%A9du%2C+95410+Groslay!5e0!3m2!1sfr!2sfr!4v1699900000000!5m2!1sfr!2sfr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Yan's Deco - Groslay"
                />
              </div>
            </div>

            <div className={cardClass}>
              <div className="mb-8">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-6 ${textClass}`}>
                  <Clock className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  Horaires d'ouverture
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className={`text-sm ${textSecondaryClass}`}>Lundi - Vendredi</span>
                    <span className={`text-sm font-medium ${textClass}`}>07:30 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className={`text-sm ${textSecondaryClass}`}>Samedi</span>
                    <span className={`text-sm font-medium ${textClass}`}>09:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className={`text-sm ${textSecondaryClass}`}>Dimanche</span>
                    <span className={`text-sm font-medium text-[#FF6B00]`}>Fermé</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-4 ${textClass}`}>
                  <Phone className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  Contacts
                </h2>
                <div className="space-y-3">
                  <a
                    href="tel:+33661088905"
                    className={`flex items-center gap-3 text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                  >
                    <Phone className="w-4 h-4 text-[#FF6B00]" />
                    +33 6 61 08 89 05
                  </a>
                  <a
                    href="tel:+33667181020"
                    className={`flex items-center gap-3 text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                  >
                    <Phone className="w-4 h-4 text-[#FF6B00]" />
                    +33 6 67 18 10 20
                  </a>
                  <a
                    href="mailto:YANS.DECO95@GMAIL.COM"
                    className={`flex items-center gap-3 text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                  >
                    <Mail className="w-4 h-4 text-[#FF6B00]" />
                    YANS.DECO95@GMAIL.COM
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-4 ${textClass}`}>
                  <MapPin className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  Adresse
                </h2>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1+Rue+Magnier+B%C3%A9du+95410+Groslay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                >
                  1 Rue Magnier Bédu<br />
                  95410 Groslay<br />
                  <span className="text-[#FF6B00] text-xs mt-1 inline-block">Voir sur la carte →</span>
                </a>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className={`text-sm mb-4 ${textSecondaryClass}`}>Suivez-nous sur les réseaux sociaux</p>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/5 hover:bg-[#FF6B00] hover:text-black transition-all duration-300 group"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5 text-gray-400 group-hover:text-black" />
                  </a>
                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/5 hover:bg-[#FF6B00] hover:text-black transition-all duration-300 group"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5 text-gray-400 group-hover:text-black" />
                  </a>
                  <a
                    href="#"
                    className="p-3 rounded-full bg-white/5 hover:bg-[#FF6B00] hover:text-black transition-all duration-300 group"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-black" />
                  </a>
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