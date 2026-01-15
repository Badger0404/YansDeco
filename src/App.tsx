import React from 'react';
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
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/catalogue/:categoryId" element={<Catalogue />} />
          <Route path="/marques" element={<Marques />} />
          <Route path="/services" element={<Services />} />
          <Route path="/calculateurs" element={<Calculateurs />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
