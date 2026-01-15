import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Catalogue from './pages/Catalogue';
import Marques from './pages/Marques';
import Services from './pages/Services';
import Calculateurs from './pages/Calculateurs';
import Contact from './pages/Contact';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      theme === 'dark' ? 'bg-black' : 'bg-gray-100'
    }`}>
      <div
        className="fixed inset-0 z-[-1] bg-fixed bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: `url('/assets/bg/bg-${theme}.svg')`
        }}
      />
      <div className="fixed inset-0 z-[-1] backdrop-blur-[1px] transition-all duration-500" />
      
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className={theme === 'dark' ? '' : 'light-theme'}>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue theme={theme} />} />
          <Route path="/catalogue/:categoryId" element={<Catalogue theme={theme} />} />
          <Route path="/marques" element={<Marques theme={theme} />} />
          <Route path="/services" element={<Services theme={theme} />} />
          <Route path="/calculateurs" element={<Calculateurs theme={theme} />} />
          <Route path="/contact" element={<Contact theme={theme} />} />
        </Routes>
      </main>
      <Footer theme={theme} />
    </div>
  );
};

export default App;