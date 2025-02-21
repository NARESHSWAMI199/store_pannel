import { useEffect } from 'react';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';

export function useNProgress() {
  const router = useRouter();

  useEffect(() => { // Use useLayoutEffect
    const handleRouteChangeStart = () => nProgress.start();
    const handleRouteChangeError = () => nProgress.done();
    const handleRouteChangeComplete = () => nProgress.done();

    if (router.events) {
      router.events.on('routeChangeStart', handleRouteChangeStart);
      router.events.on('routeChangeError', handleRouteChangeError);
      router.events.on('routeChangeComplete', handleRouteChangeComplete);

      return () => {
        router.events.off('routeChangeStart', handleRouteChangeStart);
        router.events.off('routeChangeError', handleRouteChangeError);
        router.events.off('routeChangeComplete', handleRouteChangeComplete);
      };
    }

  }, [router]);
}