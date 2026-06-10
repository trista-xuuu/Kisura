import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // setTimeout ensures the DOM has painted the new page before scrolling
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  }, [pathname, search]);

  return null;
}
