import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { AuthContextProvider } from "../context/AuthContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS withCSSVariables>
      <AuthContextProvider>
        <Component {...pageProps} />
      </AuthContextProvider>
    </MantineProvider>
  );
}

export default MyApp;
