import { useEffect, useState } from 'react';
import '../styles/globals.css';
import { ThemeProvider } from 'styled-components';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { wrapper } from '../store/store';
import { themeWrapper } from '../theme';
import Layout from '../components/Layout';
import '../styles.css';

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const defaultTheme = themeWrapper();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  if (!hydrated) {
    // Returns null on first render, so the client and server match
    return null;
  }
  return (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}
