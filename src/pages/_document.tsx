/* eslint-disable react/jsx-props-no-spreading */
import { ColorModeScript } from "@chakra-ui/react";
import type { DocumentContext } from "next/document";
import Document, { Html, Head, Main, NextScript } from "next/document";

import customTheme from "./../styles/theme";

class MyDocument extends Document {
	static getInitialProps(ctx: DocumentContext) {
		return Document.getInitialProps(ctx);
	}

	render() {
		return (
			<Html lang="en">
				{/* <title>TypoGraphy AI</title> */}
				<Head>
					<link rel="apple-touch-icon" href="/logo.png" />
					<link rel="shortcut icon" href="/favicon.png" />
				</Head>
				<body>
					<ColorModeScript
						initialColorMode={customTheme.config?.initialColorMode}
					/>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
