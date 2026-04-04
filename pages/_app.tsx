import type { AppProps } from "next/app";
import "../src/styles/global.css";

export default function NextApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}