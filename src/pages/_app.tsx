import "regenerator-runtime/runtime";
import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useStore } from "store";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Driver, Toasts, Trace } from "components";
import { Web3ContextProvider, isPhone, isProduction } from "lib";
import customTheme from "styles/theme";

import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import "styles/globals.css";
import "styles/h5.css";
import "styles/markdown.css";



const MyApp = ({ Component, pageProps }: AppProps) => {
	const router = useRouter();
	const { toastMessage, toastType, toastTime, position, isClosable } =
		useStore();

	if (
		typeof window !== "undefined" &&
		window?.localStorage.getItem("chakra-ui-color-mode") !== "light"
	) {
		window?.localStorage.setItem("chakra-ui-color-mode", "light");
	}

	// useEffect(() => {
	// 	if (isPhone() && !router.pathname.includes("mobile")) {
	// 		router.push("/mobile");
	// 	}
	// }, [router]);

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
			<Web3ContextProvider>
				<div className="flex flex-col h-screen">
					<Component {...pageProps} className="flex-1" />
				</div>
				<Trace />
				{/* <Driver /> */}
				<Toasts
					message={toastMessage}
					type={toastType}
					time={toastTime}
					position={position}
					isClosable={isClosable || false}
				/>
			</Web3ContextProvider>
		</ChakraProvider>
	);
};

export default MyApp;