import type { ReactNode } from "react";
import Head from "next/head";
import { NextSeo as Seo } from "next-seo";
import { useRouter } from "next/router";
import useChatContext from "hooks/useChatContext";

type NextSeoProps = {
	title: string;
	description?: string;
	keywords?: string;
};

export const NextSeo = ({ title, description, keywords }: NextSeoProps) => {
	return (
		<>
			<Head>
				<title>{title || "TypoGraphy AI"}</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
				/>
				<meta name="description" content={description || "Ai chart"} />
				<meta
					name="keywords"
					content={
						keywords ||
						"TypoGraphy, knn3-sdk, knn3, nft, web3, gpt, assignmet, metamask, api, sdk, blockchain, data service, openai, llm, workflow, event push"
					}
				/>
			</Head>
			<Seo
				title={title}
				description={
					description || "A Web3 ChatGPT to make web3 accessible to all"
				}
				openGraph={{
					title,
					description,
				}}
			/>
		</>
	);
};
