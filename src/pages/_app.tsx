import "regenerator-runtime/runtime";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useStore } from "store";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toasts, Trace } from "components";
import { isPhone, isProduction } from "lib";
import customTheme from "styles/theme";
import useWallet from "hooks/useWallet";
import { WagmiProvider } from "wagmi";
import { Web3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import "react-vant/lib/index.css";
import "animate.css";
import "styles/markdown.css";
import "styles/globals.css";
import "styles/h5.css";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { toastMessage, toastType, toastTime } = useStore();
  const { wagmiConfig, projectId, queryClient } = useWallet();

  if (
    typeof window !== "undefined" &&
    window?.localStorage.getItem("chakra-ui-color-mode") !== "light"
  ) {
    window?.localStorage.setItem("chakra-ui-color-mode", "light");
  }

  return (
    <ChakraProvider theme={customTheme}>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${
          isProduction ? "G-YNSCSNVGKH" : "G-2EV36YE6VQ"
        }`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
      {isProduction
      ? `
                                                window.dataLayer = window.dataLayer || [];
                                                function gtag(){dataLayer.push(arguments);}
                                                gtag('js', new Date());

                                                gtag('config', 'G-YNSCSNVGKH');`
      : `window.dataLayer = window.dataLayer || [];
                                                function gtag(){dataLayer.push(arguments);}
                                                gtag('js', new Date());

                                                gtag('config', 'G-2EV36YE6VQ');`}
      </Script>

      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} className="flex-1" />
          <Trace />
          <Toasts message={toastMessage} type={toastType} time={toastTime} />
        </QueryClientProvider>
      </WagmiProvider>
    </ChakraProvider>
  );
};

export default MyApp;
