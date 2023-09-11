import "regenerator-runtime/runtime";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useStore } from "store";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Toasts, Trace } from "components";
import { Web3ContextProvider, isPhone, isProduction } from "lib";
import customTheme from "styles/theme";
import useWallet from 'lib/useWallet';

import "react-vant/lib/index.css";
import "animate.css";
import "styles/markdown.css";
import "styles/globals.css";
import "styles/h5.css";
import { WagmiConfig } from "wagmi";

const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const { toastMessage, toastType, toastTime } = useStore();
	const { networkConfig } = useWallet();

	if (
		typeof window !== "undefined" &&
		window?.localStorage.getItem("chakra-ui-color-mode") !== "light"
	) {
		window?.localStorage.setItem("chakra-ui-color-mode", "light");
	}

	useEffect(() => {
		if (!isPhone() && !location.host.includes("localhost")) {
			location.host.includes("staging")
				? router.push("https://typography.staging.knn3.xyz")
				: router.push("https://app.typography.vip/");
		}
	}, [router]);

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
			{/* <Web3ContextProvider> */}
			<WagmiConfig config={networkConfig}>
				<Component {...pageProps} className="flex-1" />
				<Trace />
				<Toasts message={toastMessage} type={toastType} time={toastTime} />
			{/* </Web3ContextProvider> */}
			</WagmiConfig>
		</ChakraProvider>
	);
};

export default MyApp;
