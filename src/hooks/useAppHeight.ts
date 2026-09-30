import { useEffect } from 'react';

/**
 * Ancla #app-root a la altura visible REAL del viewport. 100dvh no es fiable en
 * algunos navegadores Android/WebView (se resuelve más alto que el área visible),
 * lo que hacía scrollear la página y ocultaba la barra superior o la inferior.
 */
export function useAppHeight(): void {
  useEffect(() => {
    const setAppHeight = () => {
      const h = window.visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${h}px`);
    };
    setAppHeight();
    window.addEventListener('resize', setAppHeight);
    window.addEventListener('orientationchange', setAppHeight);
    window.visualViewport?.addEventListener('resize', setAppHeight);
    return () => {
      window.removeEventListener('resize', setAppHeight);
      window.removeEventListener('orientationchange', setAppHeight);
      window.visualViewport?.removeEventListener('resize', setAppHeight);
    };
  }, []);
}
