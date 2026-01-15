import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Accueil from './pages/Accueil';
import Catalogue from './pages/Catalogue';
import Marques from './pages/Marques';
import Services from './pages/Services';
import Calculateurs from './pages/Calculateurs';
import Contact from './pages/Contact';

type PageType = 'accueil' | 'catalogue' | 'marques' | 'services' | 'calculateurs' | 'contact';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('accueil');

  const renderPage = () => {
    switch (currentPage) {
      case 'accueil':
        return <Accueil />;
      case 'catalogue':
        return <Catalogue />;
      case 'marques':
        return <Marques />;
      case 'services':
        return <Services />;
      case 'calculateurs':
        return <Calculateurs />;
      case 'contact':
        return <Contact />;
      default:
        return <Accueil />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header currentPage={currentPage} onPageChange={(page) => setCurrentPage(page)} />
      <main>
        {renderPage()}
      </main>
      <Footer onPageChange={(page) => setCurrentPage(page)} />
    </div>
  );
};

export default App;
