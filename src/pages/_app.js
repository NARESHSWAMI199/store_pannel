import Head from 'next/head';
import { useEffect } from 'react';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { useAuth } from 'src/hooks/use-auth';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import { initializeApiClient } from 'src/utils/api-client';
import 'simplebar-react/dist/simplebar.min.css';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => null;

/**
 * Component to initialize API client with auth context and router
 * This runs after auth is loaded
 */
const ApiClientInitializer = ({ children }) => {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    // Initialize API client once auth is loaded
    if (!auth.isLoading) {
      initializeApiClient(auth, router);
    }
  }, [auth, router]);

  return children;
};

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Sales
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthConsumer>
              {
                (auth) => (
                  <ApiClientInitializer>
                    {
                      auth.isLoading
                        ? <SplashScreen />
                        : getLayout(<Component {...pageProps} />)
                    }
                  </ApiClientInitializer>
                )
              }
            </AuthConsumer>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
