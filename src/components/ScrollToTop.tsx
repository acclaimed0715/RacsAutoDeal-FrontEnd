import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    // Force scroll to top on initial page load/refresh
    if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTop;
