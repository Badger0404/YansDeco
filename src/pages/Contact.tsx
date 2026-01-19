import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ExternalLink, Send, Video } from 'lucide-react';

interface ContactProps {
  theme: 'dark' | 'light';
}

const Contact: React.FC<ContactProps> = ({ theme }) => {
  const { t } = useTranslation();
  const isLight = theme === 'light';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const cardClass = `rounded-2xl transition-all duration-300`;

  const textClass = isLight ? 'text-black' : 'text-white';
  const textSecondaryClass = isLight ? 'text-gray-700' : 'text-gray-300';
  const inputClass = `w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
    isLight 
      ? 'bg-white/60 border border-gray-200 text-black placeholder-gray-500 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20' 
      : 'bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/20'
  }`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    
    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-black italic text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>{t('contact.title').split(' ')[0]}</span>{' '}
              <span className="text-[#FF6B00]">{t('contact.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className={cardClass}>
              <div className="mb-6">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-4 ${textClass}`}>
                  <MapPin className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  {t('contact.localisation')}
                </h2>
                <p className={`text-sm mb-4 ${textSecondaryClass}`}>
                  {t('contact.address')}
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1+Rue+Magnier+B%C3%A9du+95410+Groslay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-[#FF8533] transition-colors text-sm font-medium"
                >
                  {t('contact.openMaps')}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              <div className="rounded-2xl overflow-hidden h-80">
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
                  {t('contact.hours')}
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className={`text-sm ${textSecondaryClass}`}>{t('contact.mondayFriday')}</span>
                    <span className={`text-sm font-medium ${textClass}`}>07:30 - 17:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className={`text-sm ${textSecondaryClass}`}>{t('contact.saturday')}</span>
                    <span className={`text-sm font-medium ${textClass}`}>09:00 - 12:00</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className={`text-sm ${textSecondaryClass}`}>{t('contact.sunday')}</span>
                    <span className={`text-sm font-medium text-[#FF6B00]`}>{t('contact.closed')}</span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-4 ${textClass}`}>
                  <Phone className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  {t('contact.contacts')}
                </h2>
                <div className="space-y-3">
                  <a
                    href="tel:+33661088905"
                    className={`flex items-center gap-3 text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                  >
                    <Phone className="w-4 h-4 text-[#FF6B00]" />
                    {t('contact.phone1')}
                  </a>
                  <a
                    href="tel:+33667181020"
                    className={`flex items-center gap-3 text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                  >
                    <Phone className="w-4 h-4 text-[#FF6B00]" />
                    {t('contact.phone2')}
                  </a>
                  <a
                    href="mailto:YANS.DECO95@GMAIL.COM"
                    className={`flex items-center gap-3 text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                  >
                    <Mail className="w-4 h-4 text-[#FF6B00]" />
                    {t('contact.email')}
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-4 ${textClass}`}>
                  <MapPin className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  {t('contact.addressTitle')}
                </h2>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=1+Rue+Magnier+B%C3%A9du+95410+Groslay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-sm hover:text-[#FF6B00] transition-colors ${textSecondaryClass}`}
                >
                  {t('contact.address')}
                  <span className="text-[#FF6B00] text-xs mt-1 inline-block">{t('contact.seeMap')}</span>
                </a>
              </div>

              <div className="mb-8">
                <p className={`text-sm mb-4 ${textSecondaryClass}`}>{t('contact.socialTitle')}</p>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/yans_deco?igsh=ZnY4dTY2OGcwNTdv"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-white/5 hover:bg-[#FF6B00] transition-all duration-300 group"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                  <a
                    href="https://www.facebook.com/share/1BqkghiSWn/?mibextid=wwXIfr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-white/5 hover:bg-[#FF6B00] transition-all duration-300 group"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@yans.deco?_r=1&_t=ZN-936CikheAsg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-full bg-white/5 hover:bg-[#FF6B00] transition-all duration-300 group"
                    aria-label="TikTok"
                  >
                    <Video className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" />
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-6 ${textClass}`}>
                  <Send className="inline w-6 h-6 mr-2 text-[#FF6B00]" />
                  {t('contact.contactForm')}
                </h2>
                
                {submitStatus === 'success' && (
                  <div className="mb-4 p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-600 text-sm">
                    {t('contact.success')}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className={`block text-xs uppercase tracking-wide mb-2 ${textSecondaryClass}`}>
                      {t('contact.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.name')}
                      required
                      className={inputClass}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block text-xs uppercase tracking-wide mb-2 ${textSecondaryClass}`}>
                      {t('contact.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.email')}
                      required
                      className={inputClass}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className={`block text-xs uppercase tracking-wide mb-2 ${textSecondaryClass}`}>
                      {t('contact.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.message')}
                      required
                      rows={4}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FF6B00] text-black px-6 py-3 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF8533] hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        {t('contact.send')}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
