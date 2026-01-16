import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Marques from './pages/Marques';
import Services from './pages/Services';
import Calculateurs from './pages/Calculateurs';
import Contact from './pages/Contact';

const bgDark = '/assets/bg/bg-dark.png';
const bgLight = '/assets/bg/bg-light.png';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const currentBg = theme === 'dark' ? bgDark : bgLight;
  console.log('Current bg path:', currentBg);

  return (
    <div className="relative min-h-screen">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{
          backgroundImage: `url(${currentBg})`
        }}
      />
      
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<Home theme={theme} />} />
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