import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();
  const isReloading = useRef(false);
  const scrollDone = useRef(false);

  const scrollToTop = useCallback(() => {
    if (scrollDone.current && !isReloading.current) {
      return;
    }

    try {
      if (performance.now() < 100) {
        return;
      }

      window.scrollTo(0, 0);
      scrollDone.current = true;
      isReloading.current = false;

      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    } catch (e) {
      console.error('Scroll error:', e);
    }
  }, []);

  useEffect(() => {
    if (!scrollDone.current || isReloading.current) {
      const timer = setTimeout(() => {
        scrollToTop();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [pathname, search, scrollToTop]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      isReloading.current = true;
      scrollDone.current = false;
      sessionStorage.setItem('scrollReset', Date.now().toString());
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        scrollDone.current = false;
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pageshow', handlePageShow);

    const savedScroll = sessionStorage.getItem('scrollReset');
    if (savedScroll) {
      const timeDiff = Date.now() - parseInt(savedScroll);
      if (timeDiff < 100) {
        isReloading.current = true;
        scrollDone.current = false;
      }
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return null;
};

export default ScrollToTop;
